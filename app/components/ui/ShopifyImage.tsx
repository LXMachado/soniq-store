import { cn } from '~/lib/utils';
import type { ImgHTMLAttributes } from 'react';

interface ShopifyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  sizes?: string;
}

function shopifyImageUrl(
  src: string,
  { width, height, crop = 'center' }: { width?: number; height?: number; crop?: string },
): string {
  // Only transform Shopify CDN URLs
  if (!src.includes('cdn.shopify.com')) return src;
  const url = new URL(src);
  if (width) url.searchParams.set('width', String(width));
  if (height) url.searchParams.set('height', String(height));
  if (crop) url.searchParams.set('crop', crop);
  return url.toString();
}

export function ShopifyImage({
  src,
  alt,
  width,
  height,
  crop = 'center',
  className,
  sizes,
  ...props
}: ShopifyImageProps) {
  if (!src) return null;

  const optimizedSrc = shopifyImageUrl(src, { width, height, crop });

  // Build srcset for Shopify CDN images
  const srcSet = src.includes('cdn.shopify.com') && width
    ? [400, 800, 1200]
        .filter((w) => w <= (width * 2))
        .map((w) => `${shopifyImageUrl(src, { width: w, crop })} ${w}w`)
        .join(', ')
    : undefined;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={sizes ?? (width ? `(max-width: 768px) 100vw, ${width}px` : '100vw')}
      className={cn('object-cover', className)}
      {...props}
    />
  );
}
