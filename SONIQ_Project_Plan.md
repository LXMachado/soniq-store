# SŌNIQ — Headless Shopify Demo Store
## Comprehensive Project Plan, Architecture & Design

**Stack:** Vite · Hydrogen · Tailwind CSS v4 · TypeScript · GraphQL · Shopify Storefront API · Framer Motion
**Niche:** Premium Audio / Hi-Fi Gear
**Design:** Dark Editorial (Apple / Teenage Engineering aesthetic)

---

# 1. Project Overview

SŌNIQ is a fictional premium audio brand selling high-end headphones, DACs, amplifiers, and cables. The store is a headless Shopify storefront — built to showcase advanced frontend engineering and Shopify Storefront API integration. The mock data layer is swap-ready: replace one `.env` flag and the store runs against a live Shopify backend with zero component changes.

**Brand name:** SŌNIQ
**Tagline:** Engineering sound. Obsessively.
**Aesthetic:** Dark, editorial, minimal — confident and precise
**Target audience:** Audiophiles, music producers, sound engineers, tech enthusiasts
**Tone of voice:** Technical and restrained — no hype, no superlatives

## 1.1 Product Catalogue

| Category | Example Products |
|---|---|
| Over-ear headphones | SŌNIQ H1 Pro, SŌNIQ H1 Open-Back |
| In-ear monitors (IEMs) | SŌNIQ E3, SŌNIQ E3 Reference |
| DAC / Amplifiers | SŌNIQ D1 Desktop DAC, SŌNIQ A2 Headphone Amp |
| Cables & accessories | Balanced XLR, 4.4mm Pentaconn cable, ear tips |
| Limited drops | Collab editions, colourways, engineer series |

## 1.2 Goals

- Demonstrate headless Shopify architecture with real Storefront API integration
- Showcase advanced frontend skills: animations, variant UX, metafields, filtering
- Achieve excellent Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Serve as a portfolio piece and handoff-ready codebase for multiple agents
- Be swap-ready: mock data replaced by live Shopify API with a single env change

---

# 2. Tech Stack

| Technology | Role & Rationale |
|---|---|
| Vite | Build tool and dev server. Fast HMR, native ESM, Rollup-based bundling |
| Shopify Hydrogen | React framework for headless Shopify. Streaming SSR, built-in cart hooks, Storefront API client |
| Tailwind CSS v4 | Utility-first CSS. Custom SŌNIQ design tokens. Uses `@tailwindcss/vite` plugin |
| TypeScript | End-to-end type safety. Typed GraphQL responses, component props, cart state |
| GraphQL | Query language for the Shopify Storefront API. Typed queries via codegen |
| Shopify Storefront API | Headless commerce backend. Products, collections, variants, metafields, cart, checkout |
| Framer Motion | Page transitions, scroll-reveal, micro-interactions. Respects `prefers-reduced-motion` |
| React | UI components, embedded in Hydrogen |
| Remix (via Hydrogen) | File-based routing, loaders, actions, error boundaries |

## 2.1 Key Dependencies

```
@shopify/hydrogen            latest
@shopify/remix-oxygen        latest
tailwindcss                  ^4.0
@tailwindcss/vite            ^4.0
framer-motion                ^11.0
typescript                   ^5.0
vite                         ^5.0
```

---

# 3. Architecture

## 3.1 High-Level Architecture

SŌNIQ uses a three-layer headless architecture:

1. **Browser** — React + Framer Motion. Renders UI, handles interactions, manages cart state via Hydrogen hooks.
2. **Hydrogen server** — Remix loaders/actions on Vite. SSR, data fetching, caching, streaming HTML.
3. **Shopify backend** — Storefront API via GraphQL. Products, collections, metafields, cart, checkout.

## 3.2 Folder Structure

```
soniq-store/
├── app/
│   ├── components/
│   │   ├── ui/                  # Primitives: Button, Badge, Pill, Skeleton, Image
│   │   ├── layout/              # Header, Footer, Nav, Drawer, AnnouncementBar
│   │   ├── product/             # ProductCard, ProductGallery, VariantSelector, SpecTable
│   │   ├── cart/                # CartDrawer, CartLine, CartSummary
│   │   └── motion/              # AnimateIn, PageTransition, ScrollReveal
│   ├── routes/
│   │   ├── _index.tsx           # Homepage
│   │   ├── collections.$handle.tsx    # Collection / catalog page
│   │   ├── products.$handle.tsx       # Product detail page (PDP)
│   │   ├── cart.tsx             # Cart page
│   │   ├── search.tsx           # Search page
│   │   └── about.tsx            # About / brand story page
│   ├── lib/
│   │   ├── queries/             # All GraphQL query strings (.graphql or .ts)
│   │   ├── mock/                # Mock data fixtures (used in Phase 1–3)
│   │   │   ├── products.ts
│   │   │   ├── collections.ts
│   │   │   └── cart.ts
│   │   ├── storefront.ts        # Storefront API client wrapper (mock-aware)
│   │   └── utils.ts             # Formatters, helpers, cn() classname utility
│   ├── styles/
│   │   └── app.css              # @import "tailwindcss" + custom tokens
│   ├── root.tsx                 # App shell, meta, global providers, cart context
│   └── entry.server.tsx         # SSR entry point
├── public/                      # Static assets (fonts, og images, favicon)
├── .env                         # SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN, MOCK_DATA
├── tailwind.config.ts           # Design tokens, custom theme
├── vite.config.ts               # Vite + Hydrogen + Tailwind plugins
└── tsconfig.json
```

## 3.3 Data Flow

Request lifecycle for a product detail page:

1. User navigates to `/products/soniq-h1-pro`
2. Remix loader in `products.$handle.tsx` fires on the server
3. Loader calls `storefront.query()` with `PRODUCT_QUERY`
4. **Phase 1–3:** `storefront.query()` checks `MOCK_DATA=true` → returns local JSON from `app/lib/mock/`
5. **Phase 4+:** `storefront.query()` hits the Shopify Storefront API over HTTPS
6. Loader returns typed product data
7. React component renders, streaming HTML to the browser
8. Browser hydrates; Framer Motion runs entrance animations

## 3.4 Mock → Live Swap Strategy

The storefront client is mock-aware via a single environment flag. No component code changes are required when switching to a live Shopify store.

```
# Phase 1–3 (.env)
MOCK_DATA=true

# Phase 4 (.env)
MOCK_DATA=false
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-public-storefront-token
```

The `storefront.ts` wrapper:

```ts
// app/lib/storefront.ts
export async function storefront<T>(query: string, variables = {}): Promise<T> {
  if (process.env.MOCK_DATA === 'true') {
    return getMockData<T>(query, variables);
  }
  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const { data } = await response.json();
  return data as T;
}
```

## 3.5 Routing Map

| Route | File | Description |
|---|---|---|
| `/` | `_index.tsx` | Homepage — hero, featured drops, brand story |
| `/collections/:handle` | `collections.$handle.tsx` | Product grid with filter and sort |
| `/products/:handle` | `products.$handle.tsx` | Product detail page (PDP) |
| `/cart` | `cart.tsx` | Full cart page |
| `/search` | `search.tsx` | Search results |
| `/about` | `about.tsx` | Brand story / editorial page |

---

# 4. Design System

## 4.1 Design Philosophy

Dark, editorial, precise. SŌNIQ's design language is inspired by Apple's product marketing and Teenage Engineering's industrial aesthetic. Every element earns its place. White space is generous. Typography carries weight. Animation is purposeful, never decorative.

## 4.2 Colour Palette

```css
/* app/styles/app.css — SŌNIQ design tokens */
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-bg-primary:      #0A0A0F;   /* Page background — near black */
  --color-bg-secondary:    #111118;   /* Cards, drawers, surfaces */
  --color-bg-tertiary:     #1A1A26;   /* Hover states, subtle surfaces */

  /* Brand accent */
  --color-accent:          #7F77DD;   /* Primary purple */
  --color-accent-hover:    #9991E8;   /* Accent hover */
  --color-accent-muted:    #3D3A6B;   /* Muted accent for borders */

  /* Text */
  --color-text-primary:    #F0EFF9;   /* Primary body text */
  --color-text-secondary:  #9B99B8;   /* Muted — metadata, labels */
  --color-text-tertiary:   #5A5878;   /* Disabled, hints */

  /* Borders */
  --color-border:          #2A2838;   /* Default border */
  --color-border-hover:    #3D3A6B;   /* Hover border */

  /* Semantic */
  --color-success:         #3FC87A;   /* In stock */
  --color-warning:         #F2A623;   /* Limited stock */
  --color-error:           #E24B4A;   /* Out of stock, errors */
}
```

## 4.3 Typography

| Role | Spec |
|---|---|
| Display / Hero | Space Grotesk, 72–96px, weight 700, tracking -0.04em |
| Heading 1 | Space Grotesk, 48px, weight 600, tracking -0.02em |
| Heading 2 | Space Grotesk, 32px, weight 600, tracking -0.02em |
| Heading 3 | Space Grotesk, 24px, weight 500 |
| Body | Inter, 16px, weight 400, line-height 1.7 |
| Small / Meta | Inter, 13px, weight 400, color text-secondary |
| Mono / Specs | JetBrains Mono, 13px — used in spec tables |
| Label / UI | Inter, 12px, weight 500, uppercase, tracking 0.08em |

Fonts loaded via Google Fonts in `root.tsx`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
```

## 4.4 Spacing Scale

Tailwind default extended with:

```ts
// tailwind.config.ts
extend: {
  spacing: {
    '18': '4.5rem',
    '22': '5.5rem',
    '88': '22rem',
    '128': '32rem',
  }
}
```

## 4.5 Component Design Tokens

```ts
// Tailwind config extensions
borderRadius: {
  'sm': '4px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
  '2xl': '24px',
},
transitionDuration: {
  'fast': '120ms',
  'base': '200ms',
  'slow': '400ms',
},
```

## 4.6 Motion Principles

- Page transitions: fade + slide up, 300ms ease-out
- Scroll reveals: fade + translate Y (20px → 0), staggered 80ms delay per item
- Hover states: scale(1.02) on product cards, 200ms ease
- Cart drawer: slide in from right, 300ms spring
- All animations wrapped in `useReducedMotion()` — disabled when user prefers reduced motion

---

# 5. Page Plans

## 5.1 Homepage (`/`)

**Purpose:** First impression. Establish the brand, surface hero products, drive to collection.

**Sections (top to bottom):**

1. **Announcement bar** — thin top strip, scrolling text, free shipping threshold
2. **Nav** — logo left, links centre, cart icon + count right. Transparent over hero, solid on scroll
3. **Hero** — full-viewport, dark background, product image right, headline left. CTA: "Shop Now" + "Explore"
4. **Featured drop** — single product spotlight, full-bleed image, specs callout, animated entrance
5. **Collection grid** — 3-column product grid, "New Arrivals" collection
6. **Brand statement** — editorial text section, large type, minimal layout
7. **Spec highlight** — horizontal scrolling spec comparison of 2–3 flagship products
8. **Footer** — links, newsletter, socials, legal

**Loader data:** `featuredCollection`, `heroProduct`, `newArrivals` (3 products)

## 5.2 Collection Page (`/collections/:handle`)

**Purpose:** Browse and filter the full catalogue.

**Layout:**
- Left sidebar (desktop) / top filter drawer (mobile): filter by category, price range, availability
- Top bar: sort dropdown (featured, price low–high, price high–low, newest), result count
- Product grid: 3 columns desktop, 2 tablet, 1 mobile
- Skeleton loading states while paginating

**Features:**
- URL-based filter state (shareable/bookmarkable)
- Optimistic UI on filter change
- Infinite scroll or "Load more" pagination
- Product card hover: image crossfade to alternate image

**Loader data:** `collection(handle)` → products with `first: 24`, cursor-based pagination

## 5.3 Product Detail Page (`/products/:handle`)

**Purpose:** Convert. Showcase the product in detail. This is the most technically complex page.

**Layout:**
- Left: image gallery (main image + thumbnail strip, keyboard navigable)
- Right: product info panel
  - Product title, subtitle
  - Price (with sale price support)
  - Availability badge (In stock / Limited / Out of stock)
  - Variant selector (colour, driver type) — visually distinct per option type
  - Quantity selector
  - Add to Cart button (with loading state)
  - Accordion: Description, Specifications, In the box, Shipping & returns

**Spec table (via metafields):**

| Metafield | Key | Type |
|---|---|---|
| Driver type | `specs.driver_type` | single_line_text |
| Impedance | `specs.impedance` | single_line_text |
| Frequency response | `specs.frequency_response` | single_line_text |
| Sensitivity | `specs.sensitivity` | single_line_text |
| Weight | `specs.weight` | single_line_text |
| Connector | `specs.connector` | single_line_text |
| Cable length | `specs.cable_length` | single_line_text |

**Below the fold:**
- "You might also like" — related products from same collection
- Full-width editorial image + brand copy block

**Loader data:** `product(handle)` with variants, images, metafields, `relatedProducts`

## 5.4 Cart Drawer + Cart Page

**Cart drawer** (accessible from any page):
- Slides in from right on "Add to Cart"
- Line items with image, title, variant, quantity controls, remove
- Subtotal
- "Checkout" button → `cart.checkoutUrl` redirect to Shopify checkout
- Empty state with CTA back to shop

**Cart page (`/cart`):**
- Full-page version of cart drawer contents
- Order summary panel (subtotal, estimated shipping, total)
- Same checkout redirect

**State management:** Hydrogen's built-in `useCart()` hook. Cart persisted via Shopify cart API (server-side cart ID in cookie).

## 5.5 Search Page (`/search`)

- Predictive search: debounced input, results appear as you type
- Results grouped: Products, Collections
- No-results state with suggestions
- Full results page on submit

**Query:** Shopify `predictiveSearch` and `search` queries

## 5.6 About Page (`/about`)

- Editorial long-form layout
- Large pull quotes, full-bleed photography sections
- Brand timeline
- "The SŌNIQ philosophy" manifesto section
- Subtle scroll-driven parallax on images

---

# 6. GraphQL Queries

## 6.1 Product Query

```graphql
# app/lib/queries/product.ts
query Product($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 8) {
      nodes { id url altText width height }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        image { url altText }
      }
    }
    metafields(identifiers: [
      { namespace: "specs", key: "driver_type" }
      { namespace: "specs", key: "impedance" }
      { namespace: "specs", key: "frequency_response" }
      { namespace: "specs", key: "sensitivity" }
      { namespace: "specs", key: "weight" }
      { namespace: "specs", key: "connector" }
      { namespace: "specs", key: "cable_length" }
    ]) {
      key
      value
    }
  }
}
```

## 6.2 Collection Query

```graphql
query Collection($handle: String!, $first: Int!, $after: String) {
  collection(handle: $handle) {
    id
    title
    description
    image { url altText }
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 2) {
          nodes { url altText }
        }
        variants(first: 1) {
          nodes { availableForSale }
        }
      }
    }
  }
}
```

## 6.3 Cart Mutations

```graphql
# Create cart
mutation CartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
      lines(first: 20) { nodes { ...CartLine } }
      cost { subtotalAmount { amount currencyCode } }
    }
  }
}

# Add line
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { id lines(first: 20) { nodes { ...CartLine } } }
  }
}

# Update line
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { id lines(first: 20) { nodes { ...CartLine } } }
  }
}

# Remove line
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { id lines(first: 20) { nodes { ...CartLine } } }
  }
}

fragment CartLine on CartLine {
  id
  quantity
  merchandise {
    ... on ProductVariant {
      id title
      product { title handle }
      image { url altText }
      price { amount currencyCode }
      selectedOptions { name value }
    }
  }
}
```

## 6.4 Search Queries

```graphql
query PredictiveSearch($query: String!) {
  predictiveSearch(query: $query, types: [PRODUCT, COLLECTION]) {
    products {
      id title handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 1) { nodes { url altText } }
    }
    collections { id title handle }
  }
}
```

---

# 7. Component Library

## 7.1 UI Primitives (`app/components/ui/`)

### Button

```tsx
// Variants: primary | secondary | ghost | destructive
// Sizes: sm | md | lg
<Button variant="primary" size="md" loading={false}>
  Add to Cart
</Button>
```

Props: `variant`, `size`, `loading`, `disabled`, `fullWidth`, `onClick`, `as` (for link rendering)

### Badge

```tsx
// For availability and product tags
<Badge variant="success">In stock</Badge>
<Badge variant="warning">Limited</Badge>
<Badge variant="error">Out of stock</Badge>
<Badge variant="default">New</Badge>
```

### Skeleton

```tsx
// Used during loading states
<Skeleton className="h-64 w-full rounded-lg" />
<Skeleton className="h-4 w-32" />
```

### Image (Shopify CDN-aware)

```tsx
// Appends ?width=&height=&crop=center to Shopify CDN URLs
<ShopifyImage src={image.url} alt={image.altText} width={800} height={800} />
```

## 7.2 Layout Components (`app/components/layout/`)

### Header

- Transparent on homepage hero, transitions to solid `bg-bg-secondary` on scroll
- Logo: SŌNIQ wordmark (SVG)
- Nav links: Shop, Collections, About
- Right actions: Search icon, Cart icon with item count badge
- Mobile: hamburger → full-screen nav overlay

### CartDrawer

- `position: fixed`, slides in from right
- Controlled by `useCartDrawer()` context
- Trap focus when open (accessibility)
- Close on backdrop click or Escape key

### Footer

- Three columns: brand blurb, navigation links, newsletter signup
- Bottom bar: copyright, legal links, payment icons

## 7.3 Product Components (`app/components/product/`)

### ProductCard

```tsx
interface ProductCardProps {
  product: ProductFragment;
  loading?: 'eager' | 'lazy';
}
```

- Image: crossfade to second image on hover (CSS transition on opacity)
- Title, price, availability badge
- Quick-add button appears on hover (desktop)

### ProductGallery

- Main image large display
- Thumbnail strip below (or left column on wide screens)
- Keyboard navigable (left/right arrows)
- Click to zoom overlay

### VariantSelector

- Groups options by name (Colour, Driver Type, etc.)
- Colour options: circular swatches
- Other options: pill buttons
- Sold-out variants: strikethrough, not disabled (still selectable, shows unavailable state)

### SpecTable

```tsx
// Renders metafield spec data in a mono-font table
<SpecTable specs={product.metafields} />
```

Renders as a two-column table: spec name left, value right. Font: JetBrains Mono.

---

# 8. Animation System

## 8.1 Setup

```bash
npm install framer-motion
```

## 8.2 Core Primitives (`app/components/motion/`)

### AnimateIn

Wraps any element with a scroll-triggered fade + slide-up entrance.

```tsx
// app/components/motion/AnimateIn.tsx
import { motion, useReducedMotion } from 'framer-motion';

export function AnimateIn({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### PageTransition

Wraps route content for page-to-page transitions:

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

### Stagger container

For product grids — children animate in sequence:

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};
```

## 8.3 Reduced Motion

All motion components use Framer Motion's `useReducedMotion()` hook. When `prefers-reduced-motion: reduce` is set, all translate animations are zeroed out. Opacity transitions remain (they are not vestibular triggers).

---

# 9. Performance Strategy

## 9.1 Image Optimization

- Use Shopify's CDN image transformation API: `?width=800&height=800&crop=center`
- Always provide `width` and `height` attributes to prevent CLS
- Hero image: `loading="eager"`, all others: `loading="lazy"`
- Provide `srcset` with 400w, 800w, 1200w breakpoints

## 9.2 Code Splitting

- Hydrogen / Remix handles route-level code splitting automatically
- Heavy components (ProductGallery zoom, CartDrawer) loaded with dynamic `import()`
- Framer Motion: import only used components, not the full bundle

## 9.3 Caching

- Shopify Storefront API responses cached in Remix loaders with `Cache-Control` headers
- Static assets: `immutable` cache headers via Vite build hashes
- Cart state: stored server-side via Shopify cart API, cart ID in cookie

## 9.4 Core Web Vitals Targets

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | Eager hero image, Shopify CDN, SSR |
| CLS | < 0.1 | Explicit image dimensions, skeleton loaders |
| INP | < 200ms | Optimistic cart UI, no layout-blocking JS |
| TTFB | < 600ms | Hydrogen streaming SSR, edge-ready |

---

# 10. Shopify Integration (Phase 4)

## 10.1 Prerequisites

- Shopify store (free dev store available at shopify.dev)
- Storefront API enabled (Settings → Apps → Develop apps)
- Storefront access token with: `unauthenticated_read_product_listings`, `unauthenticated_read_checkouts`, `unauthenticated_write_checkouts`, `unauthenticated_read_product_inventory`

## 10.2 Product Setup in Shopify Admin

For each product, set up:

1. Title, description, images, variants (colour, driver type)
2. Pricing and inventory
3. Metafields namespace `specs` with keys: `driver_type`, `impedance`, `frequency_response`, `sensitivity`, `weight`, `connector`, `cable_length`
4. Collections: `headphones`, `dacs-amps`, `cables`, `new-arrivals`, `limited-drops`

## 10.3 Metafield Configuration

In Shopify Admin → Settings → Custom Data → Products, create:

| Namespace | Key | Type | Validation |
|---|---|---|---|
| specs | driver_type | Single line text | — |
| specs | impedance | Single line text | — |
| specs | frequency_response | Single line text | — |
| specs | sensitivity | Single line text | — |
| specs | weight | Single line text | — |
| specs | connector | Single line text | — |
| specs | cable_length | Single line text | — |

---

# 11. SEO

## 11.1 Meta Tags

Hydrogen's `getSeoMeta()` helper used on every route:

```tsx
// app/routes/products.$handle.tsx
export const meta = ({ data }) => {
  return getSeoMeta({
    title: `${data.product.title} — SŌNIQ`,
    description: data.product.description.slice(0, 155),
    media: data.product.images.nodes[0],
  });
};
```

## 11.2 Structured Data

JSON-LD `Product` schema injected on PDP:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SŌNIQ H1 Pro",
  "image": ["https://cdn.shopify.com/..."],
  "description": "...",
  "brand": { "@type": "Brand", "name": "SŌNIQ" },
  "offers": {
    "@type": "Offer",
    "price": "499.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

## 11.3 Sitemap

Hydrogen generates `/sitemap.xml` automatically via the `@shopify/hydrogen` sitemap route.

---

# 12. Accessibility

- All interactive elements keyboard-navigable
- Focus trap in CartDrawer and mobile nav overlay
- `aria-label` on all icon-only buttons (cart, search, close)
- `aria-live="polite"` on cart item count
- `role="dialog"` + `aria-modal="true"` on CartDrawer
- Colour contrast: all text meets WCAG AA (4.5:1 minimum) against dark backgrounds
- `alt` text on all product images (from Shopify `altText` field)
- Skip-to-content link as first focusable element

---

# 13. Build & Dev Workflow

## 13.1 Local Development

```bash
npm run dev          # Start Vite dev server at localhost:3000
```

With the `h2` alias:

```bash
alias h2='npx shopify hydrogen'
h2 dev               # Same as above via Hydrogen CLI
```

## 13.2 Useful Commands

```bash
h2 generate route    # Scaffold a new route
h2 generate          # Generate GraphQL types from schema
npm run build        # Production build
npm run preview      # Preview production build locally
npm run typecheck    # TypeScript check
```

## 13.3 Environment Variables

```bash
# .env (Phase 1–3)
MOCK_DATA=true
SESSION_SECRET=your-session-secret

# .env (Phase 4)
MOCK_DATA=false
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
SESSION_SECRET=your-session-secret
```

---

# 14. Build Phases & Step Checklist

## Phase 1 — Scaffold & Config (Steps 1–4)

- [ ] **Step 1** — `npm create @shopify/hydrogen@latest soniq-store` · Hello World template · TypeScript
- [ ] **Step 2** — Install Tailwind v4 (`@tailwindcss/vite`) · update `vite.config.ts` · replace `app.css`
- [ ] **Step 3** — Create `app/lib/mock/` · add typed product, collection, cart fixtures · wire up `storefront.ts` mock client
- [ ] **Step 4** — Set up folder structure · add `tsconfig` paths · configure env variables

## Phase 2 — Design System & Layout (Steps 5–8)

- [ ] **Step 5** — Build `Header` (transparent → solid scroll), `Footer`, `AnnouncementBar`
- [ ] **Step 6** — Add design tokens to `app.css` (@theme block) · configure `tailwind.config.ts` · load Google Fonts in `root.tsx`
- [ ] **Step 7** — Build `Button`, `Badge`, `Skeleton`, `ShopifyImage`, `Pill` components
- [ ] **Step 8** — Install Framer Motion · build `AnimateIn`, `PageTransition`, `ScrollReveal` · add `useReducedMotion` guards

## Phase 3 — Core Pages (Steps 9–14)

- [ ] **Step 9** — Homepage: hero section, featured drop, collection grid, brand statement, footer
- [ ] **Step 10** — Collection page: product grid, filter sidebar, sort dropdown, skeleton loading, pagination
- [ ] **Step 11** — PDP: image gallery, variant selector, spec table (metafields), add to cart, related products
- [ ] **Step 12** — Cart drawer + cart page: line items, quantity controls, subtotal, checkout redirect
- [ ] **Step 13** — Search page: predictive search input, grouped results, no-results state
- [ ] **Step 14** — About page: editorial layout, pull quotes, parallax images, brand manifesto

## Phase 4 — Shopify Integration (Steps 15–18)

- [ ] **Step 15** — Create Shopify dev store · enable Storefront API · add credentials to `.env` · flip `MOCK_DATA=false`
- [ ] **Step 16** — Write and test all GraphQL queries (product, collection, search) · run codegen for types
- [ ] **Step 17** — Configure product metafields in Shopify Admin · verify spec table renders from live data
- [ ] **Step 18** — Test cart mutations end-to-end · verify checkout redirect · test add/remove/update

## Phase 5 — Performance & Polish (Steps 19–22)

- [ ] **Step 19** — Shopify CDN image params · `srcset` · explicit dimensions · LCP audit
- [ ] **Step 20** — `getSeoMeta()` on all routes · JSON-LD product schema on PDP · sitemap
- [ ] **Step 21** — Keyboard nav audit · focus trap in drawer · aria labels · colour contrast check
- [ ] **Step 22** — Skeleton loaders · error boundaries · custom 404/500 pages · empty states

---

*SŌNIQ — Engineering sound. Obsessively.*
