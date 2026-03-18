import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { Button } from '~/components/ui/Button';
import { AnimateIn } from '~/components/motion/AnimateIn';

export const meta: MetaFunction = () => {
  return [
    { title: 'Cart — SŌNIQ' },
    { name: 'description', content: 'Your shopping cart.' },
  ];
};

export default function Cart() {
  // Placeholder cart - would integrate with Shopify Cart API in production
  const cartItems: never[] = [];
  const isEmpty = cartItems.length === 0;

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
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart items would go here */}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-bg-secondary rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
                {/* Summary details would go here */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}