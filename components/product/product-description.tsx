import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-8">
        <h1 className="font-display text-3xl uppercase tracking-tight text-balance md:text-4xl">
          {product.title}
        </h1>
        <Price
          className="text-sm tabular-nums text-muted-foreground"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
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
