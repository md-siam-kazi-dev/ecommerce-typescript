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
- FR-7: Protected routes (cart, checkout, `/dashboard/user/*`, `/dashboard/admin/*`) require a valid Better Auth session, verified server-side via `auth.api.getSession()`. `/dashboard/admin/*` additionally requires `role === "admin"` (see §6.2).
- FR-7a: Email verification on signup (Better Auth email verification flow) — optional, confirm priority for v1.

### 3.2 Product Catalog (Customer-facing)
- FR-8: Customer can view a paginated/filterable list of products (by category, price range).
- FR-9: Customer can view a single product detail page (images, description, price, stock status).
- FR-10: Customer can search products by name/keyword.
- FR-11: Out-of-stock products are clearly marked and non-purchasable.

### 3.2a Single Product Details Page
- FR-11a: Each product has a dedicated detail page accessible at a clean, SEO-friendly URL using its slug (e.g., `/products/leather-messenger-bag`), resolved server-side by slug (not by internal product ID).
- FR-11b: Page displays an image gallery: a main/large image plus a thumbnail strip of all product images; clicking a thumbnail swaps the main image. Supports zoom on the main image.
- FR-11c: If the product has variants (e.g., color, size), the customer can select variant options from a set of buttons/swatches or dropdowns. Selecting a variant updates:
  - the displayed price,
  - the displayed stock/availability status,
  - the main image (if that variant has a distinct image),
  - the SKU shown (if shown).
- FR-11d: Page displays: product title, price (and compare-at/"was" price with a discount badge if `compareAtPrice` is set), short + long description (rendered from rich text/HTML), category breadcrumb, and stock status (`In Stock`, `Low Stock`, `Out of Stock`).
- FR-11e: Quantity selector with increment/decrement, capped by available stock for the selected variant.
- FR-11f: "Add to Cart" button (disabled/relabeled when out of stock); action requires a variant to be selected first if the product has variant options.
- FR-11g: Page renders SEO metadata (`<title>`, meta description, canonical URL, Open Graph tags) sourced from the product's `seo` fields (FR-31a), falling back to product title/description when SEO fields are blank.
- FR-11h: Below the fold, a "You may also like" section shows related products from the same category.
- FR-11i: If the resolved slug does not match any active product, return a 404 page (not a broken/empty page).
- FR-11j: Page is server-rendered or statically generated where feasible for SEO and fast first paint (product data fetched on the server, not purely client-side after load).
- FR-11k: Long description supports embedded images (as sourced from admin-entered rich text / supplier import), lazy-loaded per NFR-2.

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
- **Product** — see full schema below (§6.1)
- **Cart** — userId, items (productId, variantId, qty)
- **Order** — userId, items (productId, variantId, qty, priceAtPurchase), totalAmount, status, stripePaymentIntentId, shippingAddress, createdAt

### 6.1 Product Data Schema

The platform sources product data from dropshipping suppliers (e.g., CJdropshipping) and republishes a normalized subset to the storefront. Two layers exist: a **raw supplier snapshot** (kept for reference/re-sync) and the **normalized Product** used by the app. Money fields are stored in the store's selling currency as decimals (or integer cents, per implementation choice — pick one and use consistently).

**Normalized `Product` (MongoDB document):**

```ts
interface Product {
  _id: ObjectId;
  slug: string;                 // unique, URL-safe, editable by admin (FR-31a)
  title: string;                // storefront display name (curated from supplier's productNameEn)
  description: string;          // rich text / HTML, admin-editable, may include embedded images
  shortDescription?: string;    // optional teaser for listing cards

  category: {
    id: string;
    name: string;               // e.g. "Women's Clothing > Outerwear & Jackets > Wool & Blend"
  };

  images: string[];             // ordered gallery image URLs; first = primary/bigImage equivalent

  basePrice: number;            // default/starting sell price shown on listing when no variant selected
  compareAtPrice?: number;      // optional "was" price for discount badge

  hasVariants: boolean;
  variantAttributes: string[];  // e.g. ["Color", "Size"] — drives which selectors render on PDP

  variants: ProductVariant[];   // at least one variant even for "simple" products (single implicit variant)

  stock: number;                // aggregate/derived from variants when hasVariants = true
  isActive: boolean;            // false = deactivated/hidden from storefront (FR-29)

  seo: {
    keywords: string[];         // FR-31a — comma-separated tags, used for search ranking/matching
    metaTitle?: string;         // falls back to `title` if blank
    metaDescription?: string;   // falls back to truncated `description` if blank
  };

  supplier: {
    source: string;             // e.g. "CJdropshipping"
    supplierProductId: string;  // maps to supplier's `pid`
    supplierSku: string;        // maps to supplier's `productSku`
    supplierUrl?: string;
    supplierCost: number;       // cost basis, used for margin visibility (FR-31); NEVER exposed to storefront
  };

  weightGrams?: number;         // for shipping calculations, from supplier's productWeight
  dimensionsMm?: {              // from supplier's variantStandard/length/width/height, if used for shipping
    length: number;
    width: number;
    height: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  variantId: string;            // maps to supplier's `vid`; internal unique id within the product
  sku: string;                  // maps to supplier's `variantSku`
  optionValues: Record<string, string>;
  // e.g. { "Color": "Dark Grey", "Size": "XL" } — parsed from supplier's variantKey ("Dark Grey-XL")

  image?: string;               // variant-specific image (falls back to product.images[0] if absent)
  price: number;                // sell price for this specific variant
  compareAtPrice?: number;
  stock: number;                // per-variant inventory count
  supplierCost?: number;        // per-variant cost, if it differs from product-level supplierCost
  barcode?: string;
  weightGrams?: number;
}
```

**Mapping notes (supplier → normalized schema):**

| Supplier field (e.g. CJdropshipping) | Normalized field |
|---|---|
| `pid` | `supplier.supplierProductId` |
| `productSku` | `supplier.supplierSku` |
| `productNameEn` | `title` (source; admin edits before publish) |
| `description` (HTML) | `description` |
| `productImageSet` / `bigImage` | `images` (first entry = primary) |
| `categoryName` / `categoryId` | `category.name` / `category.id` |
| `sellPrice` (supplier's cost to us) | `supplier.supplierCost` — **not** the storefront price |
| `suggestSellPrice` | reference only; admin sets actual `basePrice` / variant `price` |
| `productWeight` | `weightGrams` |
| `variants[].vid` | `variants[].variantId` |
| `variants[].variantSku` | `variants[].sku` |
| `variants[].variantKey` (e.g. `"Dark Grey-XL"`) | parsed into `variants[].optionValues` using `productKeyEnSet` (e.g. `["Color","Size"]`) as the key order |
| `variants[].variantImage` | `variants[].image` |
| `variants[].variantSellPrice` | supplier's cost for that variant → `variants[].supplierCost` |
| `variants[].variantWeight` | `variants[].weightGrams` |
| `variants[].barcode` | `variants[].barcode` |

**Import/sync notes:**
- Admin-facing "Add Product" flow (FR-27) can either be built manually or pre-filled by importing a supplier product (paste supplier product ID/URL); imported data is staged for admin review before `isActive: true` (title, description, images, and — critically — **selling price** must be set/reviewed by the admin, since supplier prices are cost basis, not sale price).
- `variantKey` strings from the supplier are `-`-delimited and must be split using the supplier's `productKeyEnSet` order to build `optionValues` reliably (order is not guaranteed to be alphabetical, e.g. Color before Size).
- Supplier product/variant IDs should be stored (not discarded) to support re-sync (price/stock refresh) and to avoid duplicate imports.

---

## 6.2 Dashboard Navigation Structure

Both customer and admin dashboards live under a shared `/dashboard` parent route, split by role: `/dashboard/user/*` and `/dashboard/admin/*`. Both trees are protected server-side via `auth.api.getSession()` plus role check (NFR-1) — sidebar visibility is a UX convenience, not the access control mechanism. A `customer` visiting `/dashboard/admin/*` (or vice versa) must be redirected/403'd server-side, not just hidden client-side.

### 6.2.1 Customer Dashboard — `/dashboard/user`

| Nav Label | Route | Maps to |
|---|---|---|
| Overview | `/dashboard/user` | Summary: recent orders, saved addresses |
| My Orders | `/dashboard/user/orders` | FR-25, FR-26 (order history + status) |
| Addresses | `/dashboard/user/addresses` | FR-18 (shipping addresses) |
| Profile | `/dashboard/user/profile` | Name, email, password (Better Auth) |
 |
| Wishlist | `/dashboard/user/wishlist` | *Optional — out of scope for v1 unless prioritized* |

Cart (`/cart`) and checkout live outside `/dashboard/user` since guests can also access a cart; only account-scoped views sit under the dashboard.

### 6.2.2 Admin Dashboard — `/dashboard/admin`

| Nav Label | Route | Maps to |
|---|---|---|
| Overview | `/dashboard/admin` | FR-35–37 (revenue chart, key metrics) |
| Products | `/dashboard/admin/products` | FR-27–31a (list, add, edit, SEO, margin) |
| Categories | `/dashboard/admin/categories` | Supports FR-8, FR-27 category assignment |
| Orders | `/dashboard/admin/orders` | Order list/status management (supports FR-21–23) |
| Customers | `/dashboard/admin/customers` | FR-32–34 (user list, details, search) |
| Analytics | `/dashboard/admin/analytics` | FR-35–37, if split out from Overview |
| Settings | `/dashboard/admin/settings` | Store info, shipping rules, Stripe key status (never the raw key, per NFR-1) |
| Admin Users | `/dashboard/admin/team` | *Optional — manage which users hold the `admin` role* |

**Suggested sidebar grouping (admin):**
```
DASHBOARD
  Overview                /dashboard/admin

CATALOG
  Products                /dashboard/admin/products
  Categories              /dashboard/admin/categories

SALES
  Orders                  /dashboard/admin/orders
  Analytics               /dashboard/admin/analytics

PEOPLE
  Customers               /dashboard/admin/customers
  Admin Users (optional)  /dashboard/admin/team

SETTINGS
  Store Settings          /dashboard/admin/settings
```

**Implementation notes:**
- FR-38 (new): The app exposes a single shared dashboard shell/layout component with a role-aware sidebar; the sidebar renders the customer nav or admin nav based on the authenticated user's `role`, but the underlying routes remain fully guarded server-side regardless of what the sidebar shows.
- FR-39 (new): `/dashboard/admin/products` and `/dashboard/admin/orders` show live badge counts (e.g., low-stock product count, pending-order count) — read from the same data used in FR-36 metrics.
- FR-40 (new): Deep-linking directly to a `/dashboard/admin/*` URL as a `customer` role returns a 403/redirect to `/dashboard/user`, not a blank or broken page.

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