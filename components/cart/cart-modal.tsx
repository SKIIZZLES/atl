"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { removeCartItem, updateCartItemQuantity } from "@/app/cart/actions";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/shopify/utils";

export function CartModal() {
  const { cart, isOpen, closeCart, setCart } = useCart();
  const [isPending, startTransition] = useTransition();

  function changeQuantity(lineId: string, quantity: number) {
    startTransition(async () => {
      const updated = await updateCartItemQuantity(lineId, quantity);
      setCart(updated);
    });
  }

  function remove(lineId: string) {
    startTransition(async () => {
      const updated = await removeCartItem(lineId);
      setCart(updated);
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Fermer le panier"
        onClick={closeCart}
        className="absolute inset-0 bg-black/70"
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-black p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-widest text-white">Panier</h2>
          <button
            onClick={closeCart}
            aria-label="Fermer"
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {!cart || cart.lines.length === 0 ? (
          <p className="mt-10 text-sm text-neutral-500">Votre panier est vide.</p>
        ) : (
          <>
            <ul className="mt-8 flex-1 space-y-6 overflow-y-auto">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-neutral-950">
                    {(line.merchandise.image || line.merchandise.product.featuredImage) && (
                      <Image
                        src={
                          (line.merchandise.image ??
                            line.merchandise.product.featuredImage)!.url
                        }
                        alt={line.merchandise.product.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm text-white">
                        {line.merchandise.product.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {line.merchandise.selectedOptions
                          .map((o) => o.value)
                          .join(" / ")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-neutral-700">
                        <button
                          disabled={isPending}
                          onClick={() => changeQuantity(line.id, line.quantity - 1)}
                          className="px-2 py-1 text-neutral-300 hover:text-white"
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm text-white">
                          {line.quantity}
                        </span>
                        <button
                          disabled={isPending}
                          onClick={() => changeQuantity(line.id, line.quantity + 1)}
                          className="px-2 py-1 text-neutral-300 hover:text-white"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                      <button
                        disabled={isPending}
                        onClick={() => remove(line.id)}
                        className="text-xs text-neutral-500 underline hover:text-white"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300">
                    {formatPrice(
                      line.cost.totalAmount.amount,
                      line.cost.totalAmount.currencyCode
                    )}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-neutral-800 pt-6">
              <div className="flex justify-between text-sm text-neutral-300">
                <span>Sous-total</span>
                <span>
                  {formatPrice(
                    cart.cost.subtotalAmount.amount,
                    cart.cost.subtotalAmount.currencyCode
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Livraison et taxes calculées au checkout.
              </p>
              <Link
                href={cart.checkoutUrl}
                className="mt-6 block w-full bg-white py-4 text-center text-sm font-medium uppercase tracking-widest text-black transition-opacity hover:opacity-90"
              >
                Passer commande
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
