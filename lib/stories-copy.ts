/**
 * Le contenu éditorial de /stories.
 *
 * Trois natures de texte cohabitent ici, et la distinction compte :
 *
 * 1. Le manifeste (sections I à X) est écrit par le fondateur. C'est sa
 *    parole, remise en forme pour la lecture à l'écran — jamais inventée,
 *    jamais complétée. Si une phrase doit changer, elle vient de lui.
 * 2. Les chapitres LE TIGNON et N.GRI.TUD s'appuient sur des faits
 *    historiques documentés (le bando de 1786, la fondation de
 *    L'Étudiant noir en 1935). Ne pas y ajouter de détail non sourcé.
 * 3. Le bloc de clôture n'énonce que ce que l'immatriculation INPI
 *    atteste : Bourg-en-Bresse, juillet 2026, impression à la demande.
 *
 * La cadence en lignes courtes (kind: "cadence") reproduit le rythme du
 * texte d'origine. Ce n'est pas une liste : c'est de la ponctuation.
 */

/** Un paragraphe suivi, ou une suite de lignes courtes lues comme un souffle. */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "cadence"; lines: string[] };

export type Section = {
  id: string;
  numeral: string;
  title: string;
  standfirst: string;
  blocks: Block[];
  pullQuote?: string;
};

/** Le sommaire de la page, dans l'ordre de lecture. */
export const summary: { id: string; numeral: string; title: string }[] = [
  { id: "notre-histoire", numeral: "I", title: "Notre histoire" },
  { id: "pourquoi-onde-noire", numeral: "II", title: "Pourquoi Onde Noire" },
  { id: "le-88eme-echo", numeral: "III", title: "Le 88ème Écho" },
  { id: "les-chapitres", numeral: "IV", title: "Les chapitres" },
  { id: "futurisme-sobre", numeral: "V", title: "Le futurisme sobre" },
  { id: "langage-visuel", numeral: "VI", title: "Le langage visuel" },
  { id: "streetwear", numeral: "VII", title: "Le streetwear" },
  { id: "principes", numeral: "VIII", title: "Nos principes" },
  { id: "n-est-pas", numeral: "IX", title: "Ce que nous ne sommes pas" },
  { id: "vision", numeral: "X", title: "Notre vision" },
];

/** L'ouverture : le premier signal de la page. */
export const opening = {
  title: "Ce qui a été oublié n'a pas disparu.",
  standfirst:
    "Nous ne créons pas des vêtements. Nous transmettons des fragments.",
  blocks: [
    {
      kind: "cadence",
      lines: [
        "Il existe des histoires qui ont été archivées.",
        "Et d'autres qu'on a tenté d'effacer.",
        "Des noms oubliés.",
        "Des visages absents.",
        "Des langues déplacées.",
        "Des mémoires réduites au silence.",
      ],
    },
    {
      kind: "cadence",
      lines: [
        "Onde Noire est née dans cet espace.",
        "Pas dans la nostalgie.",
        "Dans la transmission.",
      ],
    },
  ] satisfies Block[],
};

/** Les sections de prose. Les blocs spécifiques (chapitres, axes,
 *  principes, refus) sont composés à part dans la page. */
export const sections: Section[] = [
  {
    id: "notre-histoire",
    numeral: "I",
    title: "Notre histoire",
    standfirst:
      "Que reste-t-il quand une histoire disparaît des livres, des musées et des écrans ?",
    blocks: [
      {
        kind: "p",
        text: "Onde Noire est née d'une question simple. Et la réponse tient en un mot : il reste des traces.",
      },
      {
        kind: "cadence",
        lines: [
          "Un nom transmis dans une famille.",
          "Une photographie sans légende.",
          "Un geste.",
          "Une coiffure.",
          "Un mot.",
          "Un tissu.",
          "Une archive.",
          "Un souvenir qui traverse plusieurs générations.",
        ],
      },
      {
        kind: "cadence",
        lines: [
          "Ces traces ne sont jamais totalement mortes.",
          "Elles voyagent.",
          "Elles se transforment.",
          "Elles deviennent une onde.",
          "Une Onde Noire.",
        ],
      },
      {
        kind: "p",
        text: "Une fréquence invisible qui traverse le temps, les frontières et les générations. Onde Noire est une marque construite autour de cette idée : notre histoire ne s'est jamais arrêtée, elle continue de circuler.",
      },
      {
        kind: "cadence",
        lines: [
          "De l'Afrique aux Caraïbes.",
          "Des Amériques à l'Europe.",
          "Des diasporas aux nouvelles générations.",
        ],
      },
      {
        kind: "p",
        text: "Ce qui a été dispersé continue pourtant de communiquer. Par la culture. Par l'art. Par la musique. Par les vêtements. Par les corps. Par la mémoire.",
      },
      {
        kind: "p",
        text: "Chaque pièce d'Onde Noire est pensée comme un fragment de cette transmission. Pas un costume identitaire. Pas une vision exotique de l'Afrique. Pas une collection fabriquée pour correspondre à ce que les autres imaginent de nous.",
      },
    ],
    pullQuote:
      "Onde Noire ne regarde pas vers un passé figé. Elle regarde ce qui arrive lorsque la mémoire rencontre le futur.",
  },
  {
    id: "pourquoi-onde-noire",
    numeral: "II",
    title: "Pourquoi Onde Noire",
    standfirst:
      "Une onde est un mouvement. On ne la voit pas toujours. Mais elle agit.",
    blocks: [
      {
        kind: "p",
        text: "Elle traverse l'espace, elle transporte une information. La mémoire fonctionne de la même manière.",
      },
      {
        kind: "p",
        text: "Une histoire racontée il y a cent ans peut encore influencer une génération qui ne l'a jamais entendue. Un symbole ancien peut réapparaître dans une ville à des milliers de kilomètres de son origine. Un peuple dispersé peut continuer à produire une culture commune sans partager le même territoire.",
      },
      {
        kind: "cadence",
        lines: [
          "L'Onde Noire, c'est cette fréquence.",
          "La fréquence de ce qui survit.",
          "La fréquence de ce qui revient.",
          "La fréquence des mémoires africaines et diasporiques qui refusent de disparaître.",
        ],
      },
      {
        kind: "p",
        text: "Le mot Noire n'est pas ici une couleur utilisée comme décoration. C'est une histoire. Une expérience. Une présence mondiale. Une multitude de peuples, de cultures, de langues et de trajectoires.",
      },
      {
        kind: "p",
        text: "Nous refusons de réduire cette diversité à un motif ou à un cliché. Nous préférons chercher les connexions. Les traces. Les transmissions.",
      },
    ],
    pullQuote:
      "Un peuple dispersé peut continuer à produire une culture commune sans partager le même territoire.",
  },
  {
    id: "le-88eme-echo",
    numeral: "III",
    title: "Onde Noire et Le 88ème Écho",
    standfirst:
      "Le média cherche les échos du passé. La marque les projette dans le présent.",
    blocks: [
      {
        kind: "p",
        text: "Onde Noire partage une même origine avec Le 88ème Écho : la conviction que certaines histoires doivent revenir au centre. Le 88ème Écho cherche les récits oubliés ; Onde Noire les fait circuler autrement.",
      },
      {
        kind: "p",
        text: "Là où le média raconte, enquête et transmet par l'image et la voix, Onde Noire transforme la mémoire en objet culturel. Le vêtement devient alors un support. Une surface. Une archive mobile.",
      },
      {
        kind: "cadence",
        lines: [
          "Une personne qui porte Onde Noire ne porte pas seulement un logo.",
          "Elle porte une question.",
          "Un mot.",
          "Un fragment.",
          "Une transmission.",
        ],
      },
    ],
  },
  {
    id: "langage-visuel",
    numeral: "VI",
    title: "Le langage visuel",
    standfirst:
      "Onde Noire doit pouvoir être reconnue avant même que le nom soit lu.",
    blocks: [
      {
        kind: "p",
        text: "Des symboles simples, forts et mystérieux. Des monogrammes capables de vivre seuls, comme une marque retrouvée sur un objet ancien. Des compositions architecturales : beaucoup d'espace, des alignements précis, une hiérarchie nette.",
      },
      {
        kind: "p",
        text: "Des codes et des numéros — TRANSMISSION 001, des séries, des fragments, des coordonnées conceptuelles. Des typographies modernes, éditoriales, précises : la typographie n'est pas un simple outil, elle fait partie du système de transmission.",
      },
      {
        kind: "p",
        text: "Et des détails cachés. Une pièce peut révéler quelque chose au second regard : une date, un mot, un symbole, un code. Parce que la découverte fait partie de l'expérience.",
      },
      {
        kind: "p",
        text: "Le symbole ne cherche pas à illustrer littéralement l'Afrique. Il peut évoquer en même temps une onde, une initiale, une porte, un visage, une archive, une technologie, une transmission.",
      },
    ],
    pullQuote:
      "Un bon symbole n'explique pas tout. Il laisse une trace dans la mémoire.",
  },
  {
    id: "streetwear",
    numeral: "VII",
    title: "Notre rapport au streetwear",
    standfirst: "Le streetwear est notre médium. Pas notre limite.",
    blocks: [
      {
        kind: "p",
        text: "Onde Noire utilise le vêtement, mais ne veut pas en être prisonnière. Nous voulons construire une marque qui peut vivre dans la rue, dans un clip, dans un musée, dans une exposition, dans un magazine, sur un écran — ou dans les archives d'une future génération.",
      },
      {
        kind: "p",
        text: "Chaque collection doit ressembler moins à une sortie de produits qu'à un nouveau chapitre. Une nouvelle transmission.",
      },
    ],
  },
  {
    id: "vision",
    numeral: "X",
    title: "Notre vision",
    standfirst: "Un jour, chaque collection d'Onde Noire sera un chapitre.",
    blocks: [
      {
        kind: "p",
        text: "Chaque chapitre aura ses symboles, ses objets, son histoire, ses références, ses codes cachés, son univers visuel.",
      },
      {
        kind: "p",
        text: "La personne qui découvre Onde Noire aujourd'hui ne doit pas seulement voir une marque. Elle doit avoir l'impression d'entrer dans quelque chose qui existait déjà avant elle. Et qui continuera après.",
      },
      {
        kind: "cadence",
        lines: [
          "Quelque chose de plus grand qu'un vêtement.",
          "Une archive en construction.",
          "Une fréquence qui traverse les générations.",
          "Une mémoire qui refuse de rester silencieuse.",
        ],
      },
    ],
  },
];

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
    standfirst: "Toute transmission commence par un signal. Voici le premier.",
    body: [
      "TRANSMISSION 001 n'est pas une collection qui cherche à tout raconter. C'est un point de départ. Une première émission. Un premier fragment envoyé dans le monde.",
      "Les mots, les signes et les vêtements de cette première transmission interrogent la mémoire, la dignité, l'identité, et ce que nous décidons de conserver. Des pièces comme N.GRI.TUD ou DIGNITÉ ne cherchent pas à donner une définition définitive : elles ouvrent un espace.",
      "Parce qu'un mot peut contenir plusieurs générations. Parce qu'un vêtement peut devenir un support de discussion. Parce qu'une identité ne tient pas dans une tendance.",
    ],
    pullQuote:
      "Le début d'une archive en mouvement. Et cette archive ne sera jamais terminée.",
    handle: "transmission-001",
  },
];

/** Les cinq axes du futurisme sobre. */
export const axes = [
  {
    index: "01",
    title: "L'archive",
    text: "Documents, fragments, cartographies, numéros, codes, annotations, dates, signaux, traces. L'esthétique doit parfois donner l'impression qu'un objet a été retrouvé, classé, conservé, puis réactivé. Pas vintage : archivé, puis projeté dans le futur.",
  },
  {
    index: "02",
    title: "La technologie oubliée",
    text: "Une technologie qui n'a pas besoin de ressembler à un ordinateur ou à un vaisseau spatial. Des symboles qui ressemblent à des systèmes, des signes qui pourraient être une écriture, une fréquence ou un code. Une sensation : je ne sais pas exactement ce que je regarde, mais je sens qu'il y a quelque chose derrière.",
  },
  {
    index: "03",
    title: "Le spirituel sans le folklore",
    text: "La spiritualité d'Onde Noire n'est pas décorative. Elle existe dans le silence, dans la répétition, dans les signes, dans l'espace, dans le rapport entre l'ombre et la lumière. Le mystère fait partie de l'identité : tout ne doit pas être immédiatement lisible.",
  },
  {
    index: "04",
    title: "Le noir",
    text: "Notre espace principal. Pas seulement une couleur : une profondeur, une archive, une absence et une apparition. Nous évitons le noir générique de la marque streetwear sans histoire. Notre noir doit sembler profond, minéral, mat, parfois presque cosmique.",
  },
  {
    index: "05",
    title: "La lumière",
    text: "Or ancien, bronze, ivoire, blanc cassé, métal, reflets discrets. La lumière ne devient jamais ostentatoire : elle apparaît comme une découverte, comme une information retrouvée dans une archive, comme une fréquence qui réussit à traverser l'obscurité.",
  },
];

/** Les cinq principes. */
export const principles = [
  {
    title: "Transmettre avant de décorer",
    text: "Chaque élément doit avoir une raison d'exister. Un mot n'est pas là parce qu'il est esthétique. Un symbole n'est pas là parce qu'il est « africain ». Il doit transmettre quelque chose.",
  },
  {
    title: "Le mystère avant l'explication",
    text: "Nous n'avons pas besoin de tout révéler immédiatement. Une marque forte laisse de l'espace à l'interprétation.",
  },
  {
    title: "La mémoire avant la tendance",
    text: "Les tendances passent, les histoires restent. Nous préférons construire lentement un langage identifiable plutôt que courir derrière chaque esthétique du moment.",
  },
  {
    title: "La densité avant le bruit",
    text: "Moins d'éléments, plus de sens. Une pièce peut être minimaliste et pourtant raconter énormément.",
  },
  {
    title: "Le futur sans oublier",
    text: "Nous ne voulons pas retourner dans le passé, mais savoir ce que nous emportons avec nous. Le futur n'est pas une rupture avec la mémoire : le futur est aussi ce que nous avons décidé de transmettre.",
  },
];

/** Ce qu'Onde Noire n'est pas. */
export const refusals = [
  "Une boutique de vêtements avec un logo collé sur un t-shirt.",
  "Une esthétique « africaine » destinée à rassurer les attentes occidentales.",
  "Une copie d'une marque de luxe.",
  "Une marque streetwear qui disparaîtra avec la prochaine tendance.",
  "Un moodboard Pinterest transformé en catalogue.",
];
