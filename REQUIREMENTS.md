# Project Requirements — Dropshipping E-Commerce Platform

## 1. Overview
A full-stack e-commerce platform for a dropshipping business. Admins manage products, monitor customers, and track sales performance. Customers browse products, add them to a cart, authenticate via email or Google, and pay via Stripe.

**Stack:** React + TypeScript (frontend), Express + TypeScript + Bun (backend), MongoDB (database), Stripe (payments), Better Auth (authentication).

---

## 2. User Roles

| Role | Description |
|---|---|
| **Guest** | Can browse products, view details. Must log in to purchase. |
| **Customer** | Can register/login, manage cart, checkout, view order history. |
| **Admin** | Can manage products, view customer info, view sales analytics. Full access to admin dashboard. |

---

## 3. Functional Requirements

### 3.1 Authentication
- FR-1: User can register with email + password, handled via Better Auth's email/password provider.
- FR-2: User can log in with email + password.
- FR-3: User can log in/register via Google OAuth, handled via Better Auth's Google social provider.
- FR-4: Password hashing, session token generation, and secure cookie handling are managed by Better Auth (no custom bcrypt/JWT implementation needed).
- FR-5: Sessions managed via Better Auth's built-in session store (DB-backed sessions in MongoDB), with automatic expiry/refresh.
- FR-6: Role-based access control — `customer` vs `admin` — implemented via Better Auth's additional user fields / plugin, checked in Express middleware.
- FR-7: Protected routes (cart, checkout, order history, admin panel) require a valid Better Auth session, verified server-side via `auth.api.getSession()`.
- FR-7a: Email verification on signup (Better Auth email verification flow) — optional, confirm priority for v1.

### 3.2 Product Catalog (Customer-facing)
- FR-8: Customer can view a paginated/filterable list of products (by category, price range).
- FR-9: Customer can view a single product detail page (images, description, price, stock status).
- FR-10: Customer can search products by name/keyword.
- FR-11: Out-of-stock products are clearly marked and non-purchasable.

### 3.3 Cart
- FR-12: Customer can add a product to the cart with a chosen quantity.
- FR-13: Customer can update quantity or remove items from the cart.
- FR-14: Cart persists across sessions for logged-in users (stored server-side).
- FR-15: Guest cart is stored client-side and merged into the account cart upon login.
- FR-16: Cart displays subtotal, and updates in real time as items change.

### 3.4 Checkout & Payments
- FR-17: Customer can proceed to checkout with items from the cart.
- FR-18: Customer enters/selects a shipping address.
- FR-19: Payment is processed via Stripe (Payment Intents / Checkout Session).
- FR-20: System supports at least one alternative payment method alongside Stripe (e.g., PayPal) — *stretch goal, confirm priority*.
- FR-21: On successful payment, an Order is created with status `paid`.
- FR-22: On failed/cancelled payment, cart is preserved and no order is created.
- FR-23: Stripe webhook confirms payment status server-side (not trusted from client alone).
- FR-24: Customer receives an order confirmation (in-app + email).

### 3.5 Order Management (Customer)
- FR-25: Customer can view their order history.
- FR-26: Customer can view the status of an individual order (`pending`, `paid`, `shipped`, `delivered`, `cancelled`).

### 3.6 Admin — Product Management
- FR-27: Admin can create a new product (title, description, price, images, category, stock, supplier info).
- FR-28: Admin can edit an existing product.
- FR-29: Admin can delete/deactivate a product.
- FR-30: Admin can upload product images (Cloudinary or similar).
- FR-31: Admin can track supplier cost vs. sale price (margin visibility) per product.
- FR-31a: Admin can enter SEO metadata per product when adding/editing it:
  - **SEO keywords/tags** (comma-separated or tag-input field) — used for search ranking and internal search matching.
  - **SEO meta title** (optional, falls back to product title if blank).
  - **SEO meta description** (optional, falls back to a truncated product description if blank).
  - **URL slug** (auto-generated from title, editable by admin) — used for clean product URLs (e.g., `/products/leather-messenger-bag`).

### 3.7 Admin — User Management
- FR-32: Admin can view a list of registered users.
- FR-33: Admin can view individual user details (name, email, order history, total spend).
- FR-34: Admin can search/filter users.

### 3.8 Admin — Sales Analytics
- FR-35: Admin dashboard displays a sales chart (revenue over time — daily/weekly/monthly).
- FR-36: Dashboard shows key metrics: total revenue, total orders, average order value, top-selling products.
- FR-37: Admin can filter analytics by date range.

---

## 4. Non-Functional Requirements

- NFR-1: **Security** — All admin routes protected by role middleware; authentication and password/session security delegated to Better Auth; Stripe keys never exposed client-side; input validation (Zod) on all API endpoints.
- NFR-2: **Performance** — Product listing paginated; images optimized/lazy-loaded; API responses cached where appropriate.
- NFR-3: **Responsiveness** — Fully responsive UI (mobile, tablet, desktop).
- NFR-4: **Type Safety** — End-to-end TypeScript on both frontend and backend.
- NFR-5: **Reliability** — Payment confirmation relies on Stripe webhooks, not client callbacks alone, to avoid lost/duplicate orders.
- NFR-6: **Scalability** — Backend structured to allow horizontal scaling (stateless API, DB-backed sessions).

---

## 5. Design Requirements

- Color palette:
  - `#000000` — primary text / high-contrast elements
  - `#1F150C` — dark backgrounds (header, footer, admin sidebar)
  - `#412D15` — primary buttons, links, accents
  - `#E1DCC9` — light backgrounds, cards, text-on-dark
- Component library: shadcn/ui + Tailwind CSS
- Must support clean, minimal, premium aesthetic (not generic e-commerce template look)

---

## 6. Core Data Entities

- **User** — managed primarily by Better Auth (id, name, email, emailVerified, image, accounts linked e.g. Google) plus app-specific fields: `role` (`customer` | `admin`), `addresses`
- **Product** — title, description, price, compareAtPrice, images, category, stock, supplierUrl, supplierPrice, isActive, slug, seo: { keywords[], metaTitle, metaDescription }
- **Cart** — userId, items (productId, qty)
- **Order** — userId, items (productId, qty, priceAtPurchase), totalAmount, status, stripePaymentIntentId, shippingAddress, createdAt

---

## 7. Out of Scope (v1)

-
- Product reviews/ratings
- Multi-currency/multi-language
- Automated supplier order fulfillment integration (e.g., auto-forwarding orders to AliExpress/supplier API)
-

---

## 8. Success Criteria (MVP)

- Customer can complete a full purchase flow: browse → cart → login → checkout → paid order.
- Admin can add a product and see it live on the storefront within the same session.
- Admin dashboard accurately reflects real order data in the sales chart.
- Google login and email login both function without errors.