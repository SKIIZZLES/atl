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
 */
export function hoverImage(images: Image[]): Image | null {
  const back = images.find((image) => sideOf(image.altText ?? "") === "back");
  return back ?? images[1] ?? null;
}
