import { Link, useSearchParams } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';
import { storefront } from '../lib/storefront';
import { COLLECTION_BY_HANDLE_QUERY } from '../lib/shopify/queries';
import { formatCurrency } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { AnimateIn, StaggerContainer, StaggerItem } from '../components/motion/AnimateIn';
import { ProductGridSkeleton } from '../components/ui/Skeleton';

const PRODUCTS_PER_PAGE = 6;

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

  const data = await storefront<CollectionData>(COLLECTION_BY_HANDLE_QUERY, { handle });

  if (!data.collection) {
    throw new Response('Collection not found', { status: 404 });
  }

  return json({ collection: data.collection });
}

export default function CollectionPage() {
  const { collection } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = collection.products?.nodes ?? [];
  const [isFiltering, setIsFiltering] = useState(false);

  const selectedCategory = searchParams.get('category');
  const sortKey = searchParams.get('sort') ?? 'featured';
  const inStockOnly = searchParams.get('availability') === 'in-stock';
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);

  // Get unique categories from product tags
  const categories = useMemo(() => {
    const tags = new Set<string>();
    products.forEach(p => {
      p.tags?.forEach(tag => {
        if (tag !== 'new-arrival') tags.add(tag);
      });
    });
    return Array.from(tags);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.tags?.includes(selectedCategory));
    }

    if (inStockOnly) {
      result = result.filter((p) => p.variants?.nodes[0]?.availableForSale);
    }

    // Sort
    switch (sortKey) {
      case 'price-low':
        result.sort((a, b) => 
          parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
        );
        break;
      case 'price-high':
        result.sort((a, b) => 
          parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
        );
        break;
      case 'newest':
        result.sort((a, b) => 
          (b.tags?.includes('new-arrival') ? 1 : 0) - (a.tags?.includes('new-arrival') ? 1 : 0)
        );
        break;
      default:
        // featured - keep original order
        break;
    }

    return result;
  }, [products, selectedCategory, sortKey, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setIsFiltering(true);
    const timeout = window.setTimeout(() => setIsFiltering(false), 180);
    return () => window.clearTimeout(timeout);
  }, [selectedCategory, sortKey, inStockOnly, page]);

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    if (!updates.page) {
      next.delete('page');
    }

    setSearchParams(next, { preventScrollReset: true });
  }

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

      {/* Collection Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-text-primary mb-4">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateParams({ category: null, page: null })}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !selectedCategory ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => updateParams({ category: cat, page: null })}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                          selectedCategory === cat ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                        }`}
                      >
                        {cat.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-text-primary mb-4">Availability</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) =>
                        updateParams({
                          availability: e.target.checked ? 'in-stock' : null,
                          page: null,
                        })
                      }
                      className="w-4 h-4 rounded border-border bg-bg-secondary text-accent focus:ring-accent focus:ring-offset-bg-primary"
                    />
                    <span className="text-sm text-text-secondary">In Stock Only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Count */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
                <p className="text-sm text-text-secondary">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                  <label htmlFor="sort" className="text-sm text-text-secondary">Sort by:</label>
                  <select
                    id="sort"
                    value={sortKey}
                    onChange={(e) => updateParams({ sort: e.target.value, page: null })}
                    className="bg-bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {isFiltering ? (
                <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
              ) : filteredProducts.length > 0 ? (
                <>
                <StaggerContainer className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
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
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/30 pt-6">
                    <p className="text-sm text-text-secondary">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateParams({ page: page > 1 ? String(page - 1) : null })}
                        disabled={page === 1}
                        className="rounded-lg border border-border/50 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => updateParams({ page: pageNumber === 1 ? null : String(pageNumber) })}
                          className={`h-10 w-10 rounded-lg border text-sm transition-colors ${
                            pageNumber === page
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border/50 text-text-secondary hover:border-border-hover hover:text-text-primary'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateParams({ page: page < totalPages ? String(page + 1) : String(totalPages) })}
                        disabled={page === totalPages}
                        className="rounded-lg border border-border/50 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                </>
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
          </div>
        </div>
      </section>
    </div>
  );
}
