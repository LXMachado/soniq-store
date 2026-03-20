import { Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { storefront } from '../lib/storefront';
import { PRODUCT_BY_HANDLE_QUERY, RELATED_PRODUCTS_QUERY } from '../lib/shopify/queries';
import { formatCurrency } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AnimateIn } from '../components/motion/AnimateIn';
import { SpecTable } from '../components/product/SpecTable';
import { Pill } from '../components/ui/Pill';
import { useCart } from '../components/cart/CartProvider';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const product = data?.product;
  return [
    { title: product ? `${product.title} — SŌNIQ` : 'Product — SŌNIQ' },
    { name: 'description', content: product?.description || 'Premium audio equipment from SŌNIQ.' },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { handle } = params;

  if (!handle) {
    throw new Response('Product not found', { status: 404 });
  }

  type ProductData = {
    product: {
      id: string;
      title: string;
      handle: string;
      description: string;
      descriptionHtml: string;
      tags: string[];
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      images: { nodes: Array<{ url: string; altText: string }> };
      variants: {
        nodes: Array<{
          id: string;
          title: string;
          availableForSale: boolean;
          price: { amount: string; currencyCode: string };
          selectedOptions: Array<{ name: string; value: string }>;
          image: { url: string; altText: string } | null;
        }>;
      };
      metafields: Array<{ key: string; value: string }>;
    } | null;
  };

  const data = await storefront<ProductData>(PRODUCT_BY_HANDLE_QUERY, { handle });

  if (!data.product) {
    throw new Response('Product not found', { status: 404 });
  }

  type RelatedProductsData = {
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

  const relatedData = await storefront<RelatedProductsData>(RELATED_PRODUCTS_QUERY);
  const relatedProducts = (relatedData.products?.nodes ?? [])
    .filter((candidate) => candidate.handle !== data.product?.handle)
    .filter((candidate) =>
      candidate.tags?.some((tag) => data.product?.tags?.includes(tag)) ||
      candidate.title !== data.product?.title,
    )
    .slice(0, 4);

  return json({ product: data.product, relatedProducts });
}

export default function ProductPage() {
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const { addItem } = useCart();
  const images = product.images?.nodes ?? [];
  const variants = product.variants?.nodes ?? [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? '');
  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? variants[0],
    [selectedVariantId, variants],
  );
  const mainImage =
    selectedVariant?.image ?? images[selectedImageIndex] ?? images[0];
  const specs = product.metafields?.filter(m => m.value) ?? [];

  const selectedOptions = selectedVariant?.selectedOptions ?? [];

  function handleAddToCart() {
    if (!selectedVariant || !selectedVariant.availableForSale) return;

    addItem({
      merchandise: {
        id: selectedVariant.id,
        title: selectedVariant.title,
        product: {
          id: product.id,
          title: product.title,
          handle: product.handle,
        },
        image: selectedVariant.image ?? mainImage ?? null,
        price: selectedVariant.price,
        selectedOptions,
      },
    });
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <AnimateIn>
          <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-8">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text-primary">{product.title}</span>
          </nav>
        </AnimateIn>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <AnimateIn>
            <div className="space-y-4">
              <div className="relative aspect-square bg-bg-secondary rounded-2xl overflow-hidden border border-border/50">
                {mainImage && (
                  <img
                    src={mainImage.url}
                    alt={mainImage.altText || product.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
                {/* New badge */}
                {product.tags?.includes('new-arrival') && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="new">New</Badge>
                  </div>
                )}
              </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border transition-colors ${
                        index === selectedImageIndex
                          ? 'border-accent'
                          : 'border-border/50 hover:border-border-hover'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimateIn>

          {/* Product Info */}
          <AnimateIn delay={0.1}>
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-semibold text-accent">
                    {formatCurrency(
                      selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount,
                      selectedVariant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode,
                    )}
                  </p>
                  {selectedVariant?.availableForSale && (
                    <Badge variant="success">In Stock</Badge>
                  )}
                  {!selectedVariant?.availableForSale && (
                    <Badge variant="error">Out of Stock</Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="text-text-secondary leading-relaxed">
                {product.descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                ) : (
                  <p>{product.description}</p>
                )}
              </div>

              {/* Variants */}
              {variants.length > 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-text-primary">Select Option</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant) => (
                      <Pill
                        key={variant.id}
                        active={variant.id === selectedVariantId}
                        disabled={!variant.availableForSale}
                        onClick={() => {
                          setSelectedVariantId(variant.id);
                          if (variant.image) {
                            const variantImageIndex = images.findIndex(
                              (image) => image.url === variant.image?.url,
                            );
                            if (variantImageIndex >= 0) {
                              setSelectedImageIndex(variantImageIndex);
                            }
                          }
                        }}
                      >
                        {variant.title}
                        {!variant.availableForSale && ' (Out of stock)'}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}

              {selectedOptions.length > 0 && (
                <div className="rounded-2xl border border-border/50 bg-bg-secondary p-4">
                  <p className="mb-3 text-xs uppercase tracking-widest text-text-tertiary">
                    Selected configuration
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option: { name: string; value: string }) => (
                      <Badge key={`${option.name}-${option.value}`} variant="accent">
                        {option.name}: {option.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 pt-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!selectedVariant?.availableForSale}
                  onClick={handleAddToCart}
                >
                  {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button as={Link} to="/cart" variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Cart
                </Button>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-6 border-t border-border/50">
                  <p className="text-xs text-text-tertiary mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AnimateIn>

        </div>

        <div className="mt-12">
          <SpecTable specs={specs} />
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-border/30 pt-12">
            <AnimateIn>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-text-tertiary">
                    Related Products
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    Built for the same listening profile
                  </h2>
                </div>
                <Link to="/collections" className="text-sm text-accent transition-colors hover:text-accent-hover">
                  Browse all
                </Link>
              </div>
            </AnimateIn>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((relatedProduct, index) => (
                <AnimateIn key={relatedProduct.id} delay={0.05 * index}>
                  <Link to={`/products/${relatedProduct.handle}`} className="group block">
                    <div className="mb-4 aspect-square overflow-hidden rounded-2xl border border-border/50 bg-bg-secondary">
                      {relatedProduct.images?.nodes[0] && (
                        <img
                          src={relatedProduct.images.nodes[0].url}
                          alt={relatedProduct.images.nodes[0].altText || relatedProduct.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-medium transition-colors group-hover:text-accent">
                        {relatedProduct.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-text-secondary">
                          {formatCurrency(relatedProduct.priceRange.minVariantPrice.amount)}
                        </p>
                        {relatedProduct.variants?.nodes[0]?.availableForSale && (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
