'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CartDrawer } from './CartDrawer';

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
    };
    image: {
      url: string;
      altText: string;
    } | null;
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions: Array<{ name: string; value: string }>;
  };
}

interface AddToCartInput {
  merchandise: CartItem['merchandise'];
  quantity?: number;
}

interface CartContextValue {
  isReady: boolean;
  isOpen: boolean;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CART_STORAGE_KEY = 'soniq-cart';

const CartContext = createContext<CartContextValue | null>(null);

function readCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setIsReady(true);

    const onStorage = () => setItems(readCartFromStorage());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.merchandise.price.amount) * item.quantity,
      0,
    );

    return {
      isReady,
      isOpen,
      items,
      itemCount,
      subtotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: ({ merchandise, quantity = 1 }) => {
        setItems((currentItems) => {
          const existing = currentItems.find((item) => item.merchandise.id === merchandise.id);

          if (existing) {
            return currentItems.map((item) =>
              item.merchandise.id === merchandise.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }

          return [
            ...currentItems,
            {
              id: `cart-line-${merchandise.id}`,
              merchandise,
              quantity,
            },
          ];
        });
        setIsOpen(true);
      },
      updateQuantity: (id, quantity) => {
        setItems((currentItems) =>
          currentItems
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem: (id) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      },
    };
  }, [isOpen, isReady, items]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer
        isOpen={isOpen}
        onClose={value.closeCart}
        items={items}
        isLoading={!isReady}
        onQuantityChange={value.updateQuantity}
        onRemoveItem={value.removeItem}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
