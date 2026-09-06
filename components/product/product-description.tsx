import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  // Même règle que sur la carte, sans quoi un même produit annonce deux
  // prix différents selon la page où on le regarde.
  const hasRange = minVariantPrice.amount !== maxVariantPrice.amount;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-8">
        <h1 className="font-display text-3xl uppercase tracking-tight text-balance text-cuivre md:text-4xl">
          {product.title}
        </h1>
        <Price
          className="text-sm tabular-nums text-muted-foreground"
          prefix={hasRange ? "À partir de" : undefined}
          amount={minVariantPrice.amount}
          compareAtAmount={product.compareAtPriceRange.minVariantPrice.amount}
          currencyCode={minVariantPrice.currencyCode}
          currencyCodeClassName="hidden"
        />
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-8 text-sm leading-relaxed text-muted-foreground"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
