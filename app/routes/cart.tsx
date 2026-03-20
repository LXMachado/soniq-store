import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { Button } from '~/components/ui/Button';
import { AnimateIn } from '~/components/motion/AnimateIn';
import { useCart } from '~/components/cart/CartProvider';
import { formatCurrency } from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'Cart — SŌNIQ' },
    { name: 'description', content: 'Your shopping cart.' },
  ];
};

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <AnimateIn>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>
        </AnimateIn>

        {isEmpty ? (
          <AnimateIn delay={0.05}>
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bg-secondary flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-text-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-text-secondary mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/collections">
                <Button variant="primary">Start Shopping</Button>
              </Link>
            </div>
          </AnimateIn>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-bg-secondary p-5 sm:flex-row"
                >
                  <Link
                    to={`/products/${item.merchandise.product.handle}`}
                    className="h-28 w-28 overflow-hidden rounded-xl bg-bg-tertiary"
                  >
                    {item.merchandise.image ? (
                      <img
                        src={item.merchandise.image.url}
                        alt={item.merchandise.image.altText || item.merchandise.product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-text-tertiary">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            to={`/products/${item.merchandise.product.handle}`}
                            className="font-display text-xl font-semibold hover:text-accent transition-colors"
                          >
                            {item.merchandise.product.title}
                          </Link>
                          {item.merchandise.selectedOptions.length > 0 && (
                            <p className="mt-1 text-sm text-text-secondary">
                              {item.merchandise.selectedOptions
                                .map((option) => `${option.name}: ${option.value}`)
                                .join(' / ')}
                            </p>
                          )}
                        </div>
                        <p className="font-mono text-base text-accent">
                          {formatCurrency(item.merchandise.price.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-border/50 bg-bg-primary">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-10 w-10 text-text-secondary transition-colors hover:text-text-primary"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-10 w-10 text-text-secondary transition-colors hover:text-text-primary"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-text-tertiary transition-colors hover:text-error"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-bg-secondary rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 border-b border-border/30 pb-4">
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span>Items</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="font-display text-lg">Subtotal</span>
                  <span className="font-display text-xl text-accent">
                    {formatCurrency(subtotal.toString())}
                  </span>
                </div>
                <Button
                  as="a"
                  href="#"
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  Checkout
                </Button>
                <p className="mt-3 text-xs text-text-tertiary">
                  Checkout redirects will be wired to Shopify in phase 4.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
