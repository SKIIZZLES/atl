/**
 * Mockups modèles IA servis depuis `public/model-shots/<handle>.png`.
 *
 * Pas d'API Admin Shopify : les fichiers vivent dans le dépôt et
 * s'ajoutent à la galerie produit côté storefront quand le handle
 * correspond. La liste est générée à partir des PNG commités.
 */

export const MODEL_SHOT_HANDLES = new Set<string>([
  "le-tignon-hoodie-bando",
  "le-tignon-hoodie-couronne",
  "le-tignon-hoodie-delave",
  "le-tignon-hoodie-signature",
  "le-tignon-jogging-rue",
  "le-tignon-tee-madras",
  "le-tignon-tee-noeud",
  "n-gri-tud-bonnet-lisere",
  "n-gri-tud-tee-cahier",
  "n-gri-tud-tee-racine",
  "n-gri-tud-tee-retour",
  "ngritud-dignite-hoodie",
  "transmission-001-archive-sweat",
  "transmission-001-echo-tee",
  "transmission-001-hoodie-sillage",
  "transmission-001-jogging-relais",
  "transmission-001-origine-hoodie",
  "transmission-001-signal-zip-hoodie",
  "transmission-001-veste-frequence",
]);

export type GalleryImageLike = { src: string; altText: string };

/** Chemin public du mockup, ou `null` si aucun fichier pour ce handle. */
export function modelShotPath(handle: string): string | null {
  if (!MODEL_SHOT_HANDLES.has(handle)) return null;
  return `/model-shots/${handle}.png`;
}

/**
 * Place le mockup modèle en image principale (1ʳᵉ position), devant les
 * visuels Shopify. S'il n'y a aucune image Shopify, le mockup devient
 * le seul visuel. Déduplique si le mockup est déjà présent dans la liste.
 */
export function withModelShot(
  handle: string,
  images: GalleryImageLike[],
  productTitle: string,
): GalleryImageLike[] {
  const path = modelShotPath(handle);
  if (!path) return images;

  const shot: GalleryImageLike = {
    src: path,
    altText: `${productTitle} — porté`,
  };

  if (images.length === 0) return [shot];

  const withoutShot = images.filter((image) => image.src !== path);
  return [shot, ...withoutShot];
}