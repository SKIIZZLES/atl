/**
 * Le contenu de la page « À propos ».
 *
 * Ce fichier existe pour une raison précise : la page « À propos » lisait
 * jusqu'ici `stories-copy.ts`, c'est-à-dire la source du manifeste. Elle
 * réutilisait son ouverture, ses cinq axes, ses cinq principes et ses cinq
 * refus. Les deux pages ne se ressemblaient pas par le ton : elles
 * affichaient littéralement les mêmes phrases.
 *
 * Les deux pages ont deux fonctions éditoriales distinctes :
 *
 *   /manifeste  — ce que la maison défend. Écrit par le fondateur, en
 *                 cadence, à la première personne du pluriel. On y répond
 *                 à « pourquoi Onde Noire existe comme idée ».
 *   /a-propos   — qui est la maison, comment elle travaille, ce qu'elle
 *                 construit. Ton direct, faits vérifiables, aucune
 *                 formule. On y répond à « qui parle, et comment ».
 *
 * Règle de relecture : si une phrase d'ici pourrait être déplacée dans le
 * manifeste sans que personne ne le remarque, elle est à réécrire.
 *
 * Aucun fait n'est inventé. Le lieu et la date d'immatriculation viennent
 * de l'INPI ; les six familles de pièces et les trois collections viennent
 * du catalogue Shopify ; les dates et les lieux des chapitres viennent des
 * sources déjà documentées dans `stories-copy.ts`.
 */

export const intro = {
  label: "À propos",
  standfirst:
    "Une maison de création indépendante. Vous êtes ici du côté de l'atelier, pas de la vitrine.",
};

/** Les faits que l'on peut vérifier, et rien d'autre. */
export const facts: { label: string; value: string }[] = [
  { label: "Siège", value: "Bourg-en-Bresse, Ain" },
  { label: "Immatriculation", value: "Juillet 2026" },
  { label: "Collections", value: "Trois chapitres" },
  { label: "Catalogue", value: "Six familles de pièces" },
  { label: "Production", value: "À la demande, sans stock" },
];

/** 01 — Qui est Onde Noire ? */
export const who = {
  numeral: "01",
  /* Espace fine insécable avant le point d'interrogation. Le titre tombe
     dans une colonne étroite : avec une espace ordinaire, le « ? » passait
     seul à la ligne. Le reste du site écrit la ponctuation double avec une
     espace ordinaire ; changer cette convention partout est un autre
     chantier, celui-ci ne corrige que l'orphelin visible. */
  title: "Qui est Onde Noire ?",
  blocks: [
    "Onde Noire est une maison de création indépendante, éditée depuis Bourg-en-Bresse et immatriculée en juillet 2026.",
    "Nous prenons des références culturelles africaines et diasporiques — une loi, un journal, un geste, une archive — et nous en faisons des objets, des vêtements et des récits contemporains.",
    "Il n'y a pas d'équipe de trente personnes derrière ce site. C'est une structure petite, qui produit à la demande et qui assume d'avancer par chapitres plutôt que par saisons.",
  ],
};

/** 02 — Comment tout a commencé. */
export const origin = {
  numeral: "02",
  title: "Comment tout a commencé",
  blocks: [
    "Le projet est né d'un constat de travail, pas d'une intuition esthétique. Une grande partie des vêtements qui se réclament de l'Afrique en reprennent les motifs et en laissent l'histoire au vestiaire. Un motif se copie en une après-midi ; une source, il faut aller la chercher, la lire et la comprendre.",
    "Nous avons donc pris le problème par l'autre bout : partir d'un fait daté, situé et vérifiable, puis chercher ce qu'il devient une fois porté. La référence arrive avant le dessin, jamais l'inverse.",
    "C'est la seule règle qui n'a pas bougé depuis le premier jour. Elle a le défaut de ralentir tout le reste : une idée qui ne tient pas à la lecture d'une source ne va pas jusqu'au vêtement.",
  ],
};

/** 03 — Ce que nous faisons, au sens propre. */
export const doing = {
  numeral: "03",
  title: "Ce que nous faisons",
  items: [
    {
      title: "Nous dessinons des vêtements",
      text: "Six familles de pièces : t-shirts, hoodies et sweats, pantalons, vestes et manteaux, robes, accessoires. Coupes amples, matières denses, tombé travaillé pièce par pièce.",
    },
    {
      title: "Nous construisons des collections",
      text: "Chaque collection est un chapitre : une période, un lieu, une source. Elle porte un nom et une date, pas un numéro de saison.",
    },
    {
      title: "Nous produisons à la demande",
      text: "Aucune pièce n'est fabriquée avant d'être commandée. Pas de stock dormant, pas d'invendus à écouler en fin de saison.",
    },
    {
      title: "Nous travaillons l'image et le récit",
      text: "Les photographies, les descriptions, les fiches et les textes du site sont conçus en même temps que les pièces, par les mêmes personnes.",
    },
    {
      title: "Nous documentons ce que nous sortons",
      text: "Chaque pièce arrive avec son chapitre et sa référence. Un vêtement sans son contexte n'est qu'un imprimé.",
    },
  ],
};

/**
 * 04 — Les trois chapitres.
 *
 * Dates, lieux et sources repris de `stories-copy.ts`, où ils sont
 * documentés. Ici ils tiennent en trois lignes : le manifeste raconte,
 * cette page situe.
 */
export const collections: {
  handle: string;
  title: string;
  period: string;
  place: string;
  text: string;
}[] = [
  {
    handle: "transmission-001",
    title: "TRANSMISSION 001",
    period: "2026",
    place: "Bourg-en-Bresse",
    text: "Le premier chapitre. Il pose le vocabulaire de la maison — les signes, les cadrages, les mots qui reviendront ensuite. C'est le chapitre le plus large, et le moins spécialisé.",
  },
  {
    handle: "n-gri-tud",
    title: "N.GRI.TUD",
    period: "1935",
    place: "Paris, Quartier latin",
    text: "Part de L'Étudiant noir, le journal fondé par Aimé Césaire, Léopold Sédar Senghor et Léon-Gontran Damas. Le chapitre travaille l'affirmation et la présence, à partir d'un mot que ses auteurs ont retourné.",
  },
  {
    handle: "le-tignon",
    title: "LE TIGNON",
    period: "1786",
    place: "Louisiane espagnole",
    text: "Part du bando de buen gobierno du gouverneur Esteban Rodríguez Miró, qui impose aux femmes de couleur de couvrir leurs cheveux. Ce que le chapitre reprend n'est pas le foulard : c'est le retournement.",
  },
];

/** 05 — Les six étapes, dans l'ordre où elles se font. */
export const method: { numeral: string; title: string; text: string }[] = [
  {
    numeral: "01",
    title: "Recherche",
    text: "On part d'une source datée et située : un texte de loi, un journal, une photographie, un geste documenté. Pas d'un moodboard.",
  },
  {
    numeral: "02",
    title: "Référence",
    text: "On garde ce qui résiste au résumé — un mot, une décision, un objet. Ce qui n'est que joli s'arrête ici.",
  },
  {
    numeral: "03",
    title: "Interprétation",
    text: "On cherche ce que la référence devient une fois portée aujourd'hui. C'est l'étape la plus longue, et celle où la plupart des idées meurent.",
  },
  {
    numeral: "04",
    title: "Design",
    text: "Coupe, matière, placement, échelle. Le signe doit tenir sur un vêtement qu'on enfile un mardi matin sans y penser.",
  },
  {
    numeral: "05",
    title: "Production",
    text: "Fabrication à la demande, après la commande. Le délai est plus long qu'un stock ; le gaspillage est nul.",
  },
  {
    numeral: "06",
    title: "Objet final",
    text: "La pièce part avec son nom, son chapitre et sa source. C'est ce qui la sépare d'un imprimé.",
  },
];

/** 06 — Ce que la maison peut devenir. */
export const beyond = {
  numeral: "06",
  title: "Plus qu'une marque",
  blocks: [
    "Onde Noire est rangée dans le streetwear parce qu'il faut bien une case pour référencer une boutique. La case est trop petite.",
    "Ce que la maison construit peut prendre d'autres formes : une édition, une image, un objet, une collaboration, un texte. Le vêtement est ce par quoi nous avons commencé, parce que c'est le support le plus direct pour mettre une idée en circulation — on le porte, il sort dans la rue, il se voit.",
    "Ce n'est pas forcément là que ça s'arrête.",
  ],
};
