import Price from "components/price";
import { hoverImage } from "lib/product-images";
import { colorSwatches } from "lib/product-options";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

/**
 * La carte produit du site. Une seule, partout : grille de collection,
 * résultats de recherche, recommandations d'une fiche produit.
 *
 * Il y en avait deux. Les collections utilisaient celle-ci ; les
 * recommandations de la fiche produit passaient par une tuile bordée avec
 * une étiquette flottante en verre dépoli, héritée du gabarit d'origine.
 * Deux pièces identiques n'avaient donc pas la même tête selon la page où
 * on les croisait.
 *
 * Pas de fond de carte : les visuels respirent sur le noir de la page.
 */
export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const image = product.featuredImage ?? product.images[0] ?? null;
  const secondary = hoverImage(product.images);
  const { swatches, extra } = colorSwatches(product);
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  // Les tailles au-delà du XL coûtent parfois plus cher : on annonce
  // le prix le plus bas, en le disant.
  const hasRange = minVariantPrice.amount !== maxVariantPrice.amount;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      aria-label={product.title}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-card">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-onde group-hover:scale-[1.03] group-hover:opacity-0"
          />
        ) : null}
        {secondary ? (
          <Image
            src={secondary.url}
            alt={secondary.altText || product.title}
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-700 ease-onde group-hover:opacity-100"
          />
        ) : null}

        {!product.availableForSale ? (
          <span className="type-label absolute bottom-3 left-3 bg-background/90 px-2 py-1 text-muted-foreground">
            Épuisé
          </span>
        ) : (
          /* Le repère « ceci s'achète », qui apparaît au survol.
             Volontairement pas un bouton : la plupart des pièces ont cinq
             tailles, et un ajout en un clic depuis la grille choisirait à
             la place de l'acheteur. Il ouvre la fiche, comme le reste de
             la carte — d'où le décoratif, pour ne pas imbriquer deux
             cibles cliquables l'une dans l'autre. */
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 flex size-10 items-center justify-center border border-border bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-all duration-500 ease-onde group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0"
          >
            <CartGlyph />
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="type-body text-sm leading-snug text-foreground">
            {product.title}
          </h3>
          {product.productType ? (
            <p className="type-label mt-1.5 text-muted-foreground">
              {product.productType}
            </p>
          ) : null}
        </div>
        <Price
          className="type-price shrink-0 text-muted-foreground"
          prefix={hasRange ? "Dès" : undefined}
          amount={minVariantPrice.amount}
          compareAtAmount={product.compareAtPriceRange.minVariantPrice.amount}
          currencyCode={minVariantPrice.currencyCode}
        />
      </div>

      {swatches.length > 1 ? (
        <ul className="mt-3 flex items-center gap-1.5">
          {swatches.map((swatch) => (
            <li
              key={swatch.value}
              title={swatch.value}
              className="relative size-4 overflow-hidden border border-border"
            >
              {swatch.url ? (
                <Image
                  src={swatch.url}
                  alt=""
                  fill
                  sizes="16px"
                  className="object-cover"
                />
              ) : null}
            </li>
          ))}
          {extra > 0 ? (
            <li className="type-label text-muted-foreground">+{extra}</li>
          ) : null}
        </ul>
      ) : null}
    </Link>
  );
}

/** Le cabas, dessiné plutôt qu'importé : deux traits et un rectangle. */
function CartGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M3 6h14l-1.2 10.5a1 1 0 0 1-1 .9H5.2a1 1 0 0 1-1-.9L3 6Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M7 8V5a3 3 0 0 1 6 0v3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
