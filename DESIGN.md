# Design System — Dropshipping E-Commerce Platform

## 1. Design Philosophy
Warm, minimal, premium — not a generic e-commerce template. Motion should feel **soft and intentional**: subtle easing, small distances, short durations. Nothing bounces, snaps, or overshoots. Every animation should feel like the UI is breathing, not performing.

---

## 2. Color Tokens

```css
:root {
  --color-black: #000000;      /* primary text, high-contrast elements */
  --color-espresso: #1F150C;   /* dark backgrounds: header, footer, admin sidebar */
  --color-umber: #412D15;      /* primary buttons, links, accents, hover states */
  --color-cream: #E1DCC9;      /* light backgrounds, cards, text-on-dark */
}
```

```ts
// tailwind.config.ts
colors: {
  black: '#000000',
  espresso: '#1F150C',
  umber: '#412D15',
  cream: '#E1DCC9',
}
```

| Token | Usage |
|---|---|
| `black` | Body text on light backgrounds, icons |
| `espresso` | Header/footer/admin sidebar background, dark-mode surface |
| `umber` | Buttons, links, active states, borders on focus, hover accents |
| `cream` | Page background, card background, text on dark surfaces |

---

## 3. Typography
- Font: **Inter** (or a warm serif for headings if a more boutique feel is wanted — confirm preference: e.g., **Fraunces** for H1/H2, Inter for body)
- Headings: 600 weight, tight letter-spacing (`-0.01em`)
- Body: 400 weight, 1.6 line-height for readability
- Scale: Tailwind default (`text-sm` → `text-4xl`), no custom scale needed for v1

---

## 4. Component Library — shadcn/ui

Use shadcn/ui as the base for all interactive components (Button, Card, Dialog, Input, Select, Sheet, Tabs, Skeleton, Badge). Do **not** hand-roll components shadcn already covers — customize via CSS variables and `className`, not by forking the component logic unless a genuine behavior gap exists.

### 4.1 Theming shadcn to the palette
Edit the generated CSS variables in `globals.css` (from `shadcn init`) to map to the palette instead of the default shadcn zinc/slate theme:

```css
:root {
  --background: 42 27% 87%;      /* cream */
  --foreground: 0 0% 0%;         /* black */
  --primary: 25 51% 17%;         /* umber */
  --primary-foreground: 42 27% 87%; /* cream */
  --card: 42 27% 91%;            /* slightly lighter cream */
  --border: 25 51% 17% / 0.15;   /* umber at low opacity */
  --radius: 0.5rem;
}

.dark {
  --background: 27 44% 8%;       /* espresso */
  --foreground: 42 27% 87%;      /* cream */
  --primary: 42 27% 87%;         /* cream */
  --primary-foreground: 27 44% 8%; /* espresso */
  --card: 27 40% 11%;
}
```
*(HSL values approximated from the hex palette — verify exact conversion when implementing.)*

### 4.2 Component conventions
- `rounded-lg` everywhere (matches `--radius`), no sharp corners, no heavy pill-shapes except badges/tags.
- Shadows: subtle only — `shadow-sm` on cards, no heavy drop shadows. Prefer a 1px `border-umber/10` over shadow for definition where possible.
- Buttons: solid `umber` primary, `outline` variant with `umber` border for secondary actions.

---

## 5. Motion System — Soft Hover & On-View Animation

### 5.1 Core motion principles
| Property | Value | Why |
|---|---|---|
| Duration | 200–350ms | Fast enough to feel responsive, slow enough to feel soft |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo-ish) or Tailwind's `ease-out` | Decelerates smoothly, no bounce |
| Distance | 4–12px max for translate | Small movement reads as "polish," large movement reads as "animation" |
| Scale | 1.0 → 1.02–1.03 max on hover | Anything larger feels gimmicky on product cards |
| Opacity | 0 → 1 paired with translate | Never animate opacity alone for on-view reveals — pair with motion for a felt effect |

### 5.2 Tooling
Two options, pick one:

**Option A — CSS-only (`tailwindcss-animate` + native `@starting-style`/IntersectionObserver hook)**
Lightweight, no extra JS bundle cost. Good if animations stay simple (fade+slide on hover/view).

```bash
bun add -d tailwindcss-animate
```
```ts
// tailwind.config.ts
plugins: [require('tailwindcss-animate')],
```

**Option B — Framer Motion** *(recommended if you want on-view reveals with stagger, e.g., product grid items animating in sequence)*
```bash
bun add framer-motion
```
More ergonomic for on-view (`whileInView`) and orchestrated animations across a grid.

**Recommendation:** Use Framer Motion for page-level/on-view reveals (product grids, section entrances), and plain Tailwind transition utilities for micro-interactions (button/card hover) — avoids over-relying on JS-driven animation for things CSS handles natively and cheaply.

### 5.3 Hover animations (Tailwind, CSS-only)

**Product card hover** — soft lift + image zoom:
```tsx
<div className="group rounded-lg border border-umber/10 bg-card overflow-hidden
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-md">
  <div className="overflow-hidden">
    <img
      className="transition-transform duration-500 ease-out group-hover:scale-105"
      src={product.image}
      alt={product.title}
    />
  </div>
  <div className="p-4">
    <h3 className="transition-colors duration-200 group-hover:text-umber">
      {product.title}
    </h3>
  </div>
</div>
```

**Button hover** — subtle color deepen, no scale (buttons shouldn't move, it hurts click precision):
```tsx
<Button className="transition-colors duration-200 ease-out hover:bg-umber/90">
  Add to Cart
</Button>
```

**Link/nav hover** — underline grow from left, not a snap-in:
```css
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0; bottom: -2px;
  width: 0; height: 1px;
  background: var(--color-umber);
  transition: width 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-link:hover::after {
  width: 100%;
}
```

### 5.4 On-view (scroll reveal) animations — Framer Motion

**Single element reveal:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
>
  <ProductCard product={product} />
</motion.div>
```

**Staggered grid reveal (product listing):**
```tsx
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

<motion.div
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
  className="grid grid-cols-4 gap-6"
>
  {products.map((p) => (
    <motion.div key={p.id} variants={item}>
      <ProductCard product={p} />
    </motion.div>
  ))}
</motion.div>
```

- `viewport={{ once: true }}` — reveal plays once, doesn't re-trigger on scroll up/down (avoids feeling repetitive/annoying).
- `amount: 0.2–0.3` — element only needs to be ~20–30% visible before triggering, so it doesn't feel delayed.

### 5.5 Where to apply motion (and where not to)
| Apply | Skip |
|---|---|
| Product cards (hover lift, image zoom) | Admin data tables (motion here feels slow, not premium) |
| Section entrances on homepage/landing | Form inputs (should feel instant, no delay on focus) |
| Cart drawer open/close (slide + fade) | Loading spinners (use simple, not "soft" motion) |
| CTA buttons (color/opacity only) | Checkout flow steps (speed > polish when money's involved) |

### 5.6 Accessibility
Always respect reduced-motion preference:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
With Framer Motion, wrap `whileInView` values behind a `useReducedMotion()` check if full opacity/no-translate fallback is desired instead of relying purely on the CSS override.

---

## 6. Summary of Dependencies to Add

```bash
bun add framer-motion
bun add -d tailwindcss-animate
```