"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Ouvrir le panier" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-60">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              aria-hidden="true"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-500 ease-out"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-500 ease-out"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-background">
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-6">
                <p className="label-xs">
                  Panier{cart?.totalQuantity ? ` (${cart.totalQuantity})` : ""}
                </p>
                <button aria-label="Fermer le panier" onClick={closeCart}>
                  <XMarkIcon className="size-5" strokeWidth={1.25} />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="label-xs text-muted-foreground">
                    Panier vide
                  </p>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground/70">
                    Chaque pièce est éditée en série courte. Parcourez les
                    collections pour commencer votre archive.
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <ul className="flex-1 divide-y divide-border/60 overflow-y-auto">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li key={i} className="flex gap-4 px-6 py-6">
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="relative aspect-4/5 w-20 shrink-0 overflow-hidden bg-card"
                            >
                              <Image
                                className="object-cover"
                                fill
                                sizes="80px"
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText ||
                                  item.merchandise.product.title
                                }
                                src={
                                  item.merchandise.product.featuredImage.url
                                }
                              />
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <Link href={merchandiseUrl} onClick={closeCart}>
                                    <p className="font-display text-[0.6875rem] uppercase tracking-[0.2em]">
                                      {item.merchandise.product.title}
                                    </p>
                                  </Link>
                                  {item.merchandise.title !== DEFAULT_OPTION ? (
                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                      {item.merchandise.title}
                                    </p>
                                  ) : null}
                                </div>
                                <Price
                                  className="text-xs tabular-nums text-muted-foreground"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                  currencyCodeClassName="hidden"
                                />
                              </div>

                              <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center border border-border">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <span className="w-8 text-center text-xs tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="border-t border-border/60 px-6 py-6">
                    <div className="flex items-baseline justify-between">
                      <span className="label-xs text-muted-foreground">
                        Sous-total
                      </span>
                      <Price
                        className="text-sm tabular-nums"
                        amount={cart.cost.subtotalAmount.amount}
                        currencyCode={cart.cost.subtotalAmount.currencyCode}
                        currencyCodeClassName="hidden"
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground/60">
                      Livraison et taxes calculées au paiement.
                    </p>
                    <form action={redirectToCheckout}>
                      <CheckoutButton />
                    </form>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="label-xs mt-6 flex w-full items-center justify-center bg-foreground py-4 text-background transition-opacity duration-300 hover:opacity-80 disabled:opacity-50"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-background" /> : "Passer au paiement"}
    </button>
  );
}
