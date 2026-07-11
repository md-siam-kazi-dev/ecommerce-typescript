# System Architecture — Dropshipping E-Commerce Platform

## 1. High-Level Architecture

```
┌─────────────────┐        ┌──────────────────────┐        ┌─────────────┐
│   React (TS)     │ HTTPS  │   Express (TS + Bun)  │        │  MongoDB    │
│   Vite frontend  │◄──────►│   REST API            │◄──────►│  (Atlas)    │
└─────────────────┘        └──────────┬────────────┘        └─────────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
              ┌─────────────┐  ┌──────────────┐  ┌───────────────┐
              │ Better Auth │  │    Stripe     │  │  Cloudinary    │
              │ (sessions,  │  │  (payments,   │  │ (product       │
              │  OAuth)     │  │   webhooks)   │  │  images)       │
              └─────────────┘  └──────────────┘  └───────────────┘
```

- **Frontend** and **backend** are separate deployables (as specified) — frontend is a static SPA build, backend is a standalone Bun-run Express API.
- Communication is REST/JSON over HTTPS. No GraphQL/tRPC in v1.
- Backend is stateless except for session lookups (delegated to Better Auth's DB-backed sessions), so it can scale horizontally behind a load balancer if needed later.

---

## 2. Backend Architecture (Bun + Express + TypeScript)

### 2.1 Folder Structure (Next.js-style route convention)

```
server/
├── src/
│   ├── app/
│   │   ├── index.ts                  # mounts all sub-routers
│   │   ├── products/
│   │   │   ├── route.ts              # GET/POST /products
│   │   │   ├── [id]/route.ts         # GET/PUT/DELETE /products/:id
│   │   │   ├── product.controller.ts
│   │   │   └── product.schema.ts     # Zod validation (incl. SEO fields)
│   │   ├── cart/
│   │   │   └── route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── checkout/
│   │   │   └── route.ts              # creates Stripe PaymentIntent/Session
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts       # verifies + handles Stripe events
│   │   └── admin/
│   │       ├── dashboard/route.ts    # sales analytics aggregation
│   │       └── users/route.ts        # admin user list/detail
│   ├── auth/
│   │   └── auth.ts                   # Better Auth instance + config
│   ├── models/
│   │   ├── UserProfile.model.ts      # app-specific fields (role, addresses)
│   │   ├── Product.model.ts
│   │   ├── Cart.model.ts
│   │   └── Order.model.ts
│   ├── middleware/
│   │   ├── requireAuth.middleware.ts # verifies Better Auth session
│   │   ├── requireAdmin.middleware.ts
│   │   └── error.middleware.ts
│   ├── lib/
│   │   ├── db.ts                     # Mongoose connection
│   │   ├── stripe.ts                 # Stripe client instance
│   │   └── cloudinary.ts
│   ├── types/
│   │   └── express.d.ts              # extends Request with req.session/user
│   ├── config/
│   │   └── env.ts                    # validated env vars (Zod)
│   └── index.ts                      # app entry point
├── .env
├── tsconfig.json
└── package.json
```

### 2.2 Layer Responsibilities

| Layer | Responsibility |
|---|---|
| `app/*/route.ts` | Route definitions only — wires HTTP verbs to controller functions, applies middleware |
| `*.controller.ts` | Request/response handling, calls services/models, returns JSON |
| `*.schema.ts` | Zod schemas for request validation (body/query/params) |
| `models/` | Mongoose schemas + TS interfaces (source of truth for data shape) |
| `middleware/` | Cross-cutting concerns: auth, role checks, error formatting |
| `lib/` | Third-party client instances (DB, Stripe, Cloudinary) — instantiated once, imported everywhere |
| `auth/auth.ts` | Single Better Auth configuration object, mounted as its own route group |

---

## 3. Authentication Architecture (Better Auth)

- Better Auth is initialized once in `src/auth/auth.ts` with:
  - **Database adapter**: MongoDB adapter, pointed at the same Mongo connection as the rest of the app.
  - **Providers**: `emailAndPassword` (enabled) + `google` social provider (client ID/secret from env).
  - **Session strategy**: DB-backed sessions (cookie-based), so sessions survive server restarts and work across multiple backend instances.
- Better Auth owns its own collections (`user`, `session`, `account`, `verification`) inside the same MongoDB database — these are **not** manually modeled in `models/`.
- App-specific data (like `role: 'customer' | 'admin'` and `addresses`) is stored in a **separate `UserProfile` collection**, linked by Better Auth's `userId`, rather than modifying Better Auth's internal user schema directly. This keeps Better Auth upgrades painless.
- Better Auth's handler is mounted directly in Express:
  ```ts
  app.all('/api/auth/*', toNodeHandler(auth));
  ```
  This single mount handles all auth endpoints (`/api/auth/sign-in/email`, `/api/auth/sign-in/google`, `/api/auth/sign-out`, `/api/auth/session`, callback URLs, etc.) — no custom login/register controllers needed.
- **`requireAuth.middleware.ts`** calls `auth.api.getSession({ headers: req.headers })` on each protected request; if no valid session, returns 401.
- **`requireAdmin.middleware.ts`** runs after `requireAuth`, looks up the linked `UserProfile.role`, and returns 403 if not `admin`.

### Auth Flow (email/password)
1. Client calls Better Auth's sign-up endpoint directly (via the Better Auth client SDK on the frontend).
2. Better Auth creates the `user` + `account` record, hashes the password internally, sets a session cookie.
3. Frontend fetches `/api/auth/session` (or uses the client SDK's session hook) to get the current user.
4. On first login, backend checks if a `UserProfile` exists for this `userId`; if not, creates one with `role: 'customer'`.

### Auth Flow (Google OAuth)
1. Frontend triggers Better Auth's Google sign-in (redirect flow).
2. Google redirects back to Better Auth's callback route; Better Auth creates/links the `account` + `user`.
3. Same `UserProfile` bootstrap logic applies as above.

---

## 4. Data Flow — Key Scenarios

### 4.1 Admin adds a product (with SEO fields)
1. Admin submits form → `POST /api/products` with body validated against `product.schema.ts` (includes `slug`, `seo.keywords`, `seo.metaTitle`, `seo.metaDescription`).
2. `requireAuth` → `requireAdmin` middleware run first.
3. Controller auto-generates `slug` from title if not provided, checks uniqueness.
4. Images uploaded to Cloudinary first (client-side or via a dedicated `/api/upload` route); URLs saved on the Product doc.
5. Product saved to MongoDB; response returns the created product.

### 4.2 Customer checkout
1. Client sends cart contents → `POST /api/checkout` (auth required).
2. Backend re-validates prices/stock server-side (never trusts client-sent prices).
3. Backend creates a Stripe Checkout Session or PaymentIntent, returns `clientSecret`/redirect URL.
4. Client completes payment on Stripe's hosted UI or embedded Elements.
5. Stripe sends a `payment_intent.succeeded` event to `POST /api/webhooks/stripe`.
6. Webhook handler verifies the Stripe signature, then creates the `Order` document with status `paid`. **This is the only place an order is marked paid** — not the client redirect — to prevent spoofed success states.

### 4.3 Admin dashboard sales chart
1. `GET /api/admin/dashboard?range=30d` (auth + admin required).
2. Controller runs a MongoDB aggregation pipeline over `Order` (grouped by day, summed `totalAmount`, counted orders).
3. Returns time-series JSON consumed by Recharts on the frontend.

---

## 5. Frontend Architecture (brief)

```
client/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── product/
│   │   ├── cart/
│   │   └── admin/
│   ├── pages/
│   ├── lib/
│   │   ├── auth-client.ts    # Better Auth React client (signIn, signUp, useSession)
│   │   ├── api.ts            # axios/fetch wrapper for backend REST calls
│   │   └── stripe.ts
│   ├── store/                # Zustand (cart)
│   ├── hooks/                # React Query hooks per resource
│   └── types/
```

- Better Auth ships a framework-agnostic client (`better-auth/client`) that gives `useSession()`, `signIn.email()`, `signIn.social({ provider: 'google' })`, `signOut()` — the frontend never manually manages tokens.
- React Query handles all non-auth server state (products, cart, orders); Zustand handles local/ephemeral cart state before sync.

---

## 6. Environment Variables (backend)

```
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_URL=
CLIENT_URL=http://localhost:5173
```

---

## 7. Deployment Notes (for later)

- Backend: any Bun-compatible host (Railway, Render, Fly.io).
- Frontend: static hosting (Vercel/Netlify), pointed at the backend API URL via env var.
- MongoDB: Atlas (managed).
- Stripe webhook endpoint must be publicly reachable and registered in the Stripe dashboard with the correct signing secret.
- CORS on the backend must explicitly allow the deployed frontend origin, and Better Auth's `trustedOrigins` config must include it too (separate from Express CORS).