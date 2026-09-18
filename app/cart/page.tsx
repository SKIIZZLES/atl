import type { Metadata } from "next";

import { CartPageView } from "components/cart/cart-page";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre panier Onde Noire.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartPageView />;
}
