import { Link, Form, useSearchParams } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { storefront } from '~/lib/storefront';
import { formatCurrency } from '~/lib/utils';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { AnimateIn, StaggerContainer, StaggerItem } from '~/components/motion/AnimateIn';

export const meta: MetaFunction = () => {
  return [
    { title: 'Search — SŌNIQ' },
    { name: 'description', content: 'Search for premium audio equipment.' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query || query.length < 2) {
    return json({ products: [], query: '' });
  }

  const searchQuery = `
    query SearchProducts($query: String!) {
      products(first: 20, query: $query) {
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

  type SearchData = {
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
    };
  };

  const data = await storefront<SearchData>(searchQuery, { query });

  return json({ products: data.products?.nodes ?? [], query });
}

export default function Search() {
  const { products, query } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(query);

  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <AnimateIn>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Search</h1>
        </AnimateIn>

        {/* Search Form */}
        <AnimateIn delay={0.05}>
          <Form method="get" className="mb-12">
            <div className="flex gap-3 max-w-2xl">
              <input
                type="text"
                name="q"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for headphones, IEMs, DACs..."
                className="flex-1 px-4 py-3 bg-bg-secondary border border-border/50 rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors"
              />
              <Button type="submit" variant="primary">
                Search
              </Button>
            </div>
          </Form>
        </AnimateIn>

        {/* Results */}
        {query && (
          <div>
            <p className="text-text-secondary mb-6">
              {products.length === 0
                ? `No results for "${query}"`
                : `Found ${products.length} result${products.length !== 1 ? 's' : ''} for "${query}"`}
            </p>

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
              <div className="text-center py-16">
                <p className="text-text-secondary mb-6">
                  Try searching for something else, or browse our collections.
                </p>
                <Link
                  to="/collections"
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  View all collections →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-6">
              Enter a search term to find products.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Headphones', 'IEM', 'DAC', 'Cable'].map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${term}`}
                  className="px-4 py-2 bg-bg-secondary border border-border/50 rounded-lg text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}