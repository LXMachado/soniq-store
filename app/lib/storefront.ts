import { getMockProduct, getMockProducts, type MockProduct } from './mock/products';
import { getMockCollection, getMockCollections, type MockCollection } from './mock/collections';

// Environment variables
const MOCK_DATA = process.env.MOCK_DATA === 'true';
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

interface StorefrontResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function storefront<T>(query: string, variables = {}): Promise<T> {
  // Phase 1-3: Use mock data
  if (MOCK_DATA) {
    return getMockData<T>(query, variables);
  }

  // Phase 4+: Use Shopify Storefront API
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront API credentials not configured');
  }

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const result: StorefrontResponse<T> = await response.json();

  if (result.errors) {
    console.error('Shopify API errors:', result.errors);
    throw new Error(result.errors[0]?.message || 'Shopify API error');
  }

  return result.data;
}

function getMockData<T>(query: string, variables: Record<string, unknown>): T {
  // Parse query to determine what data to return
  const queryLower = query.toLowerCase();
  const handle = variables.handle as string | undefined;

  // Homepage data query
  if (queryLower.includes('heroproduct') && queryLower.includes('newarrivals')) {
    const heroProduct = getMockProduct('soniq-h1-pro');
    const allProducts = getMockProducts();
    const newArrivals = allProducts.filter(p => p.tags.includes('new-arrival')).slice(0, 3);
    const featuredCollection = getMockCollection('new-arrivals');
    
    return {
      heroProduct,
      newArrivals,
      featuredCollection: featuredCollection ? {
        ...featuredCollection,
        products: { nodes: newArrivals, pageInfo: { hasNextPage: false, endCursor: null } },
      } : null,
    } as T;
  }

  // Product query
  if (queryLower.includes('product(') || queryLower.includes('productbyhandle')) {
    if (!handle) {
      // Return default product for homepage
      const defaultProduct = getMockProduct('soniq-h1-pro');
      return { product: defaultProduct } as T;
    }
    const product = getMockProduct(handle);
    if (!product) {
      throw new Error(`Product not found: ${handle}`);
    }
    return { product } as T;
  }

  // Products query (collection products)
  if (queryLower.includes('products(')) {
    const products = getMockProducts();
    return { products: { nodes: products } } as T;
  }

  // Collection query
  if (queryLower.includes('collection(') || queryLower.includes('collectionbyhandle')) {
    if (!handle) {
      throw new Error('Collection handle is required');
    }
    const collection = getMockCollection(handle);
    if (!collection) {
      throw new Error(`Collection not found: ${handle}`);
    }
    // Populate products based on collection type
    const allProducts = getMockProducts();
    const collectionProducts = allProducts.filter((product) => {
      switch (handle) {
        case 'headphones':
          return product.productType.includes('headphone');
        case 'iem':
          return product.productType.includes('IEM') || product.productType.includes('In-ear');
        case 'dacs-amps':
          return product.productType.includes('DAC') || product.productType.includes('Amplifier');
        case 'cables':
          return product.productType.includes('Cable');
        case 'new-arrivals':
          return product.tags.includes('new-arrival');
        default:
          return true;
      }
    });
    return {
      collection: {
        ...collection,
        products: {
          nodes: collectionProducts,
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    } as T;
  }

  // Collections query
  if (queryLower.includes('collections(')) {
    const collections = getMockCollections();
    return { collections: { nodes: collections } } as T;
  }

  // Featured collection (homepage)
  if (queryLower.includes('featuredcollection') || queryLower.includes('featuredcollection:collection')) {
    const products = getMockProducts().filter(p => p.tags.includes('new-arrival')).slice(0, 3);
    const collection = getMockCollection('new-arrivals');
    return {
      featuredCollection: collection ? {
        ...collection,
        products: { nodes: products, pageInfo: { hasNextPage: false, endCursor: null } },
      } : null,
    } as T;
  }

  // Default fallback
  console.warn('Unhandled mock query, returning empty data');
  return {} as T;
}

// Type exports for use in components
export type { MockProduct, MockCollection };
