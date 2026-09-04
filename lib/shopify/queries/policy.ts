const policyFragment = /* GraphQL */ `
  fragment policy on ShopPolicy {
    id
    title
    handle
    body
    url
  }
`;

export const getShopPoliciesQuery = /* GraphQL */ `
  query getShopPolicies {
    shop {
      legalNotice {
        ...policy
      }
      privacyPolicy {
        ...policy
      }
      refundPolicy {
        ...policy
      }
      shippingPolicy {
        ...policy
      }
      termsOfService {
        ...policy
      }
    }
  }
  ${policyFragment}
`;
