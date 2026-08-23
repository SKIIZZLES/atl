import { shopifyFetch } from "./client";
import {
  addToCartMutation,
  createCartMutation,
  removeFromCartMutation,
  updateCartMutation,
} from "./mutations";
import {
  getCartQuery,
  getCollectionQuery,
  getCollectionsQuery,
  getProductQuery,
  getProductRecommendationsQuery,
} from "./queries";
import type {
  Cart,
  CartLine,
  Collection,
  Image,
  Product,
  ProductListItem,
} from "./types";

type Connection<T> = { edges: { node: T }[] };

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: Connection<Image>;
  variants: Connection<Product["variants"][number]>;
};

type RawProductListItem = Omit<ProductListItem, "variants"> & {
  variants: Connection<ProductListItem["variants"][number]>;
};

type RawCollection = Omit<Collection, "products"> & {
  products: Connection<RawProductListItem>;
};

type RawCartLine = Omit<CartLine, "merchandise"> & {
  merchandise: CartLine["merchandise"] & { id: string };
};

type RawCart = Omit<Cart, "lines"> & {
  lines: Connection<RawCartLine>;
};

function removeEdges<T>(connection: Connection<T> | null | undefined): T[] {
  return connection?.edges.map((edge) => edge.node) ?? [];
}

function reshapeProduct(product: RawProduct): Product {
  return {
    ...product,
    images: removeEdges(product.images),
    variants: removeEdges(product.variants),
  };
}

function reshapeProductListItem(product: RawProductListItem): ProductListItem {
  return {
    ...product,
    variants: removeEdges(product.variants),
  };
}

function reshapeCollection(collection: RawCollection): Collection {
  return {
    ...collection,
    products: removeEdges(collection.products).map(reshapeProductListItem),
  };
}

function reshapeCart(cart: RawCart): Cart {
  return {
    ...cart,
    lines: removeEdges(cart.lines).map((line) => ({
      id: line.id,
      quantity: line.quantity,
      cost: line.cost,
      merchandise: {
        id: line.merchandise.id,
        title: line.merchandise.title,
        selectedOptions: line.merchandise.selectedOptions,
        product: line.merchandise.product,
        image: line.merchandise.image,
        price: line.merchandise.price,
      },
    })),
  };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const data = await shopifyFetch<{ product: RawProduct | null }>({
    query: getProductQuery,
    variables: { handle },
    revalidate: 60,
  });
  if (!data.product) return undefined;
  return reshapeProduct(data.product);
}

export async function getProductRecommendations(
  productId: string
): Promise<ProductListItem[]> {
  const data = await shopifyFetch<{
    productRecommendations: RawProductListItem[] | null;
  }>({
    query: getProductRecommendationsQuery,
    variables: { productId },
    revalidate: 60,
  });
  return (data.productRecommendations ?? []).map(reshapeProductListItem);
}

export async function getCollection(
  handle: string,
  opts: { first?: number; sortKey?: string; reverse?: boolean } = {}
): Promise<Collection | undefined> {
  const data = await shopifyFetch<{ collection: RawCollection | null }>({
    query: getCollectionQuery,
    variables: { handle, ...opts },
    revalidate: 60,
  });
  if (!data.collection) return undefined;
  return reshapeCollection(data.collection);
}

export async function getCollections(): Promise<
  Pick<Collection, "id" | "handle" | "title" | "description" | "image">[]
> {
  const data = await shopifyFetch<{
    collections: Connection<
      Pick<Collection, "id" | "handle" | "title" | "description" | "image">
    >;
  }>({
    query: getCollectionsQuery,
    revalidate: 300,
  });
  return removeEdges(data.collections);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const data = await shopifyFetch<{ cart: RawCart | null }>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });
  if (!data.cart) return undefined;
  return reshapeCart(data.cart);
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = []
): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: RawCart } }>({
    query: createCartMutation,
    variables: { lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: RawCart } }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: RawCart } }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: RawCart } }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesRemove.cart);
}

export { isShopifyConfigured } from "./client";
export * from "./types";
