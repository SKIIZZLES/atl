export const OFFICIAL_COLLECTION_HANDLES = [
  "le-tignon",
  "n-gri-tud",
  "transmission-001",
] as const;

export const collectionTaglines: Record<string, string> = {
  "le-tignon": "Mémoire portée. Un héritage qui se transmet, sans costume.",
  "n-gri-tud": "Affirmation. Conscience. Une présence qui ne s'excuse pas.",
  "transmission-001": "Le premier signal. La diaspora en mouvement.",
};

export const collectionStories: Record<string, string> = {
  "le-tignon":
    "Le Tignon documente la mémoire, la transmission et l'élégance d'un geste porté de génération en génération.",
  "n-gri-tud":
    "N.GRI.TUD est une affirmation : identité, conscience, dignité — une présence qui ne s'excuse pas.",
  "transmission-001":
    "Transmission 001 est le premier signal : origine, archive, diaspora en mouvement.",
};

/**
 * Le mot unique posé sous le titre sur la carte de collection.
 *
 * Distinct de `collectionTaglines`, qui est une phrase : sur la carte, la
 * ligne passe sous un titre en gros et doit tenir sur un seul niveau de
 * lecture. C'est une étiquette, pas une description.
 */
export const collectionKickers: Record<string, string> = {
  "le-tignon": "Mémoire portée",
  "n-gri-tud": "Affirmation",
  "transmission-001": "Le premier signal",
};
