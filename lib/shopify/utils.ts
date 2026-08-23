import type { Image, Product, ProductVariant } from "./types";

export function formatPrice(amount: string, currencyCode: string, locale = "fr-FR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

const COLOR_OPTION_NAMES = ["couleur", "color", "colour"];

export function getColorOptionName(product: Product): string | undefined {
  return product.options.find((o) =>
    COLOR_OPTION_NAMES.includes(o.name.trim().toLowerCase())
  )?.name;
}

/**
 * Finds the variant matching every selected option. Falls back to undefined
 * when the combination doesn't exist (e.g. out-of-stock combo not sold).
 */
export function findVariant(
  product: Product,
  selectedOptions: Record<string, string>
): ProductVariant | undefined {
  return product.variants.find((variant) =>
    variant.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value
    )
  );
}

/**
 * The product catalog tags every image's alt text with "couleur:<value> | ..."
 * so a color can be linked to every angle shot (face, dos, ...), not just the
 * single image attached directly to the variant. This is what guarantees a
 * variant switch never leaves a mismatched photo on screen.
 */
export function imagesForColor(product: Product, colorValue: string | undefined): Image[] {
  if (!colorValue) return product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];

  const prefix = `couleur:${colorValue.trim().toLowerCase()}`;
  const matches = product.images.filter((img) =>
    img.altText?.trim().toLowerCase().startsWith(prefix)
  );

  if (matches.length > 0) return matches;

  // No tagged images for this color: fall back to the variant's own image
  // (never to another color's images) so we never show a mismatch.
  const variant = product.variants.find(
    (v) => v.selectedOptions.some((o) => o.value === colorValue) && v.image
  );
  if (variant?.image) return [variant.image];

  return product.featuredImage ? [product.featuredImage] : [];
}

export function defaultSelectedOptions(
  product: Product,
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string> {
  const selected: Record<string, string> = {};

  for (const option of product.options) {
    const fromUrl = searchParams[option.name];
    const value = Array.isArray(fromUrl) ? fromUrl[0] : fromUrl;
    if (value && option.values.includes(value)) {
      selected[option.name] = value;
    }
  }

  // Fill any missing option with the first variant that is available for
  // sale (or the very first variant if nothing is in stock).
  const preferredVariant =
    product.variants.find((v) =>
      Object.entries(selected).every(
        ([name, value]) =>
          v.selectedOptions.find((o) => o.name === name)?.value === value
      ) && v.availableForSale
    ) ??
    product.variants.find((v) =>
      Object.entries(selected).every(
        ([name, value]) =>
          v.selectedOptions.find((o) => o.name === name)?.value === value
      )
    ) ??
    product.variants[0];

  if (preferredVariant) {
    for (const opt of preferredVariant.selectedOptions) {
      if (!selected[opt.name]) selected[opt.name] = opt.value;
    }
  }

  return selected;
}
