import type { Image } from "lib/shopify/types";

/**
 * Remet les visuels produit dans un ordre utile pour l'acheteur.
 *
 * Les fournisseurs d'impression à la demande poussent leurs mockups par
 * séries : toutes les faces de tous les coloris, puis tous les dos, puis
 * une autre série sous un autre angle. Le premier écran ne montrait donc
 * que des faces, et le dos — là où se trouve l'essentiel de l'impression —
 * arrivait au douzième clic quand il n'était pas coupé.
 *
 * Le libellé porte le coloris et le côté : « 0-Y99-Front Side ». On s'en
 * sert pour apparier chaque face à son dos, dans l'ordre d'apparition des
 * coloris. Les visuels sans ce motif — guide des tailles, fichiers de
 * design, produits Printify au libellé vide — gardent leur ordre et
 * passent à la fin.
 */
const SIDE = /-(front|back)\s*side\s*$/i;

function sideOf(alt: string): "front" | "back" | null {
  const match = alt.match(SIDE);
  return match ? (match[1]!.toLowerCase() as "front" | "back") : null;
}

/** « 0-Y99-Front Side » → « Y99 ». Le code identifie le coloris. */
function colorwayOf(alt: string): string {
  return alt.replace(SIDE, "").split("-").pop() ?? alt;
}

export function orderProductImages(images: Image[]): Image[] {
  // Une même série est renvoyée plusieurs fois sous des URL différentes mais
  // un libellé identique : on ne garde que la première de chaque libellé.
  const seen = new Set<string>();
  const unique = images.filter((image) => {
    const key = image.altText || image.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const paired = new Map<string, { front?: Image; back?: Image }>();
  const rest: Image[] = [];

  for (const image of unique) {
    const side = sideOf(image.altText ?? "");
    if (!side) {
      rest.push(image);
      continue;
    }
    const key = colorwayOf(image.altText!);
    const entry = paired.get(key) ?? {};
    // Première occurrence seulement : les angles suivants n'apportent rien
    // au premier coup d'œil et repousseraient le dos.
    if (!entry[side]) entry[side] = image;
    paired.set(key, entry);
  }

  if (paired.size === 0) return unique;

  const ordered: Image[] = [];
  for (const { front, back } of paired.values()) {
    if (front) ordered.push(front);
    if (back) ordered.push(back);
  }
  return [...ordered, ...rest];
}

/**
 * Le visuel qui apparaît au survol d'une carte produit. Le dos est ce qui
 * distingue deux pièces coupées dans le même vêtement de base — c'est donc
 * lui qu'on montre, quand il existe.
 *
 * Quand il n'existe pas, la carte ne change plus. Le repli précédent prenait
 * le deuxième visuel, qui sur un produit du fournisseur est la face d'un
 * autre coloris : survoler un hoodie noir affichait le même hoodie en beige,
 * comme s'il s'agissait d'un autre angle. Ne rien montrer est plus honnête
 * que montrer autre chose.
 *
 * Le repli reste pour les pièces photographiées, dont les visuels n'ont pas
 * de libellé de côté : là, le second visuel est bien la même pièce sous un
 * autre angle.
 */
export function hoverImage(images: Image[]): Image | null {
  const usesSides = images.some(
    (image) => sideOf(image.altText ?? "") !== null,
  );
  const back = images.find((image) => sideOf(image.altText ?? "") === "back");
  if (usesSides) return back ?? null;
  return images[1] ?? null;
}

/**
 * Le guide des tailles, quand le fournisseur en livre un.
 *
 * Il arrive dans les visuels du produit comme une image parmi d'autres, sans
 * champ dédié : on le reconnaît à son libellé. Rien de deviné — s'il n'y a
 * pas de correspondance, le lien ne s'affiche pas, plutôt que de promettre
 * un tableau qui n'existe pas.
 *
 * Le fournisseur ne l'appelle pas « size chart » mais `size-130U008` : un
 * préfixe suivi d'une référence d'article. Relevé sur tout le catalogue —
 * les huit produits qui en ont un le nomment ainsi, et le fichier est en
 * 1200×580 là où les mockups sont carrés. Le motif attendu ne correspondait
 * donc à rien, et le lien ne s'affichait sur aucune pièce.
 */
const SIZE_GUIDE =
  /^size[-_\s]|(size\s*chart|size\s*guide|guide\s*des\s*tailles|tableau\s*des\s*tailles)/i;

export function sizeGuideImage(images: Image[]): Image | null {
  return (
    images.find(
      (image) =>
        image.altText != null &&
        SIZE_GUIDE.test(image.altText) &&
        !SIDE.test(image.altText),
    ) ?? null
  );
}
