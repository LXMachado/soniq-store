import { getMockProduct, getMockProducts, type MockProduct } from './mock/products';
import { getMockCollection, getMockCollections, type MockCollection } from './mock/collections';

const SHOPIFY_API_VERSION = '2024-01';
const MOCK_DATA = process.env.MOCK_DATA !== 'false';
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

interface StorefrontResponse<T> {
  data: T;
  errors?: Array<{ message: string; field?: string[] }>;
}

function getOperationName(query: string) {
  const match = query.match(/\b(?:query|mutation)\s+([A-Za-z0-9_]+)/);
  return match?.[1] ?? 'UnknownOperation';
}

function getStorefrontUrl() {
  return `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

export function isMockDataEnabled() {
  return MOCK_DATA;
}

export async function storefront<T, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables = {} as TVariables,
): Promise<T> {
  const operationName = getOperationName(query);

  if (MOCK_DATA) {
    return getMockData<T>(query, variables);
  }

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront API credentials not configured');
  }

  const response = await fetch(getStorefrontUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `${operationName} failed with HTTP ${response.status}: ${responseText.slice(0, 300)}`,
    );
  }

  const result: StorefrontResponse<T> = await response.json();

  if (result.errors) {
    console.error(`${operationName} Shopify API errors:`, result.errors);
    throw new Error(result.errors[0]?.message || `${operationName} failed`);
  }

  return result.data;
}

function getMockData<T>(query: string, variables: Record<string, unknown>): T {
  const operationName = getOperationName(query);
  const handle = variables.handle as string | undefined;
  const searchQuery = typeof variables.query === 'string' ? variables.query.toLowerCase() : '';

  switch (operationName) {
    case 'HomePage': {
      const heroProduct = getMockProduct('soniq-h1-pro');
      const allProducts = getMockProducts();
      const newArrivals = allProducts.filter((product) => product.tags.includes('new-arrival')).slice(0, 3);

      return {
        heroProduct,
        newArrivals: { nodes: newArrivals },
      } as T;
    }

    case 'ProductByHandle': {
      if (!handle) {
        throw new Error('Product handle is required');
      }

      const product = getMockProduct(handle);
      if (!product) {
        throw new Error(`Product not found: ${handle}`);
      }

      return { product } as T;
    }

    case 'RelatedProducts': {
      return {
        products: { nodes: getMockProducts() },
      } as T;
    }

    case 'SearchProducts': {
      const products = getMockProducts().filter((product) => {
        if (!searchQuery) return true;
        return [
          product.title,
          product.handle,
          product.description,
          product.vendor,
          product.productType,
          ...product.tags,
        ]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery);
      });

      return {
        products: { nodes: products },
        collections: { nodes: getMockCollections() },
      } as T;
    }

    case 'CollectionByHandle': {
      if (!handle) {
        throw new Error('Collection handle is required');
      }

      const collection = getMockCollection(handle);
      if (!collection) {
        throw new Error(`Collection not found: ${handle}`);
      }

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

    case 'Collections': {
      return {
        collections: { nodes: getMockCollections() },
      } as T;
    }

    default: {
      console.warn(`Unhandled mock operation "${operationName}", returning empty data`);
      return {} as T;
    }
  }
}

// Type exports for use in components
export type { MockProduct, MockCollection };
