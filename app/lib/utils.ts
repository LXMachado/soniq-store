import { type ClassValue, clsx } from 'clsx';
import DOMPurify from 'dompurify';

// Classname utility
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Sanitize HTML to prevent XSS attacks
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'span', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}

// Currency formatter
export function formatCurrency(amount: string, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

// Format price with optional compare-at price
export function formatPrice(price: string, compareAtPrice?: string | null): string {
  const formattedPrice = formatCurrency(price);
  if (compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price)) {
    return `${formattedPrice}`;
  }
  return formattedPrice;
}

// Check if product is on sale
export function isOnSale(price: string, compareAtPrice?: string | null): boolean {
  return !!compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);
}

// Get availability text
export function getAvailabilityText(available: boolean): string {
  return available ? 'In Stock' : 'Out of Stock';
}

// Get availability variant for badge
export function getAvailabilityVariant(available: boolean): 'success' | 'error' | 'warning' {
  if (!available) return 'error';
  return 'success';
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}
