import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/product/price";
import type { ProductListItem } from "@/lib/shopify/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  const image = product.featuredImage;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        {!product.availableForSale && (
          <span className="absolute left-3 top-3 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
            Épuisé
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-sm text-neutral-200">{product.title}</h3>
        <Price
          amount={product.priceRange.minVariantPrice.amount}
          currencyCode={product.priceRange.minVariantPrice.currencyCode}
          className="whitespace-nowrap text-sm text-neutral-400"
        />
      </div>
    </Link>
  );
}
