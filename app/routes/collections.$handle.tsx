import { Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { storefront } from '../lib/storefront';
import { formatCurrency } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { AnimateIn, StaggerContainer, StaggerItem } from '../components/motion/AnimateIn';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const collection = data?.collection;
  return [
    { title: collection ? `${collection.title} — SŌNIQ` : 'Collection — SŌNIQ' },
    { name: 'description', content: collection?.description || 'Browse our premium audio collection.' },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { handle } = params;

  if (!handle) {
    throw new Response('Collection not found', { status: 404 });
  }

  const query = `
    query CollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        image {
          url
          altText
        }
        products(first: 20) {
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
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  type CollectionData = {
    collection: {
      id: string;
      handle: string;
      title: string;
      description: string;
      image: { url: string; altText: string } | null;
      products: {
        nodes: Array<{
          id: string;
          title: string;
          handle: string;
          tags: string[];
          priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
          images: { nodes: Array<{ url: string; altText: string }> };
          variants: { nodes: Array<{ availableForSale: boolean }> };
        }>;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    } | null;
  };

  const data = await storefront<CollectionData>(query, { handle });

  if (!data.collection) {
    throw new Response('Collection not found', { status: 404 });
  }

  return json({ collection: data.collection });
}

export default function CollectionPage() {
  const { collection } = useLoaderData<typeof loader>();
  const products = collection.products?.nodes ?? [];

  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      {/* Collection Hero */}
      <section className="relative py-20 overflow-hidden">
        {collection.image && (
          <div className="absolute inset-0">
            <img
              src={collection.image.url}
              alt={collection.image.altText}
              className="w-full h-full object-cover opacity-15 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/90 to-bg-primary" />
          </div>
        )}
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-text-tertiary mb-3">Collection</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{collection.title}</h1>
            {collection.description && (
              <p className="text-lg text-text-secondary max-w-2xl">{collection.description}</p>
            )}
          </AnimateIn>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {products.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <Link to={`/products/${product.handle}`} className="group product-card block">
                    <div className="relative aspect-square bg-bg-secondary rounded-xl overflow-hidden mb-4 border border-border/50 group-hover:border-border-hover transition-colors duration-300">
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
                      <h3 className="font-display text-base font-medium group-hover:text-accent transition-colors duration-200">
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
            <div className="text-center py-20">
              <p className="text-text-secondary mb-6">No products found in this collection.</p>
              <Link
                to="/collections"
                className="text-accent hover:text-accent-hover transition-colors"
              >
                View all collections →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}