import { useEffect, useRef } from 'react';
import { Link } from '@remix-run/react';
import { Button } from '../ui/Button';
import { formatCurrency } from '~/lib/utils';
import type { CartItem } from './CartProvider';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  isLoading?: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items = [],
  isLoading = false,
  onQuantityChange,
  onRemoveItem,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [isOpen]);

  const isEmpty = items.length === 0;
  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.merchandise.price.amount) * item.quantity;
  }, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed inset-y-0 right-0 w-full max-w-md bg-bg-secondary border-l border-border/50 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <h2 className="font-display text-xl font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-48 px-6 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
                <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-text-secondary mb-4">Your cart is empty</p>
              <Link
              to="/collections"
              className="inline-flex items-center justify-center font-medium border transition-all duration-200 w-full px-6 py-3 text-sm gap-2 rounded-lg bg-transparent hover:bg-bg-tertiary text-text-primary border-border hover:border-border-hover"
              onClick={onClose}
            >
              Continue Shopping
            </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/30">
              {items.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      to={`/products/${item.merchandise.product.handle}`}
                      onClick={onClose}
                      className="w-20 h-20 bg-bg-tertiary rounded-lg overflow-hidden flex-shrink-0"
                    >
                      {item.merchandise.image ? (
                        <img
                          src={item.merchandise.image.url}
                          alt={item.merchandise.image.altText || item.merchandise.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.merchandise.product.handle}`}
                        onClick={onClose}
                        className="font-medium text-text-primary hover:text-accent transition-colors line-clamp-1"
                      >
                        {item.merchandise.product.title}
                      </Link>
                      {item.merchandise.selectedOptions.length > 0 && (
                        <p className="text-xs text-text-secondary mt-0.5">
                          {item.merchandise.selectedOptions.map((opt) => opt.value).join(' / ')}
                        </p>
                      )}
                      <p className="text-sm font-mono text-accent mt-1">
                        {formatCurrency(item.merchandise.price.amount)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="ml-auto text-text-tertiary hover:text-error transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-border/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-display text-lg font-semibold">
                {formatCurrency(subtotal.toString())}
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              Shipping and taxes calculated at checkout
            </p>
            <Button as={Link} to="/cart" variant="primary" size="lg" className="w-full" onClick={onClose}>
              View Cart
            </Button>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
