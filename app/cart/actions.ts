"use server";

import { cookies } from "next/headers";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCartLine,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

const CART_COOKIE = "onde_noire_cart_id";

async function getCartId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value;
}

async function setCartId(cartId: string) {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getOrCreateCart(): Promise<Cart | undefined> {
  const cartId = await getCartId();
  if (!cartId) return undefined;

  try {
    return await getCart(cartId);
  } catch {
    return undefined;
  }
}

export async function addItemToCart(
  merchandiseId: string,
  quantity = 1
): Promise<Cart> {
  const cartId = await getCartId();

  if (!cartId) {
    const cart = await createCart([{ merchandiseId, quantity }]);
    await setCartId(cart.id);
    return cart;
  }

  const existingCart = await getCart(cartId).catch(() => undefined);
  if (!existingCart) {
    const cart = await createCart([{ merchandiseId, quantity }]);
    await setCartId(cart.id);
    return cart;
  }

  return addToCart(cartId, [{ merchandiseId, quantity }]);
}

export async function updateCartItemQuantity(
  lineId: string,
  quantity: number
): Promise<Cart | undefined> {
  const cartId = await getCartId();
  if (!cartId) return undefined;

  if (quantity <= 0) {
    return removeFromCart(cartId, [lineId]);
  }

  return updateCartLine(cartId, [{ id: lineId, quantity }]);
}

export async function removeCartItem(lineId: string): Promise<Cart | undefined> {
  const cartId = await getCartId();
  if (!cartId) return undefined;
  return removeFromCart(cartId, [lineId]);
}
