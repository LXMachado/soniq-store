import { Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { storefront } from '../lib/storefront';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AnimateIn, StaggerContainer, StaggerItem } from '../components/motion/AnimateIn';

export const meta: MetaFunction = () => {
  return [
    { title: 'SŌNIQ — Engineering sound. Obsessively.' },
    { name: 'description', content: 'Premium audio equipment for audiophiles, music producers, and sound engineers.' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const query = `
    query {
      heroProduct: product(handle: "soniq-h1-pro") {
        id
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          nodes {
            url
            altText
          }
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
          }
        }
      }
      newArrivals: products(first: 3) {
        nodes {
          id
          title
          handle
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 2) {
            nodes {
              url
              altText
            }
          }
          variants(first: 1) {
            nodes {
              availableForSale
            }
          }
        }
      }
    }
  `;

  type Product = {
    id: string;
    title: string;
    handle: string;
    tags: string[];
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { nodes: Array<{ url: string; altText: string }> };
    variants: { nodes: Array<{ availableForSale: boolean }> };
  };

  const data = await storefront<{
    heroProduct: {
      id: string;
      title: string;
      description: string;
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      images: { nodes: Array<{ url: string; altText: string }> };
      variants: { nodes: Array<{ id: string; availableForSale: boolean }> };
    };
    newArrivals: { nodes: Product[] };
  }>(query);

  return json({ data });
}

const CATEGORY_CARDS = [
  {
    href: '/collections/headphones',
    title: 'Headphones',
    subtitle: 'Over-ear & On-ear',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop',
  },
  {
    href: '/collections/iem',
    title: 'In-Ear Monitors',
    subtitle: 'IEMs & Custom',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=750&fit=crop',
  },
  {
    href: '/collections/dacs-amps',
    title: 'DACs & Amps',
    subtitle: 'Desktop & Portable',
    img: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=750&fit=crop',
  },
  {
    href: '/collections/cables',
    title: 'Cables',
    subtitle: 'Premium Upgrades',
    img: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=600&h=750&fit=crop',
  },
];

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  const heroProduct = data.heroProduct;
  const newArrivals = data.newArrivals?.nodes ?? [];

  return (
    <div className="min-h-screen bg-bg-primary">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[76px]">
        {/* Background glow */}
        <div className="absolute inset-0 hero-glow" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 py-20">
          {/* Text */}
          <div className="space-y-8">
            <AnimateIn delay={0.05}>
              <Badge variant="accent" className="mb-2">New collection 2024</Badge>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
                Engineering<br />
                sound.<br />
                <span className="text-accent relative">
                  Obsessively.
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-accent to-transparent opacity-60" />
                </span>
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.18}>
              <p className="text-lg text-text-secondary max-w-md leading-relaxed">
                Premium audio equipment for those who hear what others miss.
                Every frequency, every detail, crafted with precision.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.24}>
              <div className="flex flex-wrap gap-3">
                <Button as={Link} to="/products/soniq-h1-pro" variant="primary" size="lg">
                  Shop Now
                </Button>
                <Button as={Link} to="/collections/headphones" variant="secondary" size="lg">
                  Explore
                </Button>
              </div>
            </AnimateIn>

            {/* Stats */}
            <AnimateIn delay={0.32}>
              <div className="flex gap-8 pt-2">
                {[
                  { value: '50mm', label: 'Beryllium driver' },
                  { value: '4Hz', label: 'Low extension' },
                  { value: '300Ω', label: 'Impedance' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-xl font-semibold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-tertiary uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>

          {/* Hero product image */}
          {heroProduct && (
            <AnimateIn delay={0.08} direction="left" className="relative">
              {/* Glow ring behind image */}
              <div className="absolute inset-0 rounded-2xl bg-accent/8 blur-3xl scale-90" />

              <div className="relative aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden bg-bg-secondary border border-border/50 shadow-2xl shadow-black/40">
                {heroProduct.images?.nodes[0] && (
                  <img
                    src={heroProduct.images.nodes[0].url}
                    alt={heroProduct.images.nodes[0].altText || heroProduct.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
                {/* Product badge overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-bg-primary/80 backdrop-blur-md px-5 py-3.5 rounded-xl border border-border/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-tertiary uppercase tracking-widest mb-0.5">Featured</p>
                      <p className="font-display text-base font-semibold text-text-primary">{heroProduct.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold text-accent">
                        {formatCurrency(heroProduct.priceRange.minVariantPrice.amount)}
                      </p>
                      <Badge variant="success" className="text-[10px] mt-0.5">In Stock</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs uppercase tracking-widest text-text-tertiary">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-text-tertiary to-transparent" />
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-28 bg-bg-secondary relative overflow-hidden">
        {/* Subtle top border glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6">
          <AnimateIn>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-tertiary mb-3">What's new</p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold">New Arrivals</h2>
                <p className="text-text-secondary mt-2">The latest additions to our lineup</p>
              </div>
              <Link
                to="/collections/new-arrivals"
                className="text-sm text-accent hover:text-accent-hover transition-colors hidden md:inline-flex items-center gap-1 group"
              >
                View all
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>
          </AnimateIn>

          {newArrivals.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-3 gap-8">
              {newArrivals.map((product) => (
                <StaggerItem key={product.id}>
                  <Link to={`/products/${product.handle}`} className="group product-card block">
                    <div className="relative aspect-square bg-bg-tertiary rounded-xl overflow-hidden mb-4 border border-border/50 group-hover:border-border-hover transition-colors duration-300">
                      {product.images?.nodes[0] && (
                        <img
                          src={product.images.nodes[0].url}
                          alt={product.images.nodes[0].altText || product.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                      )}
                      {product.images?.nodes[1] && (
                        <img
                          src={product.images.nodes[1].url}
                          alt={product.images.nodes[1].altText || product.title}
                          className="absolute inset-0 w-full h-full object-cover product-image-alt"
                          loading="lazy"
                        />
                      )}
                      {/* Quick-add overlay */}
                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="bg-bg-primary/90 backdrop-blur-sm rounded-lg px-4 py-2.5 text-center border border-border/60">
                          <span className="text-xs font-medium text-text-primary uppercase tracking-wider">Quick View</span>
                        </div>
                      </div>
                      {/* New badge */}
                      {product.tags?.includes('new-arrival') && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="new">New</Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-medium group-hover:text-accent transition-colors duration-200">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-text-secondary text-sm">
                          {formatCurrency(product.priceRange.minVariantPrice.amount)}
                        </p>
                        {product.variants?.nodes[0]?.availableForSale && (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-16 text-text-tertiary">
              <p>No products available at this time.</p>
            </div>
          )}

          <AnimateIn delay={0.1}>
            <Link
              to="/collections/new-arrivals"
              className="text-accent hover:text-accent-hover transition-colors md:hidden mt-8 inline-flex items-center gap-1"
            >
              View all →
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ─── BRAND STATEMENT ─── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary/30 to-bg-primary" />
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-[0.25em] text-text-tertiary mb-8">The SŌNIQ Philosophy</p>
          </AnimateIn>
          <AnimateIn delay={0.08}>
            <blockquote className="font-display text-2xl md:text-3xl xl:text-4xl font-medium leading-relaxed text-text-primary">
              "We don't design for specifications. We design for the moment when you close
              your eyes and forget you're listening to recordings. That is our only metric."
            </blockquote>
          </AnimateIn>
          <AnimateIn delay={0.16}>
            <Link
              to="/about"
              className="inline-flex items-center gap-1 mt-10 text-accent hover:text-accent-hover transition-colors group"
            >
              Our story
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="py-28 bg-bg-secondary relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6">
          <AnimateIn>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-14">
              Shop by Category
            </h2>
          </AnimateIn>

          <StaggerContainer className="grid md:grid-cols-4 gap-5">
            {CATEGORY_CARDS.map((cat) => (
              <StaggerItem key={cat.href}>
                <Link
                  to={cat.href}
                  className="group relative block aspect-[4/5] rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 transition-colors duration-300"
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-107 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-lg font-semibold text-white">{cat.title}</h3>
                    <p className="text-white/60 text-xs mt-1">{cat.subtitle}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── SPEC HIGHLIGHT STRIP ─── */}
      <section className="py-20 border-y border-border overflow-hidden">
        <StaggerContainer className="flex flex-wrap justify-center gap-x-16 gap-y-10 container mx-auto px-4 sm:px-6">
          {[
            { spec: '4Hz – 50kHz', label: 'Frequency Response' },
            { spec: '50mm', label: 'Beryllium Driver' },
            { spec: '300Ω', label: 'Impedance' },
            { spec: '98dB/mW', label: 'Sensitivity' },
            { spec: '420g', label: 'Weight' },
            { spec: '3m OCC', label: 'Cable' },
          ].map((item) => (
            <StaggerItem key={item.label}>
              <div className="text-center">
                <p className="font-mono text-2xl font-medium text-text-primary">{item.spec}</p>
                <p className="text-xs uppercase tracking-widest text-text-tertiary mt-1">{item.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

    </div>
  );
}
