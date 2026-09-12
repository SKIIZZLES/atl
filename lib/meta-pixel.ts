/**
 * Le pixel Meta : identifiants, typage, et l'appel d'événement.
 *
 * Ce fichier ne charge rien. Il décrit la fonction `fbq` que le script de
 * Meta installe sur `window`, et il expose un appel qui ne part que si ce
 * script est là. Le chargement, lui, est conditionné au consentement et vit
 * dans `components/analytics/meta-pixel.tsx`.
 */

/**
 * L'identifiant du pixel, lu à la compilation.
 *
 * `NEXT_PUBLIC_` parce qu'il est forcément public : il voyage dans chaque
 * requête que le navigateur envoie à Meta. Ce n'est pas un secret, c'est un
 * numéro de compte.
 *
 * Non défini, tout ce fichier devient inerte : aucun script chargé, aucun
 * événement envoyé, aucune erreur. C'est l'état d'une préproduction, et
 * c'est aussi l'état du site tant que la variable n'est pas posée dans
 * Vercel.
 */
export const PIXEL_META = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

type Fbq = {
  (commande: "init", pixelId: string): void;
  (
    commande: "track" | "trackCustom",
    evenement: string,
    parametres?: Record<string, unknown>,
    options?: { eventID: string },
  ): void;
  (commande: "consent", etat: "grant" | "revoke"): void;
  queue?: unknown[];
  loaded?: boolean;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/**
 * Le pays du catalogue Meta.
 *
 * Le canal Facebook & Instagram nomme ses articles d'après le marché
 * Shopify qui les publie. Une seule ligne à changer le jour où la boutique
 * vendrait depuis un autre marché — et ce jour-là, rien ne préviendrait :
 * les événements resteraient parfaitement valides, ils ne
 * correspondraient simplement plus à aucun article.
 */
const PAYS_CATALOGUE = "FR";

/** Le numéro nu d'un identifiant global Shopify. */
function numero(gid: string): string {
  return gid.split("/").pop() ?? gid;
}

/**
 * L'identifiant d'un article dans le catalogue Meta.
 *
 * Ce n'est ni le `gid` de Shopify, ni le numéro de la variante : le canal
 * Facebook & Instagram compose ses identifiants lui-même, en collant le
 * marché, le produit et la variante —
 * `shopify_FR_16149226357061_59199443140933`.
 *
 * Cette forme a été relevée dans le catalogue, pas devinée. La version
 * précédente envoyait le numéro de variante seul : des événements sans
 * défaut, que Meta acceptait, et qui ne désignaient aucun article. Les
 * publicités catalogue n'auraient jamais pu partir, et rien ne l'aurait
 * signalé — c'est exactement le genre de panne qui ne se voit que dans les
 * chiffres qui ne montent pas.
 */
export function identifiantCatalogueMeta(
  productId: string,
  variantId: string,
): string {
  return `shopify_${PAYS_CATALOGUE}_${numero(productId)}_${numero(variantId)}`;
}

/**
 * Un identifiant d'événement, pour plus tard.
 *
 * Le jour où l'API Conversions enverra les mêmes événements depuis le
 * serveur, Meta devra reconnaître qu'un achat vu deux fois — une fois par
 * le navigateur, une fois par le serveur — n'est qu'un seul achat. Il les
 * rapproche par cet identifiant. Le poser maintenant évite d'avoir à
 * repasser sur chaque appel ce jour-là.
 *
 * `randomUUID` n'existe pas partout (il exige un contexte sécurisé, et
 * manque sur quelques navigateurs anciens) : le repli suffit largement
 * puisque l'identifiant n'a qu'à être unique, pas imprévisible.
 */
function identifiantEvenement(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type Evenement = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout";

/**
 * Les événements survenus avant que `fbq` n'existe.
 *
 * Il y a deux files d'attente, et elles ne couvrent pas la même chose.
 * Celle de Meta, installée par l'amorce, retient les appels passés pendant
 * que `fbevents.js` se télécharge. Celle-ci retient les appels passés avant
 * même que l'amorce ne tourne — ce qui arrive à chaque fois qu'un visiteur
 * accepte le bandeau depuis une fiche produit : React exécute les effets
 * des enfants avant ceux des parents, si bien que le `ViewContent` de la
 * fiche part avant que le pixel du gabarit ne se soit installé.
 *
 * Sans cette file, cet événement-là serait perdu en silence. Et c'est
 * précisément celui qui compte : la vue de la pièce qu'on regardait au
 * moment d'accepter.
 */
const attente: Array<[Evenement, Record<string, unknown> | undefined]> = [];

/**
 * Envoie un événement standard au pixel.
 *
 * Sans effet tant que le visiteur n'a pas accepté : le consentement décide
 * du chargement du pixel, et l'absence de pixel suffit à rendre cet appel
 * inerte. Les sites d'appel n'ont donc aucune condition à porter — la
 * décision est prise ici, et à un seul endroit.
 */
export function suivreMeta(
  evenement: Evenement,
  parametres?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;

  if (!window.fbq) {
    // Borne volontairement basse : au-delà de quelques événements avant
    // chargement, c'est que le pixel ne viendra pas — refus, blocage par
    // une extension, réseau coupé. Rien ne sert de tenir la liste.
    if (attente.length < 10) attente.push([evenement, parametres]);
    return;
  }

  window.fbq("track", evenement, parametres, {
    eventID: identifiantEvenement(),
  });
}

/**
 * Rejoue les événements mis de côté. Appelé une seule fois, juste après
 * `init`, par le composant qui charge le pixel.
 */
export function viderAttenteMeta() {
  if (typeof window === "undefined" || !window.fbq) return;
  while (attente.length) {
    const entree = attente.shift();
    if (!entree) break;
    window.fbq("track", entree[0], entree[1], {
      eventID: identifiantEvenement(),
    });
  }
}

/**
 * Les paramètres communs à `ViewContent`, `AddToCart` et
 * `InitiateCheckout`.
 *
 * Meta attend partout les mêmes clés, et une divergence entre deux appels
 * se paie cher : un `value` manquant sur `AddToCart` rend le retour sur
 * dépense publicitaire incalculable, un `currency` absent fait rejeter
 * l'événement en silence. Les trois sites d'appel passent donc par ici.
 */
export function contenuMeta({
  productId,
  variantId,
  titre,
  prix,
  devise,
  quantite = 1,
  categorie,
}: {
  /** L'identifiant global Shopify du produit. */
  productId: string;
  /** L'identifiant global Shopify de la variante. */
  variantId: string;
  titre: string;
  /** Le prix unitaire, tel que Shopify le renvoie : une chaîne. */
  prix: string;
  devise: string;
  quantite?: number;
  /** Le titre de la collection, quand la pièce en a une. */
  categorie?: string;
}): Record<string, unknown> {
  const article = identifiantCatalogueMeta(productId, variantId);

  return {
    content_type: "product",
    content_ids: [article],
    content_name: titre,
    ...(categorie ? { content_category: categorie } : {}),
    contents: [{ id: article, quantity: quantite }],
    // `Number` et non la chaîne : Meta rejette un `value` textuel. Et
    // arrondi, parce que la multiplication ne tombe pas juste en virgule
    // flottante : trois pièces à 29,99 € donnent 89.97000000000001, qui
    // partirait tel quel dans l'événement.
    value: Math.round(Number(prix) * quantite * 100) / 100,
    currency: devise,
  };
}
