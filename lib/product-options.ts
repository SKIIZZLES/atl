import type { Product } from "lib/shopify/types";

/** Les noms sous lesquels Shopify livre l'option de coloris. */
const COLOR_OPTION_NAMES = new Set(["color", "colour", "couleur"]);
const SIZE_OPTION_NAMES = new Set(["size", "taille"]);

export type Swatch = {
  value: string;
  /** Le visuel de la première variante portant ce coloris. */
  url: string | null;
};

/**
 * Les pastilles de coloris d'une carte produit.
 *
 * Le brief demande des « swatches ». Sur ce catalogue, Shopify ne stocke
 * aucune couleur : l'option porte un nom (« Black », « Heather Grey »), pas
 * une valeur hexadécimale. Traduire ces noms en couleurs reviendrait à
 * inventer la donnée — et à se tromper dès le premier chiné.
 *
 * On prend donc le visuel de la variante, réduit à la taille d'une pastille.
 * C'est la seule information de couleur qui existe réellement, et elle est
 * juste par construction : c'est la pièce elle-même.
 */
export function colorSwatches(
  product: Product,
  limit = 5,
): {
  swatches: Swatch[];
  extra: number;
} {
  const option = product.options.find((entry) =>
    COLOR_OPTION_NAMES.has(entry.name.toLowerCase()),
  );
  if (!option) return { swatches: [], extra: 0 };

  const all: Swatch[] = option.values.map((value) => ({
    value,
    url:
      product.variants.find((variant) =>
        variant.selectedOptions.some(
          (selected) =>
            COLOR_OPTION_NAMES.has(selected.name.toLowerCase()) &&
            selected.value === value,
        ),
      )?.image?.url ?? null,
  }));

  return {
    swatches: all.slice(0, limit),
    extra: Math.max(0, all.length - limit),
  };
}

/**
 * Les tailles proposées, dans l'ordre où Shopify les donne — c'est celui de
 * l'admin, donc celui que la marque a choisi. Les retrier alphabétiquement
 * mettrait L avant M et XS après XL.
 */
export function sizeValues(product: Product): string[] {
  const option = product.options.find((entry) =>
    SIZE_OPTION_NAMES.has(entry.name.toLowerCase()),
  );
  return option?.values ?? [];
}
