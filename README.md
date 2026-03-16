# SŌNIQ — Premium Audio Headless Storefront

A high-performance headless Shopify storefront built with Remix, Tailwind CSS v4, and TypeScript. Features a mock data layer that can be swapped for live Shopify Storefront API integration.

![SŌNIQ Storefront](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop)

## ✨ Features

- **Headless Architecture** — Remix-based SPA with SSR for optimal performance
- **Mock Data Ready** — Development with local mock data, swap to Shopify API with one flag
- **Dark Editorial Design** — Apple/Teenage Engineering aesthetic with premium typography
- **Responsive** — Mobile-first design with smooth transitions
- **TypeScript** — End-to-end type safety
- **Tailwind CSS v4** — Utility-first styling with custom design tokens

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/LXMachado/soniq-store.git
cd soniq-store

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

```bash
# Build the app
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
soniq-store/
├── app/
│   ├── components/          # UI components
│   │   ├── cart/           # Cart components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── motion/         # Animation components
│   │   ├── product/        # Product components
│   │   └── ui/             # UI primitives (Button, Badge, etc.)
│   ├── lib/
│   │   ├── mock/           # Mock data (products, collections)
│   │   ├── queries/        # GraphQL queries
│   │   ├── storefront.ts   # API client wrapper
│   │   └── utils.ts        # Utility functions
│   ├── routes/             # Remix routes
│   │   ├── _index.tsx      # Homepage
│   │   └── ...
│   ├── styles/
│   │   └── app.css         # Tailwind CSS + design tokens
│   ├── entry.client.tsx   # Client entry point
│   ├── entry.server.tsx   # Server entry point
│   └── root.tsx            # App shell
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Phase 1-3: Use mock data (default)
MOCK_DATA=true
SESSION_SECRET=your-secret

# Phase 4+: Connect to Shopify
MOCK_DATA=false
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-token
```

### Mock Data

The project includes mock data for development:

- **6 Products**: H1 Pro, H1, E3, D1 Desktop DAC, A2 Headphone Amp, Balanced Cable
- **5 Collections**: Headphones, IEM, DACs & Amps, Cables, New Arrivals

### Adding Products

Edit `app/lib/mock/products.ts`:

```typescript
export const mockProducts: MockProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'your-product-handle',
    title: 'Your Product Name',
    // ... add more fields
  },
];
```

## 🎨 Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#0A0A0F` | Page background |
| `--color-bg-secondary` | `#111118` | Cards, surfaces |
| `--color-accent` | `#7F77DD` | Primary actions |
| `--color-text-primary` | `#F0EFF9` | Main text |
| `--color-text-secondary` | `#9B99B8` | Muted text |

### Typography

- **Display**: Space Grotesk (headings)
- **Body**: Inter (content)
- **Mono**: JetBrains Mono (specs, code)

### Using Tailwind

```tsx
// Dark background
<div className="bg-bg-primary">

// Accent color
<button className="bg-accent hover:bg-accent-hover">

// Typography
<h1 className="font-display text-5xl font-bold">
<p className="font-body text-text-secondary">
```

## 🛒 Shopify Integration

To connect to a live Shopify store:

1. Enable Storefront API in Shopify Admin
2. Create a Storefront access token
3. Update `.env` with your credentials
4. Set `MOCK_DATA=false`

The `storefront.ts` client handles the switch automatically:

```typescript
// Uses mock data when MOCK_DATA=true
const product = await storefront(PRODUCT_QUERY, { handle: 'soniq-h1-pro' });

// Uses Shopify API when MOCK_DATA=false  
const product = await storefront(PRODUCT_QUERY, { handle: 'soniq-h1-pro' });
```

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/collections/:handle` | Collection page |
| `/products/:handle` | Product detail page |
| `/cart` | Cart page |
| `/search` | Search results |
| `/about` | Brand story |

## 🔨 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript check |

## 📄 License

MIT License — feel free to use this project for your own storefront.

---

**SŌNIQ** — Engineering sound. Obsessively.
