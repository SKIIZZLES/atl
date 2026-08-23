const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-10";

type ShopifyResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export class ShopifyConfigError extends Error {}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
  revalidate,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number;
}): Promise<T> {
  if (!domain || !storefrontToken) {
    throw new ShopifyConfigError(
      "SHOPIFY_STORE_DOMAIN et SHOPIFY_STOREFRONT_ACCESS_TOKEN doivent être définis pour interroger le catalogue Shopify."
    );
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Shopify Storefront API error ${res.status} at ${endpoint}: ${body}`);
    throw new Error(`Shopify Storefront API error ${res.status}: ${body}`);
  }

  const json: ShopifyResponse<T> = await res.json();

  if (json.errors?.length) {
    console.error(
      `Shopify Storefront API GraphQL error at ${endpoint}: ${json.errors.map((e) => e.message).join(", ")}`
    );
    throw new Error(
      `Shopify Storefront API GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  return json.data as T;
}

export const isShopifyConfigured = Boolean(domain && storefrontToken);
