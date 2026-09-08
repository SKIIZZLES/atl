"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  // L'action principale de la fiche : fond or, texte noir. Elle était en
  // ivoire pleine largeur — un bloc clair au milieu d'une page sombre, et
  // le seul aplat de cette taille sur tout l'écran.
  const buttonClasses =
    "type-button flex h-[52px] w-full items-center justify-center bg-signal text-background transition-colors duration-500 ease-onde md:h-14";
  const disabledClasses =
    "cursor-not-allowed bg-border-control text-foreground/60 hover:bg-border-control";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Épuisé
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Merci de sélectionner une option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Ajouter au panier
      </button>
    );
  }

  return (
    <button
      aria-label="Ajouter au panier"
      className={clsx(buttonClasses, "hover:bg-brass")}
    >
      Ajouter au panier
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
