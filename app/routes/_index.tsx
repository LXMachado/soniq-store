import { Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { storefront } from '../lib/storefront';
import { formatCurrency } from '../lib/utils';

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
              availableForSale
            }
          }
        }
      }
      featuredCollection: collection(handle: "new-arrivals") {
        id
        title
        description
        products(first: 3) {
          nodes {
            id
            title
            handle
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
          }
        }
      }
    }
  `;

  const data = await storefront<{
    heroProduct: {
      id: string;
      title: string;
      description: string;
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      images: { nodes: Array<{ url: string; altText: string }> };
      variants: { nodes: Array<{ id: string; availableForSale: boolean }> };
    };
    newArrivals: {
      nodes: Array<{
        id: string;
        title: string;
        handle: string;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        images: { nodes: Array<{ url: string; altText: string }> };
        variants: { nodes: Array<{ availableForSale: boolean }> };
      }>;
    };
  }>(query);

  return json({ data });
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  const heroProduct = data.heroProduct;
  const newArrivals = data.newArrivals?.nodes || [];
  const featuredCollection = data.featuredCollection;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary z-10" />
        
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-20">
          <div className="space-y-8">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
              Engineering sound.<br />
              <span className="text-accent">Obsessively.</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-lg leading-relaxed">
              Premium audio equipment for those who hear what others miss. 
              Every frequency, every detail, crafted with precision.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products/soniq-h1-pro"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors duration-200"
              >
                Shop Now
              </Link>
              <Link
                to="/collections/headphones"
                className="inline-flex items-center justify-center px-8 py-4 border border-border hover:border-border-hover text-text-primary font-medium rounded-lg transition-colors duration-200"
              >
                Explore
              </Link>
            </div>
          </div>
          
          {heroProduct && (
            <div className="relative">
              <div className="aspect-square max-w-lg mx-auto">
                <img
                  src={heroProduct.images?.nodes[0]?.url}
                  alt={heroProduct.images?.nodes[0]?.altText || heroProduct.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-bg-secondary/90 backdrop-blur-sm px-6 py-4 rounded-lg">
                <p className="text-sm text-text-secondary uppercase tracking-wider mb-1">Featured</p>
                <p className="text-xl font-display font-semibold">{heroProduct.title}</p>
                <p className="text-accent font-medium mt-1">
                  {formatCurrency(heroProduct.priceRange.minVariantPrice.amount)}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">New Arrivals</h2>
              <p className="text-text-secondary">The latest additions to our lineup</p>
            </div>
            <Link
              to="/collections/new-arrivals"
              className="text-accent hover:text-accent-hover transition-colors hidden md:block"
            >
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {newArrivals.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="group"
              >
                <div className="aspect-square bg-bg-tertiary rounded-lg overflow-hidden mb-4">
                  {product.images?.nodes[0] && (
                    <img
                      src={product.images.nodes[0].url}
                      alt={product.images.nodes[0].altText || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                </div>
                <h3 className="font-display text-lg font-medium mb-1 group-hover:text-accent transition-colors">
                  {product.title}
                </h3>
                <p className="text-text-secondary">
                  {formatCurrency(product.priceRange.minVariantPrice.amount)}
                </p>
              </Link>
            ))}
          </div>

          <Link
            to="/collections/new-arrivals"
            className="text-accent hover:text-accent-hover transition-colors md:hidden mt-8 inline-block"
          >
            View all →
          </Link>
        </div>
      </section>

      {/* Brand Statement Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-text-tertiary mb-6">The SŌNIQ Philosophy</p>
          <blockquote className="font-display text-2xl md:text-4xl font-medium leading-relaxed mb-8">
            "We don't design for specifications. We design for the moment when you close your eyes 
            and forget you're listening to recordings. That is our only metric."
          </blockquote>
          <Link
            to="/about"
            className="text-accent hover:text-accent-hover transition-colors"
          >
            Our story →
          </Link>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-24 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-12">Shop by Category</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Link to="/collections/headphones" className="group relative aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop"
                alt="Headphones"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-semibold">Headphones</h3>
                <p className="text-text-secondary text-sm mt-1">Over-ear & On-ear</p>
              </div>
            </Link>

            <Link to="/collections/iem" className="group relative aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=750&fit=crop"
                alt="In-Ear Monitors"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-semibold">In-Ear Monitors</h3>
                <p className="text-text-secondary text-sm mt-1">IEMs & Custom</p>
              </div>
            </Link>

            <Link to="/collections/dacs-amps" className="group relative aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=750&fit=crop"
                alt="DACs & Amplifiers"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-semibold">DACs & Amps</h3>
                <p className="text-text-secondary text-sm mt-1">Desktop & Portable</p>
              </div>
            </Link>

            <Link to="/collections/cables" className="group relative aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=600&h=750&fit=crop"
                alt="Cables & Accessories"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-semibold">Cables</h3>
                <p className="text-text-secondary text-sm mt-1">Premium Upgrades</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="font-display text-2xl font-bold tracking-tight mb-4 block">
                SŌNIQ
              </Link>
              <p className="text-text-secondary max-w-sm">
                Engineering sound. Obsessively. Premium audio equipment for those who demand perfection.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><Link to="/collections/headphones" className="hover:text-text-primary transition-colors">Headphones</Link></li>
                <li><Link to="/collections/iem" className="hover:text-text-primary transition-colors">In-Ear Monitors</Link></li>
                <li><Link to="/collections/dacs-amps" className="hover:text-text-primary transition-colors">DACs & Amps</Link></li>
                <li><Link to="/collections/cables" className="hover:text-text-primary transition-colors">Cables</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><Link to="/about" className="hover:text-text-primary transition-colors">About</Link></li>
                <li><Link to="/search" className="hover:text-text-primary transition-colors">Search</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-tertiary text-sm">
              © 2024 SŌNIQ. All rights reserved.
            </p>
            <div className="flex gap-6 text-text-tertiary text-sm">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
