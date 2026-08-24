"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Cart } from "@/lib/shopify/types";

type CartContextValue = {
  cart: Cart | undefined;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCart: (cart: Cart | undefined) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: Cart | undefined;
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart | undefined>(initialCart);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider value={{ cart, isOpen, openCart, closeCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
