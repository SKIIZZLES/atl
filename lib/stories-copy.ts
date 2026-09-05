/**
 * Le contenu éditorial de /stories.
 *
 * Deux natures de texte cohabitent ici, et la distinction compte :
 * les chapitres LE TIGNON et N.GRI.TUD s'appuient sur des faits
 * historiques documentés, tandis que TRANSMISSION 001 et le manifeste
 * énoncent des positions de la marque. Rien n'y est inventé sur le
 * parcours personnel du fondateur — cette matière-là n'existe pas encore.
 */

export type Chapter = {
  index: string;
  title: string;
  period: string;
  place: string;
  standfirst: string;
  body: string[];
  pullQuote: string;
  handle: string;
};

export const chapters: Chapter[] = [
  {
    index: "01",
    title: "LE TIGNON",
    period: "1786",
    place: "Louisiane espagnole",
    standfirst:
      "Une loi ordonne aux femmes noires de couvrir leurs cheveux. Elles en font une couronne.",
    body: [
      "En 1786, le gouverneur Esteban Rodríguez Miró promulgue en Louisiane un bando de buen gobierno. Parmi ses articles, une obligation visant les femmes de couleur, libres comme esclaves : couvrir leur chevelure d'un tignon, un foulard noué. L'intention est explicite — signaler un rang, effacer une élégance jugée concurrente, remettre chacune à sa place dans la hiérarchie coloniale.",
      "La mesure échoue exactement là où elle visait. Les femmes nouent le tignon haut, le superposent, le travaillent en madras et en soie, y glissent des bijoux et des plumes. Ce que la loi voulait rendre invisible devient la chose la plus visible de la rue. Le signe d'infamie devient une signature.",
      "C'est ce retournement que la collection porte. Pas le foulard comme motif décoratif, mais le geste : prendre ce qui a été imposé et en faire une affirmation. Le tignon n'est pas un costume, c'est une méthode.",
    ],
    pullQuote: "La loi voulait effacer une élégance. Elle en a fondé une.",
    handle: "le-tignon",
  },
  {
    index: "02",
    title: "N.GRI.TUD",
    period: "1935",
    place: "Paris, Quartier latin",
    standfirst:
      "Trois étudiants retournent une insulte et en font un mouvement.",
    body: [
      "Aimé Césaire vient de la Martinique, Léopold Sédar Senghor du Sénégal, Léon-Gontran Damas de Guyane. Ils se rencontrent à Paris et fondent en 1935 la revue L'Étudiant noir. Le mot qu'ils reprennent est un mot d'injure, celui que la langue coloniale emploie pour rabaisser. Ils le gardent, et le retournent.",
      "Césaire fixe le terme en 1939 dans le Cahier d'un retour au pays natal. La négritude y désigne le refus de l'assimilation, la reconnaissance d'une histoire et d'une culture propres, la fin de l'excuse. Ce n'est pas une nostalgie : c'est une position, formulée dans la langue de celui qui dominait.",
      "La collection prend son nom, ponctué comme un sigle, comme une fréquence. Elle ne commente pas le mouvement, elle en applique le principe : une présence qui ne demande pas la permission.",
    ],
    pullQuote:
      "Ils ont gardé le mot de l'insulte et l'ont porté comme un drapeau.",
    handle: "n-gri-tud",
  },
  {
    index: "03",
    title: "TRANSMISSION 001",
    period: "2026",
    place: "Bourg-en-Bresse",
    standfirst:
      "Le premier signal. Ce qui se transmet quand plus personne ne raconte.",
    body: [
      "Les deux premiers chapitres regardent en arrière. Celui-ci ouvre. TRANSMISSION 001 est numérotée parce qu'il y en aura d'autres — c'est un début assumé, pas un lancement.",
      "La transmission n'est pas la conservation. Un héritage qu'on met sous verre est un héritage qui s'arrête. Ce qui circule se déforme, se réapproprie, change de contexte et continue : un motif qui traverse un océan, une coupe qui passe d'un continent à l'autre, un geste qu'on refait sans savoir d'où il vient.",
      "C'est le sens de la numérotation. Chaque collection est datée et située, comme une pièce d'archive — sauf que l'archive est ouverte, et qu'elle continue de s'écrire.",
    ],
    pullQuote: "Un héritage qu'on met sous verre est un héritage qui s'arrête.",
    handle: "transmission-001",
  },
];

export const refusals = [
  {
    no: "Le wax comme décoration",
    yes: "Le tissu porte une histoire de commerce, de colonisation et de réappropriation. Il n'est pas un imprimé qu'on applique pour signaler une origine.",
  },
  {
    no: "Les motifs tribaux génériques",
    yes: "Un motif vient d'un endroit et d'une époque. Un motif sans provenance n'est pas une référence, c'est un décor.",
  },
  {
    no: "L'afrofuturisme de catalogue",
    yes: "L'imaginaire diasporique ne se résume pas à une esthétique de science-fiction dorée. Le présent suffit à raconter.",
  },
  {
    no: "Le noir et or comme signe de luxe",
    yes: "Nos couleurs viennent du logo, pas d'un code de prestige emprunté. L'or y est une matière, pas une promesse de prix.",
  },
];
