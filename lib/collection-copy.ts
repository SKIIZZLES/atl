export const OFFICIAL_COLLECTION_HANDLES = [
  "le-tignon",
  "n-gri-tud",
  "transmission-001",
] as const;

export type OfficialHandle = (typeof OFFICIAL_COLLECTION_HANDLES)[number];

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

/**
 * Le contenu éditorial d'une page collection.
 *
 * Un seul gabarit sert les trois chapitres ; ce qui change tient ici. Rien
 * n'y est inventé : la signature et le récit de chaque chapitre viennent du
 * brief de direction artistique, et les phrases de clôture sont celles qu'il
 * propose pour la bannière finale.
 *
 * `statement` est la composition typographique forte qui suit le récit —
 * la maquette y place un gros plan de textile ou d'étiquette. Faute d'une
 * telle photographie, la phrase tient seule sur le noir plutôt que d'aller
 * chercher un visuel qui ne dirait pas ça.
 */
export type CollectionPage = {
  /** Les lignes en capitales sous le titre du hero. */
  signature: string[];
  /** Le paragraphe d'ouverture, sous la signature. */
  intro: string;
  editorial: {
    label: string;
    title: string;
    body: string[];
    cta: { label: string; href: string };
  };
  statement?: string;
  finale: {
    title: string[];
    cta: { label: string; href: string };
  };
};

export const collectionPages: Record<OfficialHandle, CollectionPage> = {
  "le-tignon": {
    signature: [
      "Plus qu'un accessoire.",
      "Un symbole.",
      "Une force.",
      "Une transmission.",
    ],
    intro:
      "Le Tignon documente la mémoire, la transmission et l'élégance d'un geste porté de génération en génération.",
    editorial: {
      label: "Mémoire portée",
      title: "Un geste qui a traversé une loi.",
      body: [
        "Le tignon fut imposé pour marquer. Il est devenu une signature : hauteur, tissu, or, tenue. Ce que la contrainte voulait effacer, le geste l'a rendu visible.",
        "Cette collection ne costume pas cette histoire. Elle la continue, dans des pièces qui se portent aujourd'hui.",
      ],
      cta: { label: "Lire le manifeste", href: "/manifeste" },
    },
    finale: {
      title: ["Certaines histoires se racontent.", "D'autres se portent."],
      cta: { label: "Rejoindre le mouvement", href: "/#rejoindre" },
    },
  },

  "n-gri-tud": {
    signature: ["Affirmation.", "Résistance.", "Un avenir aujourd'hui."],
    intro:
      "N.GRI.TUD est une affirmation : identité, conscience, dignité — une présence qui ne s'excuse pas.",
    editorial: {
      label: "Affirmation",
      title: "Une présence qui ne s'excuse pas.",
      body: [
        "La négritude n'a jamais été une nostalgie. C'était une prise de parole, écrite au présent par ceux à qui on demandait de se taire.",
        "Les pièces de ce chapitre reprennent ce ton : le noir, la coupe large, le signe brodé plutôt que crié.",
      ],
      cta: { label: "Lire le manifeste", href: "/manifeste" },
    },
    finale: {
      title: ["Plus qu'un vêtement.", "Un mouvement."],
      cta: { label: "Rejoindre le mouvement", href: "/#rejoindre" },
    },
  },

  "transmission-001": {
    signature: ["Le premier signal."],
    intro:
      "La première transmission. Une identité mise en mouvement. Un langage créé pour traverser le temps.",
    editorial: {
      label: "Le premier signal",
      title: "Avant de devenir une marque, il fallait créer un langage.",
      body: [
        "Transmission 001 marque le commencement d'Onde Noire. Une première série de pièces pensées comme des signes, des fragments d'identité et des objets de transmission.",
        "Chaque pièce porte une idée : celle d'une culture qui ne disparaît pas, mais qui évolue.",
      ],
      cta: { label: "Découvrir l'univers", href: "/a-propos" },
    },
    statement: "Plus qu'une collection. Un premier signal.",
    finale: {
      title: ["Culture doesn't disappear.", "It moves."],
      cta: { label: "Rejoindre le mouvement", href: "/#rejoindre" },
    },
  },
};

export function isOfficialHandle(handle: string): handle is OfficialHandle {
  return (OFFICIAL_COLLECTION_HANDLES as readonly string[]).includes(handle);
}
