import { Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { storefront } from '../lib/storefront';
import { formatCurrency } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AnimateIn } from '../components/motion/AnimateIn';
import { SpecTable } from '../components/product/SpecTable';

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

  const query = `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          nodes {
            url
            altText
          }
        }
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
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
  `;

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
        }>;
      };
      metafields: Array<{ key: string; value: string }>;
    } | null;
  };

  const data = await storefront<ProductData>(query, { handle });

  if (!data.product) {
    throw new Response('Product not found', { status: 404 });
  }

  return json({ product: data.product });
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  const images = product.images?.nodes ?? [];
  const variants = product.variants?.nodes ?? [];
  const mainImage = images[0];
  const specs = product.metafields?.filter(m => m.value) ?? [];

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
                  {images.slice(1).map((image, index) => (
                    <button
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-border-hover transition-colors"
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `${product.title} ${index + 2}`}
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
                    {formatCurrency(product.priceRange.minVariantPrice.amount)}
                  </p>
                  {variants[0]?.availableForSale && (
                    <Badge variant="success">In Stock</Badge>
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
                      <button
                        key={variant.id}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          variant.availableForSale
                            ? 'border-border/50 hover:border-accent text-text-primary'
                            : 'border-border/30 text-text-tertiary cursor-not-allowed'
                        }`}
                        disabled={!variant.availableForSale}
                      >
                        {variant.title}
                        {!variant.availableForSale && ' (Out of stock)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={!variants[0]?.availableForSale}
                >
                  {variants[0]?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
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

          {/* Specs */}
          <div className="mt-12">
            <SpecTable specs={specs} />
          </div>
        </div>
      </div>
    </div>
  );
}