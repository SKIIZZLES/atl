import {
  cartFragment,
  productFragment,
  productListItemFragment,
} from "./fragments";

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...productFragment
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...productListItemFragment
    }
  }
  ${productListItemFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection(
    $handle: String!
    $first: Int = 24
    $sortKey: ProductCollectionSortKeys = BEST_SELLING
    $reverse: Boolean = false
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...productListItemFragment
          }
        }
      }
    }
  }
  ${productListItemFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections($first: Int = 20) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cartFragment
    }
  }
  ${cartFragment}
`;
