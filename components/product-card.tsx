import Price from "components/price";
import { hoverImage } from "lib/product-images";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const image = product.featuredImage ?? product.images[0] ?? null;
  const secondary = hoverImage(product.images);
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  // Les tailles au-delà du XL coûtent parfois plus cher : on annonce
  // le prix le plus bas, en le disant.
  const hasRange = minVariantPrice.amount !== maxVariantPrice.amount;

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block"
      aria-label={product.title}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-card">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:opacity-0"
          />
        ) : null}
        {secondary ? (
          <Image
            src={secondary.url}
            alt={secondary.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        ) : null}
        {!product.availableForSale ? (
          <span className="label-xs absolute bottom-3 left-3 bg-background/90 px-2 py-1 text-muted-foreground">
            Épuisé
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-sm text-cuivre">{product.title}</h3>
        <Price
          className="label-xs tabular-nums text-muted-foreground"
          prefix={hasRange ? "À partir de" : undefined}
          amount={minVariantPrice.amount}
          compareAtAmount={product.compareAtPriceRange.minVariantPrice.amount}
          currencyCode={minVariantPrice.currencyCode}
        />
      </div>
    </Link>
  );
}
