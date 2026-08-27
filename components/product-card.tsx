import Price from "components/price";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index?: number;
}) {
  const image = product.featuredImage ?? product.images[0] ?? null;
  const secondary = product.images[1] ?? null;

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
            className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-0"
          />
        ) : null}
        {secondary ? (
          <Image
            src={secondary.url}
            alt={secondary.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
          />
        ) : null}
        {typeof index === "number" ? (
          <span className="label-xs absolute left-4 top-4 text-foreground/50">
            {(index + 1).toString().padStart(3, "0")}
          </span>
        ) : null}
        {!product.availableForSale ? (
          <span className="label-xs absolute bottom-4 left-4 bg-background/80 px-2 py-1 text-muted-foreground">
            Épuisé
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xs uppercase tracking-[0.2em] text-foreground">
          {product.title}
        </h3>
        <Price
          className="text-xs tabular-nums text-muted-foreground"
          amount={product.priceRange.minVariantPrice.amount}
          currencyCode={product.priceRange.minVariantPrice.currencyCode}
          currencyCodeClassName="hidden"
        />
      </div>
    </Link>
  );
}
