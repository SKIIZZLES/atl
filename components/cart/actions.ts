"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  createCartWithLines,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Ajoute une pièce au panier.
 *
 * Les deux `catch` de ce fichier renvoyaient une chaîne anglaise et
 * jetaient l'erreur. Deux conséquences, et les deux ont coûté cher :
 * l'acheteur voyait un bouton qui ne faisait rien, et les journaux du
 * serveur ne gardaient aucune trace de la raison. Une vente qui échoue en
 * silence est pire qu'une vente qui échoue bruyamment — on ne la compte
 * même pas.
 *
 * L'erreur est donc journalisée côté serveur, et le message rendu est
 * français et lisible : il s'affiche maintenant sur la fiche.
 */
export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  if (!selectedVariantId) {
    return "Merci de sélectionner une taille.";
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    console.error("Ajout au panier impossible", {
      selectedVariantId,
      erreur: e,
    });
    return "L'ajout au panier a échoué. Réessayez dans un instant.";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

/**
 * Le paiement direct depuis la fiche produit.
 *
 * L'acheteur part au paiement avec cette seule pièce, sans passer par le
 * panier. Le panier qu'il avait éventuellement commencé n'est pas touché :
 * la commande directe vit dans son propre panier, créé pour l'occasion.
 *
 * Le paiement lui-même se fait sur le checkout hébergé par Shopify. C'est
 * là que se présentent les moyens de paiement activés dans l'administration
 * — Revolut Pay compris. Aucun d'eux ne peut être appelé depuis cette page :
 * une passerelle de paiement n'est pas un bouton qu'on pose sur une fiche,
 * et court-circuiter Shopify ferait disparaître la commande, donc la
 * fabrication à la demande qui en dépend.
 *
 * `redirect` est appelé hors du `try` : il lève une exception de contrôle
 * que Next intercepte lui-même, et l'attraper ici annulerait la
 * redirection.
 */
export async function buyNow(
  prevState: unknown,
  selectedVariantId: string | undefined,
) {
  if (!selectedVariantId) {
    return "Merci de sélectionner une option";
  }

  let checkoutUrl: string;
  try {
    const cart = await createCartWithLines([
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    if (!cart?.checkoutUrl) {
      console.error("Paiement direct : panier sans adresse de paiement", {
        selectedVariantId,
      });
      return "Le paiement est momentanément indisponible";
    }
    checkoutUrl = cart.checkoutUrl;
  } catch (e) {
    console.error("Paiement direct impossible", {
      selectedVariantId,
      erreur: e,
    });
    return "Le paiement est momentanément indisponible";
  }

  redirect(checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
