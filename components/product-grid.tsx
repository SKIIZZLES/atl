import { ProductCard } from "components/product-card";
import type { Product } from "lib/shopify/types";

/**
 * La grille de cartes produit, identique sur les trois gabarits.
 *
 * Deux colonnes dès le mobile, comme demandé : à 390 px une carte fait
 * environ 175 px de large, ce qui reste lisible, et deux colonnes montrent
 * qu'il y a une collection plutôt qu'une pièce.
 *
 * L'écart vertical est plus large que l'horizontal : c'est le nom, le type
 * et le prix qui séparent deux rangées, pas une gouttière.
 */
export function ProductGrid({
  products,
  columns = 3,
}: {
  products: Product[];
  /** Trois colonnes dans une page avec colonne latérale, quatre sans. */
  columns?: 3 | 4;
}) {
  return (
    <ul
      className={
        columns === 4
          ? "grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 xl:grid-cols-4"
          : "grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16"
      }
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < 2}
            sizes={
              columns === 4
                ? "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
                : "(min-width: 768px) 30vw, 45vw"
            }
          />
        </li>
      ))}
    </ul>
  );
}
