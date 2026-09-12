"use client";

import clsx from "clsx";
import { addItem, buyNow } from "components/cart/actions";
import { contenuMeta, suivreMeta } from "lib/meta-pixel";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

// La forme commune aux deux boutons, sans couleur de fond : deux classes de
// fond sur le même élément se départageraient par leur ordre d'émission dans
// la feuille de style, pas par l'ordre où on les écrit. Chaque état pose
// donc le sien, et un seul à la fois.
const SHAPE =
  "type-button flex h-[52px] w-full items-center justify-center transition-colors duration-500 ease-onde md:h-14";
// L'action décisive : un aplat blanc, texte noir.
const PRIMARY = "bg-foreground text-background hover:opacity-90";
// L'action secondaire : un filet, pas un aplat.
const SECONDARY = "border border-border-control text-foreground hover:bg-hover";
// Épuisé, ou taille non choisie : contour et texte éteint.
const DISABLED =
  "cursor-not-allowed border border-border-control text-muted-foreground";

/**
 * Les deux boutons d'achat d'une fiche produit.
 *
 * « Payer maintenant » est l'action principale : il crée un panier ne
 * contenant que cette pièce et emmène directement au paiement. C'est ce que
 * demandait la commande « que le client paye directement ».
 *
 * Il ne s'appelle pas « Revolut Pay », et il ne peut pas s'appeler ainsi.
 * Revolut Pay est une passerelle de paiement configurée dans Shopify : elle
 * se présente sur l'écran de paiement, au milieu des autres moyens activés,
 * et rien ne peut l'appeler depuis cette page. Un bouton portant ce nom
 * promettrait à l'acheteur un écran qu'il ne verra pas forcément — et il
 * mentirait le jour où la passerelle serait désactivée.
 *
 * « Ajouter au panier » reste, en second. Le retirer coûterait les commandes
 * à plusieurs pièces, qui sont précisément celles qui amortissent les frais
 * de port sur une boutique en fabrication à la demande.
 */
function BuyButtons({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  if (!availableForSale) {
    return (
      <button disabled className={clsx(SHAPE, DISABLED)}>
        Épuisé
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <div className="space-y-3">
        <button
          aria-label="Merci de sélectionner une option"
          disabled
          className={clsx(SHAPE, DISABLED)}
        >
          Payer maintenant
        </button>
        <button
          aria-label="Merci de sélectionner une option"
          disabled
          className={clsx(SHAPE, DISABLED)}
        >
          Ajouter au panier
        </button>
      </div>
    );
  }

  return null;
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [addMessage, addFormAction] = useActionState(addItem, null);
  const [buyMessage, buyFormAction] = useActionState(buyNow, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = addFormAction.bind(null, selectedVariantId);
  const buyNowAction = buyFormAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  const blocked = !availableForSale || !selectedVariantId;

  // Ce que Meta doit savoir de la pièce, une fois la taille choisie. Calculé
  // ici plutôt que dans chaque gestionnaire : les deux boutons décrivent le
  // même article, et deux descriptions séparées finiraient par diverger.
  //
  // `finalVariant` n'existe que si une variante est sélectionnée — d'où la
  // garde, qui est la même que celle des boutons juste en dessous.
  const contenu = blocked
    ? null
    : contenuMeta({
        variantId: finalVariant.id,
        titre: product.title,
        prix: finalVariant.price.amount,
        devise: finalVariant.price.currencyCode,
        categorie: product.collection?.title,
      });

  // Épuisé ou taille non choisie : les deux boutons sont inertes, et il n'y
  // a pas de formulaire à soumettre.
  if (blocked) {
    return (
      <BuyButtons
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
    );
  }

  return (
    <div className="space-y-3">
      <form
        action={async () => {
          // Avant la redirection, pas après : le paiement se passe sur le
          // domaine de Shopify, où ce pixel-ci n'existe plus. Passé ce
          // clic, plus rien de ce parcours n'est mesurable d'ici.
          suivreMeta("InitiateCheckout", { ...contenu, num_items: 1 });
          buyNowAction();
        }}
      >
        <button
          aria-label="Payer maintenant, sans passer par le panier"
          className={clsx(SHAPE, PRIMARY)}
        >
          Payer maintenant
        </button>
      </form>

      <form
        action={async () => {
          addCartItem(finalVariant, product);
          suivreMeta("AddToCart", contenu ?? undefined);
          addItemAction();
        }}
      >
        <button
          aria-label="Ajouter au panier"
          className={clsx(SHAPE, SECONDARY)}
        >
          Ajouter au panier
        </button>
      </form>

      <p aria-live="polite" className="sr-only" role="status">
        {buyMessage || addMessage}
      </p>
    </div>
  );
}
