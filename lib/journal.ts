/**
 * Le Journal — les histoires derrière les pièces.
 *
 * Troisième espace éditorial du site, et le plus contraignant des trois :
 *
 *   /manifeste  — ce que la maison défend.
 *   /a-propos   — qui elle est, comment elle travaille.
 *   /journal    — d'où vient une pièce, et ce que les sources établissent.
 *
 * La règle qui gouverne ce fichier : un article sépare toujours ce que les
 * sources établissent de ce que la maison en a fait. Les deux ne se mêlent
 * jamais dans le même paragraphe, et l'interprétation ne se déguise jamais
 * en fait historique.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * AVERTISSEMENT SUR LA MÉTHODE — à lire avant d'ajouter un article
 * ─────────────────────────────────────────────────────────────────────────
 * La recherche de ces deux articles a été faite par recherche web depuis un
 * environnement dont le proxy réseau refuse l'accès direct aux domaines
 * documentaires : Wikipédia, JSTOR, la Historic New Orleans Collection,
 * 64 Parishes, la Smithsonian, Gallica et la Library of Congress répondent
 * toutes 403 au CONNECT. Les faits ci-dessous sont donc corroborés par
 * plusieurs résultats de recherche concordants, mais AUCUNE page source
 * n'a pu être ouverte et lue en entier.
 *
 * Conséquence pratique : les liens de la section « Sources » pointent vers
 * des références réelles et vérifiables, mais elles restent à contrôler une
 * par une avant publication définitive. Tant que ce contrôle n'est pas
 * fait, `sourcesVerifiees` reste à false et la page affiche la réserve au
 * lecteur. C'est exactement ce que le brief demande : ne jamais présenter
 * comme établi ce qui ne l'est pas.
 */

/** Une référence, telle qu'elle s'affiche au lecteur. */
export type Source = {
  title: string;
  publisher: string;
  date?: string;
  url: string;
};

/** Un bloc de texte. `reserve` marque ce que les sources ne tranchent pas. */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "reserve"; text: string };

export type Article = {
  slug: string;
  /** Le numéro d'ordre affiché, comme dans une revue. */
  numeral: string;
  category: "Histoires" | "Archives" | "Culture" | "Création" | "Collections";
  title: string;
  standfirst: string;
  /** Date de publication, en ISO. */
  date: string;
  /** Le chapitre auquel l'article se rattache. */
  collectionHandle: string;
  /** La pièce que l'article éclaire en premier. */
  piece?: { handle: string; name: string; why: string };
  /** 01 — L'histoire : qui, où, quand, dans quel contexte. */
  histoire: Block[];
  /** 02 — Ce que l'histoire raconte : symboles, pratiques, mémoire. */
  raconte: Block[];
  /** 03 — Ce qui nous a interpellés. Voix de la maison, pas des sources. */
  interpelles: Block[];
  /** 04 — De l'histoire au design. Voix de la maison. */
  design: Block[];
  /** 06 — Les références. */
  sources: Source[];
  /**
   * Faux tant que les sources n'ont pas été ouvertes et contrôlées une par
   * une. La page affiche alors une réserve explicite au lecteur.
   */
  sourcesVerifiees: boolean;
};

/** Un sujet identifié, mais dont l'histoire n'est pas encore documentée. */
export type EnPreparation = {
  collectionHandle: string;
  title: string;
  why: string;
};

export const CATEGORIES = [
  "Histoires",
  "Archives",
  "Culture",
  "Création",
  "Collections",
] as const;

export const articles: Article[] = [
  {
    slug: "le-tignon-ce-que-disent-les-sources",
    numeral: "01",
    category: "Archives",
    title: "Le tignon : ce que dit l'édit, et ce qu'on lui fait dire",
    standfirst:
      "Un décret espagnol de 1786, une histoire de résistance racontée partout, et un écart entre les deux que les historiens signalent depuis des années.",
    date: "2026-09-09",
    collectionHandle: "le-tignon",
    piece: {
      handle: "le-tignon-hoodie-bando",
      name: "LE TIGNON — Hoodie Bando",
      why: "La pièce porte le nom du texte lui-même, le bando de buen gobierno, et non celui du foulard.",
    },
    histoire: [
      {
        kind: "p",
        text: "Le 2 juin 1786, Esteban Rodríguez Miró, gouverneur espagnol de la Louisiane, promulgue à La Nouvelle-Orléans un bando de buen gobierno — une « proclamation de bon gouvernement ». C'est un texte de police général, qui traite de l'ordre public dans la colonie. L'une de ses dispositions concerne la tenue des femmes libres de couleur.",
      },
      {
        kind: "p",
        text: "Cette disposition ne parle pas de « tignon ». Elle interdit aux « negras, mulatas y quarteronas » de porter plumes et bijoux dans les cheveux, et leur impose de les porter llanos — plats, sans apprêt — ou couverts d'un pañuelo. Le mot tignon n'apparaît pas dans l'édit : il entre dans le lexique créole de Louisiane plus tard, et les plus anciennes occurrences imprimées relevées datent de la seconde moitié du XIXᵉ siècle.",
      },
      {
        kind: "p",
        text: "Le contexte est celui d'une population libre de couleur en croissance rapide à La Nouvelle-Orléans sous administration espagnole. La mesure appartient à la famille des lois somptuaires : elle règle qui a le droit de paraître comment, et elle sert à rendre une hiérarchie raciale lisible dans la rue.",
      },
    ],
    raconte: [
      {
        kind: "p",
        text: "Une loi somptuaire ne s'intéresse pas au tissu. Elle s'intéresse à la frontière. Ce que le texte de 1786 cherche à empêcher, ce n'est pas la coquetterie : c'est qu'on ne puisse plus distinguer, d'un coup d'œil, une femme libre de couleur d'une femme blanche. Des travaux universitaires ont souligné que ces réglementations, dans l'ensemble des Amériques, portaient moins sur la vanité supposée des femmes libres de couleur que sur le maintien de l'économie raciale de l'esclavage.",
      },
      {
        kind: "p",
        text: "Le foulard noué en hauteur existe bien dans la Louisiane du XIXᵉ siècle : il est documenté par des portraits, par des descriptions de marchandes de rue, par des tissus — le madras, notamment. C'est un fait matériel, indépendant de l'édit.",
      },
      {
        kind: "reserve",
        text: "Ce que les sources ne tranchent pas : l'application réelle de l'édit. Certaines analyses décrivent une application soutenue, par patrouilles et amendes ; d'autres relèvent l'absence de registres d'arrestation, d'amendes ou de peines explicitement liés à ce manquement. Nous ne présentons donc ni l'une ni l'autre comme établie.",
      },
      {
        kind: "reserve",
        text: "Autre point à ne pas confondre : les portraits de femmes libres de couleur en foulard, souvent cités comme preuve d'un détournement de la loi, sont pour l'essentiel postérieurs à la période coloniale espagnole. Ils documentent une pratique vestimentaire ; ils ne documentent pas une réponse à l'édit de 1786.",
      },
    ],
    interpelles: [
      {
        kind: "p",
        text: "Ce qui nous a frappés n'est pas l'histoire du tignon. C'est l'écart entre ce que le texte de 1786 dit et ce qu'on lui fait dire.",
      },
      {
        kind: "p",
        text: "Le récit qui circule partout est net et satisfaisant : une loi ordonne de cacher les cheveux, les femmes obéissent en nouant des couronnes de soie, l'humiliation devient signature. Il est raconté sur des dizaines de sites, y compris par des marques. Il a un défaut : il isole une disposition d'un texte de police plus large, et il attribue à un édit une pratique documentée surtout après lui. Des historiens décrivent ce mécanisme comme une fabrication de mythe romancé — pas un mensonge, mais un raccourci qui simplifie à la fois la loi et les femmes qu'elle visait.",
      },
      {
        kind: "p",
        text: "Nous avons buté sur un détail qui, à lui seul, dit tout le problème : le mot « tignon » n'est pas dans l'édit. On a donné au décret le nom d'un objet qu'il ne nomme pas, puis on a écrit l'histoire de cet objet à partir de ce nom.",
      },
      {
        kind: "p",
        text: "Cela ne rend pas l'édit moins violent. Cela rend la version courte moins fiable. Et une maison qui prétend partir des sources ne peut pas reprendre la version courte parce qu'elle est plus belle à raconter.",
      },
    ],
    design: [
      {
        kind: "p",
        text: "La collection ne représente pas un foulard. Aucune pièce n'imprime un tignon, aucune ne reprend un nouage en motif. C'était la première décision, et elle est venue de la recherche : reproduire l'objet aurait été refaire exactement ce que fait le récit court — prendre la forme et laisser le texte.",
      },
      {
        kind: "p",
        text: "Ce sont les noms qui portent l'histoire. Le Hoodie Bando porte le nom du décret, pas celui du foulard : le sujet de la pièce est le texte de loi. Le Hoodie Couronne nomme la lecture qu'on en fait couramment — et l'assume comme une lecture, pas comme un fait. Le Tee Madras et le Tee Nœud désignent la matière et le geste, qui sont documentés, quand l'intention l'est moins.",
      },
      {
        kind: "p",
        text: "Le vestiaire reste en noir, en gris et en délavés. Pas de madras imprimé, pas de motif « louisianais ». Ce qui se transmet dans cette collection est une manière de tenir la tête, pas une palette régionale — et un délavé pièce par pièce dit mieux une chose portée longtemps qu'un imprimé qui cite.",
      },
    ],
    sources: [
      {
        title: "Tignon law",
        publisher: "Wikipedia — notice et son appareil de références",
        url: "https://en.wikipedia.org/wiki/Tignon_law",
      },
      {
        title: "Creole Chic",
        publisher: "The Historic New Orleans Collection",
        url: "https://hnoc.org/publishing/first-draft/creole-chic",
      },
      {
        title:
          "Identity Theft: a rare painting damaged, a story half told, and a reckoning",
        publisher: "The Historic New Orleans Collection",
        url: "https://hnoc.org/publishing/first-draft/identity-theft-rare-painting-damaged-story-half-told-and-reckoning-about",
      },
      {
        title: "Free People of Color in Colonial Louisiana",
        publisher: "64 Parishes — Louisiana Endowment for the Humanities",
        url: "https://64parishes.org/entry/free-people-of-color-in-colonial-louisiana-adaptation",
      },
      {
        title:
          "The Mulatta Concubine: Terror, Intimacy, Freedom, and Desire in the Black Transatlantic",
        publisher: "Lisa Ze Winters, University of Georgia Press",
        date: "2016",
        url: "https://ugapress.org/book/9780820349565/the-mulatta-concubine/",
      },
      {
        title: "Fashionable Rebellion",
        publisher: "Women & the American Story — New-York Historical Society",
        url: "https://wams.nyhistory.org/settler-colonialism-and-revolution/settler-colonialism/fashionable-rebellion/",
      },
    ],
    sourcesVerifiees: false,
  },
  {
    slug: "n-gri-tud-un-mot-et-sa-date",
    numeral: "02",
    category: "Archives",
    title: "N.GRI.TUD : un mot, une revue, et une date précise",
    standfirst:
      "Trois étudiants, un journal fondé à Paris en 1935, et un terme qui n'apparaît pas dans le premier numéro.",
    date: "2026-09-09",
    collectionHandle: "n-gri-tud",
    piece: {
      handle: "n-gri-tud-tee-cahier",
      name: "N.GRI.TUD — Tee Cahier",
      why: "Le nom renvoie au Cahier d'un retour au pays natal, le texte par lequel le mot atteint le public.",
    },
    histoire: [
      {
        kind: "p",
        text: "En 1935, à Paris, trois étudiants fondent une revue : Aimé Césaire, martiniquais, Léon-Gontran Damas, guyanais, et Léopold Sédar Senghor, sénégalais. Elle s'appelle L'Étudiant noir et succède à L'Étudiant martiniquais, publication de l'association des étudiants martiniquais en France. Le titre est proposé par Césaire, et l'élargissement qu'il opère est le geste fondateur : on passe d'une origine insulaire à une condition partagée.",
      },
      {
        kind: "p",
        text: "Le premier numéro paraît en mars 1935. La revue paraît ensuite de façon irrégulière, et sert de carrefour intellectuel jusqu'aux environs de 1940.",
      },
      {
        kind: "p",
        text: "Le mot « négritude » n'est pas dans ce premier numéro. Il apparaît, dans son sens actuel, sous la plume de Césaire, dans le troisième numéro, daté de mai-juin 1935. Le premier numéro traite déjà de culture, d'assimilation, de société et de politique — mais le terme n'y est pas encore.",
      },
    ],
    raconte: [
      {
        kind: "p",
        text: "Trois choses tiennent dans cette histoire, et elles sont d'ordres différents.",
      },
      {
        kind: "p",
        text: "Une décision de langue, d'abord : reprendre un mot chargé d'injure et le retourner en revendication. Le procédé est explicite, il est daté, il a un auteur et un support imprimé.",
      },
      {
        kind: "p",
        text: "Une décision de périmètre, ensuite : passer de « martiniquais » à « noir », c'est-à-dire construire une adresse commune entre les Antilles, la Guyane et l'Afrique, à un moment où l'administration coloniale a tout intérêt à les tenir séparées.",
      },
      {
        kind: "p",
        text: "Un support, enfin. Ce n'est pas un discours ni un manifeste isolé : c'est une revue étudiante, tirée petitement, qui met plusieurs numéros à formuler ce qu'elle cherche. Le mot arrive au troisième.",
      },
      {
        kind: "reserve",
        text: "Ce que nous ne tranchons pas : la part exacte de chacun des trois dans la formulation du concept fait l'objet de discussions savantes, et les numéros conservés de la revue sont peu nombreux. Nous nous en tenons à ce qui est daté et attribué : l'occurrence de mai-juin 1935, sous la signature de Césaire.",
      },
    ],
    interpelles: [
      {
        kind: "p",
        text: "Ce qui nous a frappés, c'est que le mot arrive au troisième numéro.",
      },
      {
        kind: "p",
        text: "Une idée qu'on présente d'ordinaire comme une fondation — trois hommes, une revue, un concept — a mis trois parutions à trouver son terme. Il y a eu deux numéros avant, qui cherchaient sans nommer. C'est la chose la moins héroïque de cette histoire, et c'est celle qui nous a paru la plus juste.",
      },
      {
        kind: "p",
        text: "Nous travaillons de la même manière, et beaucoup plus modestement : un chapitre n'est pas une déclaration, c'est une série d'essais dont le sens n'apparaît pas au premier.",
      },
      {
        kind: "p",
        text: "L'autre chose retenue : le retournement est une opération, pas une posture. Il porte sur un mot précis, à une date précise, dans un imprimé qu'on peut aller chercher. C'est vérifiable. Beaucoup de récits d'affirmation ne le sont pas.",
      },
    ],
    design: [
      {
        kind: "p",
        text: "Le nom de la collection est écrit N.GRI.TUD, en points et sans le « e ». Le mot n'est pas cité tel quel : il est marqué comme un sigle, comme une référence à un terme plutôt que le terme lui-même. C'est la distance que nous voulions — nous ne reprenons pas la négritude à notre compte, nous désignons l'opération de langue qui l'a produite.",
      },
      {
        kind: "p",
        text: "Les pièces portent les étapes de cette opération. Le Tee Cahier renvoie au Cahier d'un retour au pays natal, par lequel le mot atteint un public plus large que celui d'une revue étudiante. Le Tee Retour et le Tee Racine nomment le mouvement du texte, pas une origine géographique. Les hoodies Présence et Dignité désignent ce que le mot revendiquait.",
      },
      {
        kind: "p",
        text: "Aucun motif ethnique, aucun symbole emprunté à une culture particulière. L'histoire de N.GRI.TUD se passe dans le Quartier latin, en français, dans une revue imprimée : lui coller un motif ouest-africain aurait été une erreur de lieu et une erreur de sujet. Le vestiaire est donc typographique — le délavage pièce par pièce en est la seule matière.",
      },
    ],
    sources: [
      {
        title: "L'Étudiant noir",
        publisher: "Digital PUL — Princeton University Library",
        url: "https://dpul.princeton.edu/surrealism-at-one-hundred/feature/l-etudiant-noir",
      },
      {
        title:
          "1er mars 1935. Senghor, Damas et Césaire fondent L'Étudiant noir",
        publisher: "Cairn.info — Ma dose quotidienne de littérature française",
        url: "https://shs.cairn.info/ma-dose-quotidienne-de-litterature-francaise--9782200633677-page-65?lang=fr",
      },
      {
        title: "À l'aube de la négritude",
        publisher: "Cairn.info — Léopold Sédar Senghor",
        url: "https://shs.cairn.info/leopold-sedar-senghor--9782262106454-page-137?lang=fr",
      },
      {
        title: "Léon-Gontran Damas ou la recherche de l'indicible",
        publisher: "Médiathèque nouvelle (Fédération Wallonie-Bruxelles)",
        url: "https://www.mediatheque.be/focus/leon-gontran-damas-ou-la-recherche-de-l-indicible/",
      },
    ],
    sourcesVerifiees: false,
  },
];

/**
 * Les sujets repérés dont l'histoire n'est pas encore documentée.
 *
 * Ils s'affichent, mais sans texte inventé. TRANSMISSION 001 est le premier
 * chapitre de la maison : son histoire est interne, elle n'a pas de source
 * externe à citer, et fabriquer une origine culturelle pour lui serait
 * exactement ce que le Journal existe pour ne pas faire.
 */
export const enPreparation: EnPreparation[] = [
  {
    collectionHandle: "transmission-001",
    title: "TRANSMISSION 001",
    why: "Le premier chapitre est né dans l'atelier, pas dans une archive. Son récit s'écrit ; il n'a pas de source extérieure à citer, et nous n'allons pas lui en inventer une.",
  },
];

/** L'article rattaché à un chapitre, s'il existe. */
export function articleForCollection(handle?: string | null) {
  if (!handle) return null;
  return articles.find((entry) => entry.collectionHandle === handle) ?? null;
}

export function articleBySlug(slug: string) {
  return articles.find((entry) => entry.slug === slug) ?? null;
}
