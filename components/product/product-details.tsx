"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { addItemToCart } from "@/app/cart/actions";
import { useCart } from "@/components/cart/cart-context";
import { Price } from "@/components/product/price";
import type { Product } from "@/lib/shopify/types";
import {
  defaultSelectedOptions,
  findVariant,
  getColorOptionName,
  imagesForColor,
} from "@/lib/shopify/utils";

export function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setCart, openCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [activeImage, setActiveImage] = useState(0);

  const colorOptionName = getColorOptionName(product);

  const selectedOptions = useMemo(
    () =>
      defaultSelectedOptions(
        product,
        Object.fromEntries(searchParams.entries())
      ),
    [product, searchParams]
  );

  const selectedVariant = useMemo(
    () => findVariant(product, selectedOptions),
    [product, selectedOptions]
  );

  const images = useMemo(() => {
    const list = imagesForColor(
      product,
      colorOptionName ? selectedOptions[colorOptionName] : undefined
    );
    return list.length ? list : product.featuredImage ? [product.featuredImage] : [];
  }, [product, selectedOptions, colorOptionName]);

  const currentImage = images[Math.min(activeImage, images.length - 1)];

  function selectOption(name: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set(name, value);
    setActiveImage(0);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    startTransition(async () => {
      const cart = await addItemToCart(selectedVariant.id, 1);
      setCart(cart);
      openCart();
    });
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950">
          {currentImage && (
            <Image
              key={currentImage.url}
              src={currentImage.url}
              alt={currentImage.altText || product.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(i)}
                aria-label={`Voir l'image ${i + 1}`}
                aria-current={i === activeImage}
                className={`relative aspect-square overflow-hidden border transition-opacity ${
                  i === activeImage
                    ? "border-white opacity-100"
                    : "border-neutral-800 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || product.title}
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
          {product.title}
        </h1>

        <div className="mt-3 text-lg text-neutral-200">
          {selectedVariant ? (
            <Price
              amount={selectedVariant.price.amount}
              currencyCode={selectedVariant.price.currencyCode}
              compareAtAmount={selectedVariant.compareAtPrice?.amount}
            />
          ) : (
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          )}
        </div>

        <div className="mt-8 space-y-6">
          {product.options.map((option) => (
            <div key={option.id}>
              <p className="mb-2 text-xs uppercase tracking-widest text-neutral-400">
                {option.name}
                {selectedOptions[option.name]
                  ? ` — ${selectedOptions[option.name]}`
                  : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  const wouldBeVariant = findVariant(product, {
                    ...selectedOptions,
                    [option.name]: value,
                  });
                  const disabled = !wouldBeVariant?.availableForSale;

                  return (
                    <button
                      key={value}
                      disabled={disabled}
                      onClick={() => selectOption(option.name, value)}
                      aria-pressed={isSelected}
                      className={`min-w-[3rem] border px-4 py-2 text-sm transition-colors ${
                        isSelected
                          ? "border-white bg-white text-black"
                          : "border-neutral-700 text-neutral-200 hover:border-white"
                      } ${
                        disabled
                          ? "cursor-not-allowed opacity-30 line-through"
                          : ""
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant?.availableForSale || isPending}
          className="mt-10 w-full bg-white py-4 text-sm font-medium uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {!selectedVariant
            ? "Combinaison indisponible"
            : !selectedVariant.availableForSale
              ? "Épuisé"
              : isPending
                ? "Ajout en cours…"
                : "Ajouter au panier"}
        </button>

        {selectedVariant?.sku && (
          <p className="mt-4 text-xs text-neutral-500">
            Référence {selectedVariant.sku}
          </p>
        )}

        {product.descriptionHtml && (
          <div
            className="prose prose-invert prose-sm mt-10 max-w-none text-neutral-300"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}
      </div>
    </div>
  );
}
