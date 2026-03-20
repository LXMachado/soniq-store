export const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCard on Product {
    id
    title
    handle
    tags
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 2) {
      nodes {
        url
        altText
      }
    }
    variants(first: 1) {
      nodes {
        availableForSale
      }
    }
  }
`;

export const COLLECTION_CARD_FRAGMENT = `
  fragment CollectionCard on Collection {
    id
    handle
    title
    description
    image {
      url
      altText
    }
  }
`;

export const HOME_PAGE_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}

  query HomePage {
    heroProduct: product(handle: "soniq-h1-pro") {
      id
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 1) {
        nodes {
          url
          altText
        }
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
        }
      }
    }
    newArrivals: products(first: 3) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  ${COLLECTION_CARD_FRAGMENT}

  query Collections {
    collections(first: 20) {
      nodes {
        ...CollectionCard
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}

  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
      }
      products(first: 20) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
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
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
      metafields(
        identifiers: [
          { namespace: "specs", key: "driver_type" }
          { namespace: "specs", key: "impedance" }
          { namespace: "specs", key: "frequency_response" }
          { namespace: "specs", key: "sensitivity" }
          { namespace: "specs", key: "weight" }
          { namespace: "specs", key: "connector" }
          { namespace: "specs", key: "cable_length" }
        ]
      ) {
        key
        value
      }
    }
  }
`;

export const RELATED_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}

  query RelatedProducts {
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

export const SEARCH_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  ${COLLECTION_CARD_FRAGMENT}

  query SearchProducts($query: String!) {
    products(first: 24, query: $query) {
      nodes {
        ...ProductCard
      }
    }
    collections(first: 20) {
      nodes {
        ...CollectionCard
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;
