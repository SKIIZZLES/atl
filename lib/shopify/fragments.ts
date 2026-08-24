export const imageFragment = /* GraphQL */ `
  fragment imageFragment on Image {
    url
    altText
    width
    height
  }
`;

export const moneyFragment = /* GraphQL */ `
  fragment moneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

export const variantFragment = /* GraphQL */ `
  fragment variantFragment on ProductVariant {
    id
    title
    availableForSale
    sku
    selectedOptions {
      name
      value
    }
    price {
      ...moneyFragment
    }
    compareAtPrice {
      ...moneyFragment
    }
    image {
      ...imageFragment
    }
  }
`;

export const productFragment = /* GraphQL */ `
  fragment productFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    availableForSale
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...moneyFragment
      }
      maxVariantPrice {
        ...moneyFragment
      }
    }
    featuredImage {
      ...imageFragment
    }
    images(first: 40) {
      edges {
        node {
          ...imageFragment
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          ...variantFragment
        }
      }
    }
  }
`;

export const productListItemFragment = /* GraphQL */ `
  fragment productListItemFragment on Product {
    id
    handle
    title
    availableForSale
    priceRange {
      minVariantPrice {
        ...moneyFragment
      }
      maxVariantPrice {
        ...moneyFragment
      }
    }
    featuredImage {
      ...imageFragment
    }
    variants(first: 100) {
      edges {
        node {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            ...imageFragment
          }
        }
      }
    }
  }
`;

export const cartFragment = /* GraphQL */ `
  fragment cartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...moneyFragment
      }
      totalAmount {
        ...moneyFragment
      }
      totalTaxAmount {
        ...moneyFragment
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...moneyFragment
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                ...moneyFragment
              }
              image {
                ...imageFragment
              }
              product {
                handle
                title
                featuredImage {
                  ...imageFragment
                }
              }
            }
          }
        }
      }
    }
  }
`;
