import type { Product } from "lib/shopify/types";

/**
 * Les filtres du gabarit collection.
 *
 * Tout est dérivé des produits réellement présents dans la collection : on
 * ne propose jamais une taille, un coloris ou une catégorie qui ne
 * renverrait rien. Une facette absente du catalogue n'apparaît pas.
 *
 * Le filtrage se fait côté serveur, sur la liste déjà récupérée. La
 * collection tient dans une requête ; ajouter un aller-retour Shopify par
 * changement de case coûterait plus cher que de filtrer un tableau.
 */

const COLOR_NAMES = new Set(["color", "colour", "couleur"]);
const SIZE_NAMES = new Set(["size", "taille"]);

export type Facet = {
  /** La clé du paramètre d'URL. */
  key: FacetKey;
  label: string;
  values: { value: string; count: number }[];
};

export type FacetKey = "type" | "taille" | "couleur" | "prix";

export type Selection = Record<FacetKey, string[]>;

export const EMPTY_SELECTION: Selection = {
  type: [],
  taille: [],
  couleur: [],
  prix: [],
};

/** « M,L » → ["M", "L"]. Un paramètre absent donne une liste vide. */
export function parseSelection(searchParams: {
  [key: string]: string | string[] | undefined;
}): Selection {
  const read = (key: FacetKey) => {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw.join(",") : raw;
    return value ? value.split(",").filter(Boolean) : [];
  };
  return {
    type: read("type"),
    taille: read("taille"),
    couleur: read("couleur"),
    prix: read("prix"),
  };
}

export function hasSelection(selection: Selection): boolean {
  return Object.values(selection).some((values) => values.length > 0);
}

function optionValues(product: Product, names: Set<string>): string[] {
  const option = product.options.find((entry) =>
    names.has(entry.name.toLowerCase()),
  );
  return option?.values ?? [];
}

function priceOf(product: Product): number {
  return Number.parseFloat(product.priceRange.minVariantPrice.amount);
}

/**
 * Les tranches de prix, calculées sur la collection affichée plutôt
 * qu'écrites en dur : une collection à 39–85 € et une autre à 25–45 € n'ont
 * pas les mêmes paliers utiles. Trois tranches, arrondies à l'euro.
 */
export type PriceBand = { value: string; min: number; max: number };

export function priceBands(products: Product[]): PriceBand[] {
  if (products.length < 4) return [];
  const prices = products.map(priceOf).sort((a, b) => a - b);
  const low = Math.floor(prices[0]!);
  const high = Math.ceil(prices[prices.length - 1]!);
  if (high - low < 3) return [];

  const step = (high - low) / 3;
  const first = Math.round(low + step);
  const second = Math.round(low + step * 2);

  return [
    { value: `-${first}`, min: 0, max: first },
    { value: `${first}-${second}`, min: first, max: second },
    { value: `${second}+`, min: second, max: Number.POSITIVE_INFINITY },
  ];
}

export function priceBandLabel(band: PriceBand): string {
  if (band.min === 0) return `Moins de ${band.max} €`;
  if (band.max === Number.POSITIVE_INFINITY) return `${band.min} € et plus`;
  return `${band.min} – ${band.max} €`;
}

function tally(values: string[][]): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const list of values) {
    // Un produit compte une fois par valeur, même si plusieurs de ses
    // variantes la portent.
    for (const value of new Set(list)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()].map(([value, count]) => ({ value, count }));
}

export function buildFacets(products: Product[]): Facet[] {
  const facets: Facet[] = [];

  const types = tally(
    products.map((product) =>
      product.productType ? [product.productType] : [],
    ),
  ).sort((a, b) => a.value.localeCompare(b.value, "fr"));
  if (types.length > 1) {
    facets.push({ key: "type", label: "Catégorie", values: types });
  }

  // Les tailles gardent l'ordre de l'admin Shopify — XS, S, M, L, XL — que
  // le tri alphabétique casserait en mettant L avant M.
  const sizeOrder: string[] = [];
  for (const product of products) {
    for (const value of optionValues(product, SIZE_NAMES)) {
      if (!sizeOrder.includes(value)) sizeOrder.push(value);
    }
  }
  const sizes = tally(
    products.map((product) => optionValues(product, SIZE_NAMES)),
  ).sort((a, b) => sizeOrder.indexOf(a.value) - sizeOrder.indexOf(b.value));
  if (sizes.length > 1) {
    facets.push({ key: "taille", label: "Taille", values: sizes });
  }

  const colors = tally(
    products.map((product) => optionValues(product, COLOR_NAMES)),
  ).sort((a, b) => a.value.localeCompare(b.value, "fr"));
  if (colors.length > 1) {
    facets.push({ key: "couleur", label: "Couleur", values: colors });
  }

  const bands = priceBands(products);
  if (bands.length > 0) {
    facets.push({
      key: "prix",
      label: "Prix",
      values: bands.map((band) => ({
        value: band.value,
        count: products.filter(
          (product) =>
            priceOf(product) >= band.min && priceOf(product) < band.max,
        ).length,
      })),
    });
  }

  return facets.filter((facet) =>
    facet.values.some((entry) => entry.count > 0),
  );
}

export function applyFilters(
  products: Product[],
  selection: Selection,
): Product[] {
  const bands = priceBands(products);

  return products.filter((product) => {
    if (
      selection.type.length > 0 &&
      !selection.type.includes(product.productType)
    ) {
      return false;
    }

    if (selection.taille.length > 0) {
      const sizes = optionValues(product, SIZE_NAMES);
      if (!selection.taille.some((value) => sizes.includes(value)))
        return false;
    }

    if (selection.couleur.length > 0) {
      const colors = optionValues(product, COLOR_NAMES);
      if (!selection.couleur.some((value) => colors.includes(value))) {
        return false;
      }
    }

    if (selection.prix.length > 0) {
      const price = priceOf(product);
      const matches = selection.prix.some((value) => {
        const band = bands.find((entry) => entry.value === value);
        return band ? price >= band.min && price < band.max : false;
      });
      if (!matches) return false;
    }

    return true;
  });
}
