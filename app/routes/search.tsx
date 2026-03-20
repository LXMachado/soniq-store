import { Form, Link, useFetcher, useLoaderData, useNavigation } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { storefront } from '~/lib/storefront';
import { formatCurrency } from '~/lib/utils';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { AnimateIn, StaggerContainer, StaggerItem } from '~/components/motion/AnimateIn';
import { Skeleton } from '~/components/ui/Skeleton';
import { ShopifyImage } from '~/components/ui/ShopifyImage';

const POPULAR_SEARCHES = ['Headphones', 'IEM', 'DAC', 'Cable', 'Open-back', 'Portable'];

type SearchProduct = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  description?: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { nodes: Array<{ url: string; altText: string }> };
  variants: { nodes: Array<{ availableForSale: boolean }> };
};

type SearchCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: { url: string; altText: string } | null;
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Search — SŌNIQ' },
    { name: 'description', content: 'Search for premium audio equipment.' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() ?? '';

  if (query.length < 2) {
    return json({
      query,
      products: [],
      collections: [],
      suggestedTerms: POPULAR_SEARCHES,
    });
  }

  const searchQuery = `
    query SearchProducts($query: String!) {
      products(first: 24, query: $query) {
        nodes {
          id
          title
          handle
          description
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
      collections(first: 20) {
        nodes {
          id
          handle
          title
          description
          image {
            url
            altText
          }
        }
      }
    }
  `;

  type SearchData = {
    products: { nodes: SearchProduct[] };
    collections: { nodes: SearchCollection[] };
  };

  const data = await storefront<SearchData>(searchQuery, { query });
  const normalizedQuery = query.toLowerCase();

  const products = (data.products?.nodes ?? []).filter((product) =>
    [
      product.title,
      product.handle,
      product.description ?? '',
      ...product.tags,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );

  const collections = (data.collections?.nodes ?? []).filter((collection) =>
    [collection.title, collection.handle, collection.description ?? '']
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );

  const suggestedTerms = Array.from(
    new Set(
      [
        ...products.flatMap((product) => product.tags),
        ...collections.map((collection) => collection.title),
      ].filter((term) => term.toLowerCase().includes(normalizedQuery)),
    ),
  )
    .slice(0, 6);

  return json({
    query,
    products,
    collections,
    suggestedTerms: suggestedTerms.length > 0 ? suggestedTerms : POPULAR_SEARCHES,
  });
}

export default function Search() {
  const { products, collections, query, suggestedTerms } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const fetcher = useFetcher<typeof loader>();
  const [searchValue, setSearchValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const deferredSearchValue = useDeferredValue(searchValue);

  useEffect(() => {
    const trimmed = deferredSearchValue.trim();

    if (trimmed.length < 2 || trimmed === query) {
      return;
    }

    const timeout = window.setTimeout(() => {
      fetcher.load(`/search?q=${encodeURIComponent(trimmed)}&predictive=1`);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [deferredSearchValue, fetcher, query]);

  const predictiveQuery = deferredSearchValue.trim();
  const predictiveData =
    fetcher.data && fetcher.data.query === predictiveQuery ? fetcher.data : null;
  const predictiveOpen = isFocused && predictiveQuery.length >= 2 && predictiveQuery !== query;
  const predictiveLoading = predictiveOpen && fetcher.state !== 'idle' && !predictiveData;
  const summaryCount = products.length + collections.length;
  const showingResults = query.length >= 2;

  const quickLinks = useMemo(
    () => collections.slice(0, 3),
    [collections],
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <AnimateIn>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-text-tertiary">Search</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Find your next listening setup</h1>
          <p className="max-w-2xl text-text-secondary">
            Search across flagship headphones, IEMs, DACs, accessories, and collections.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <Form method="get" className="mb-12 mt-8">
            <div className="relative max-w-3xl">
              <div className="flex gap-3">
              <input
                type="text"
                name="q"
                value={searchValue}
                onChange={(e) => startTransition(() => setSearchValue(e.target.value))}
                onFocus={() => setIsFocused(true)}
                onBlur={() => window.setTimeout(() => setIsFocused(false), 120)}
                placeholder="Search for headphones, IEMs, DACs..."
                className="flex-1 rounded-xl border border-border/50 bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-tertiary transition-colors focus:border-accent focus:outline-none"
              />
              <Button type="submit" variant="primary">
                Search
              </Button>
              </div>

              {predictiveOpen && (
                <div className="absolute inset-x-0 top-[calc(100%+12px)] z-30 overflow-hidden rounded-2xl border border-border/50 bg-bg-secondary shadow-2xl shadow-black/30">
                  {predictiveLoading ? (
                    <div className="space-y-3 p-5">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-18 w-full rounded-xl" />
                      <Skeleton className="h-18 w-full rounded-xl" />
                    </div>
                  ) : predictiveData ? (
                    <div className="grid gap-0 md:grid-cols-[1.5fr_1fr]">
                      <div className="border-b border-border/30 p-5 md:border-b-0 md:border-r">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-xs uppercase tracking-widest text-text-tertiary">Products</p>
                          <span className="text-xs text-text-secondary">{predictiveData.products.length} matches</span>
                        </div>
                        <div className="space-y-3">
                          {predictiveData.products.slice(0, 3).map((product) => (
                            <Link
                              key={product.id}
                              to={`/products/${product.handle}`}
                              className="flex items-center gap-3 rounded-xl border border-border/30 p-3 transition-colors hover:border-border-hover hover:bg-bg-tertiary/50"
                            >
                              <div className="h-16 w-16 overflow-hidden rounded-lg bg-bg-tertiary">
                                {product.images?.nodes[0] && (
                                  <ShopifyImage
                                    src={product.images.nodes[0].url}
                                    alt={product.images.nodes[0].altText || product.title}
                                    width={128}
                                    height={128}
                                    className="h-full w-full"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-display text-base font-medium text-text-primary">{product.title}</p>
                                <p className="mt-1 text-sm text-text-secondary">
                                  {formatCurrency(product.priceRange.minVariantPrice.amount)}
                                </p>
                              </div>
                            </Link>
                          ))}
                          {predictiveData.products.length === 0 && (
                            <p className="text-sm text-text-secondary">No product matches yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-5">
                          <p className="mb-3 text-xs uppercase tracking-widest text-text-tertiary">Collections</p>
                          <div className="space-y-2">
                            {predictiveData.collections.slice(0, 3).map((collection) => (
                              <Link
                                key={collection.id}
                                to={`/collections/${collection.handle}`}
                                className="block rounded-xl border border-border/30 px-4 py-3 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                              >
                                {collection.title}
                              </Link>
                            ))}
                            {predictiveData.collections.length === 0 && (
                              <p className="text-sm text-text-secondary">No collection matches.</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="mb-3 text-xs uppercase tracking-widest text-text-tertiary">Suggested Terms</p>
                          <div className="flex flex-wrap gap-2">
                            {predictiveData.suggestedTerms.map((term) => (
                              <Link
                                key={term}
                                to={`/search?q=${encodeURIComponent(term)}`}
                                className="rounded-full border border-border/40 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                              >
                                {term}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </Form>
        </AnimateIn>

        {showingResults && (
          <div>
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/40 bg-bg-secondary/60 p-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-text-tertiary">Results</p>
                <h2 className="font-display text-2xl font-semibold">
                  {summaryCount === 0 ? `No matches for "${query}"` : `${summaryCount} matches for "${query}"`}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedTerms.slice(0, 4).map((term) => (
                  <Link
                    key={term}
                    to={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border/40 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            {navigation.state !== 'idle' && navigation.location?.pathname === '/search' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-[4/5] rounded-2xl" />
                ))}
              </div>
            ) : summaryCount > 0 ? (
              <div className="space-y-12">
                {collections.length > 0 && (
                  <section>
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-display text-2xl font-semibold">Collections</h3>
                      <span className="text-sm text-text-secondary">{collections.length}</span>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {collections.map((collection) => (
                        <Link
                          key={collection.id}
                          to={`/collections/${collection.handle}`}
                          className="group overflow-hidden rounded-2xl border border-border/40 bg-bg-secondary"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            {collection.image && (
                              <ShopifyImage
                                src={collection.image.url}
                                alt={collection.image.altText || collection.title}
                                width={720}
                                height={450}
                                className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5">
                              <p className="mb-2 text-xs uppercase tracking-widest text-white/60">Collection</p>
                              <h4 className="font-display text-2xl font-semibold text-white">{collection.title}</h4>
                            </div>
                          </div>
                          <div className="p-5 text-sm text-text-secondary">
                            {collection.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {products.length > 0 && (
                  <section>
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-display text-2xl font-semibold">Products</h3>
                      <span className="text-sm text-text-secondary">{products.length}</span>
                    </div>
                    <StaggerContainer className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                      {products.map((product) => (
                        <StaggerItem key={product.id}>
                          <Link to={`/products/${product.handle}`} className="group product-card block">
                            <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-border/50 bg-bg-secondary transition-colors duration-300 group-hover:border-border-hover">
                              {product.images?.nodes[0] && (
                                <ShopifyImage
                                  src={product.images.nodes[0].url}
                                  alt={product.images.nodes[0].altText || product.title}
                                  width={720}
                                  height={720}
                                  className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                                  loading="lazy"
                                />
                              )}
                              {product.images?.nodes[1] && (
                                <ShopifyImage
                                  src={product.images.nodes[1].url}
                                  alt={product.images.nodes[1].altText || product.title}
                                  width={720}
                                  height={720}
                                  className="absolute inset-0 h-full w-full product-image-alt"
                                  loading="lazy"
                                />
                              )}
                              {product.tags?.includes('new-arrival') && (
                                <div className="absolute left-3 top-3">
                                  <Badge variant="new">New</Badge>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <h4 className="font-display text-base font-medium transition-colors duration-200 group-hover:text-accent">
                                {product.title}
                              </h4>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-text-secondary">
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
                  </section>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-border/40 bg-bg-secondary/60 p-8 md:p-10">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-widest text-text-tertiary">No Results</p>
                    <h3 className="font-display text-3xl font-semibold">Nothing matched that search.</h3>
                    <p className="mt-4 max-w-xl text-text-secondary">
                      Try a broader term, browse a collection directly, or jump into one of the suggested searches below.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {suggestedTerms.map((term) => (
                        <Link
                          key={term}
                          to={`/search?q=${encodeURIComponent(term)}`}
                          className="rounded-full border border-border/40 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-4 text-xs uppercase tracking-widest text-text-tertiary">Browse Instead</p>
                    <div className="space-y-3">
                      {quickLinks.length > 0 ? (
                        quickLinks.map((collection) => (
                          <Link
                            key={collection.id}
                            to={`/collections/${collection.handle}`}
                            className="flex items-center justify-between rounded-2xl border border-border/40 px-4 py-4 text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                          >
                            <span>{collection.title}</span>
                            <span>→</span>
                          </Link>
                        ))
                      ) : (
                        <Link
                          to="/collections"
                          className="flex items-center justify-between rounded-2xl border border-border/40 px-4 py-4 text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                        >
                          <span>View all collections</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!showingResults && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-border/40 bg-bg-secondary/60 p-8">
              <p className="mb-3 text-xs uppercase tracking-widest text-text-tertiary">Popular Searches</p>
              <div className="flex flex-wrap gap-3">
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    to={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border/40 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/40 bg-gradient-to-br from-bg-secondary to-bg-tertiary p-8">
              <p className="mb-3 text-xs uppercase tracking-widest text-text-tertiary">Browse Categories</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Headphones', href: '/collections/headphones' },
                  { label: 'In-Ear Monitors', href: '/collections/iem' },
                  { label: 'DACs & Amps', href: '/collections/dacs-amps' },
                  { label: 'Cables', href: '/collections/cables' },
                ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="rounded-2xl border border-border/40 px-4 py-4 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
