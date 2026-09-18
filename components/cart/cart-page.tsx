"use client";

import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";

type MerchandiseSearchParams = { [key: string]: string };

/**
 * Page panier dédiée.
 *
 * Avant, `/cart` renvoyait en 308 vers `/search` (héritage Shopify + l'idée
 * que le panier n'est qu'un tiroir). Les liens indexés et les retours
 * checkout tombaient donc sur le catalogue. Le tiroir du header reste ; cette
 * page sert les arrivées par URL.
 */
export function CartPageView() {
  const { cart, updateCartItem } = useCart();

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  return (
    <div className="below-header mx-auto max-w-3xl px-5 pb-24 md:px-10 md:pb-32">
      <p className="type-label text-muted-foreground">Panier</p>
      <h1 className="type-h1 mt-6">
        Votre panier
        {cart?.totalQuantity ? ` (${cart.totalQuantity})` : ""}
      </h1>

      {!cart || cart.lines.length === 0 ? (
        <div className="mt-16 flex flex-col items-start gap-6">
          <p className="type-body max-w-md text-muted-foreground">
            Panier vide. Chaque pièce est éditée en série courte — parcourez
            le catalogue pour commencer votre archive.
          </p>
          <Link
            href="/search"
            className="type-button inline-flex h-[52px] items-center bg-foreground px-7 text-background transition-opacity hover:opacity-90 md:h-14"
          >
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-12">
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {cart.lines
              .slice()
              .sort((a, b) =>
                a.merchandise.product.title.localeCompare(
                  b.merchandise.product.title,
                ),
              )
              .map((item, i) => {
                const merchandiseSearchParams = {} as MerchandiseSearchParams;
                item.merchandise.selectedOptions.forEach(({ name, value }) => {
                  if (value !== DEFAULT_OPTION) {
                    merchandiseSearchParams[name.toLowerCase()] = value;
                  }
                });
                const merchandiseUrl = createUrl(
                  `/products/${item.merchandise.product.handle}`,
                  new URLSearchParams(merchandiseSearchParams),
                );
                const image = item.merchandise.product.featuredImage;

                return (
                  <li key={i} className="flex gap-4 py-6">
                    <Link
                      href={merchandiseUrl}
                      className="relative aspect-4/5 w-24 shrink-0 overflow-hidden bg-product-pad"
                    >
                      {image ? (
                        <Image
                          className="object-cover"
                          fill
                          sizes="96px"
                          alt={image.altText || item.merchandise.product.title}
                          src={image.url}
                        />
                      ) : null}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={merchandiseUrl}
                            className="type-body text-foreground hover:underline"
                          >
                            {item.merchandise.product.title}
                          </Link>
                          {item.merchandise.title !== DEFAULT_OPTION ? (
                            <p className="type-label mt-1 text-muted-foreground">
                              {item.merchandise.title}
                            </p>
                          ) : null}
                        </div>
                        <Price
                          className="type-label shrink-0 tabular-nums"
                          amount={item.cost.totalAmount.amount}
                          currencyCode={item.cost.totalAmount.currencyCode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <EditItemQuantityButton
                            item={item}
                            type="minus"
                            optimisticUpdate={updateCartItem}
                          />
                          <p className="type-label w-8 text-center tabular-nums">
                            {item.quantity}
                          </p>
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

          <div className="mt-10 border-t border-border pt-8">
            <div className="flex items-baseline justify-between">
              <span className="type-label text-muted-foreground">Sous-total</span>
              <Price
                className="text-sm tabular-nums"
                amount={cart.cost.subtotalAmount.amount}
                currencyCode={cart.cost.subtotalAmount.currencyCode}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Livraison et taxes calculées au paiement.
            </p>
            <form action={redirectToCheckout}>
              <CheckoutButton />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="type-button mt-6 flex h-[52px] w-full items-center justify-center bg-white text-black transition-colors duration-500 ease-onde hover:opacity-90 disabled:opacity-50 md:h-14"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <LoadingDots className="bg-background" />
      ) : (
        "Passer au paiement"
      )}
    </button>
  );
}
