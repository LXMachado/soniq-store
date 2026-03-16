import type { MockProduct } from './products';

export interface MockCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: {
    url: string;
    altText: string;
  } | null;
  products: MockProduct[];
}

export const mockCollections: MockCollection[] = [
  {
    id: 'gid://shopify/Collection/1',
    handle: 'headphones',
    title: 'Headphones',
    description: 'Premium over-ear and on-ear headphones for audiophiles and professionals.',
    image: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop',
      altText: 'SŌNIQ Headphones Collection',
    },
    products: [],
  },
  {
    id: 'gid://shopify/Collection/2',
    handle: 'iem',
    title: 'In-Ear Monitors',
    description: 'High-fidelity IEMs with multiple driver configurations.',
    image: {
      url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&h=600&fit=crop',
      altText: 'SŌNIQ IEM Collection',
    },
    products: [],
  },
  {
    id: 'gid://shopify/Collection/3',
    handle: 'dacs-amps',
    title: 'DACs & Amplifiers',
    description: 'Desktop and portable digital-to-analog converters and headphone amplifiers.',
    image: {
      url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=1200&h=600&fit=crop',
      altText: 'SŌNIQ DACs & Amps',
    },
    products: [],
  },
  {
    id: 'gid://shopify/Collection/4',
    handle: 'cables',
    title: 'Cables & Accessories',
    description: 'Premium audio cables, ear tips, and accessories.',
    image: {
      url: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=1200&h=600&fit=crop',
      altText: 'SŌNIQ Cables',
    },
    products: [],
  },
  {
    id: 'gid://shopify/Collection/5',
    handle: 'new-arrivals',
    title: 'New Arrivals',
    description: 'The latest additions to the SŌNIQ product lineup.',
    image: {
      url: 'https://images.unsplash.com/photo-1519810755548-39cd217da494?w=1200&h=600&fit=crop',
      altText: 'SŌNIQ New Arrivals',
    },
    products: [],
  },
];

export function getMockCollection(handle: string): MockCollection | undefined {
  return mockCollections.find((collection) => collection.handle === handle);
}

export function getMockCollections(): MockCollection[] {
  return mockCollections;
}
