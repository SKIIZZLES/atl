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
 * Le numéro nu d'un identifiant Shopify.
 *
 * La Storefront API renvoie des identifiants globaux —
 * `gid://shopify/ProductVariant/16149226357061` — alors que le catalogue
 * Meta alimenté par le canal Facebook & Instagram indexe ses articles par
 * le numéro seul. Envoyer le `gid` entier produirait des événements
 * parfaitement valides qui ne correspondraient à aucun article : les
 * publicités catalogue ne partiraient jamais, sans la moindre erreur pour
 * le signaler.
 */
export function numeroShopify(gid: string): string {
  return gid.split("/").pop() ?? gid;
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
  variantId,
  titre,
  prix,
  devise,
  quantite = 1,
  categorie,
}: {
  /** L'identifiant global Shopify de la variante — pas le numéro. */
  variantId: string;
  titre: string;
  /** Le prix unitaire, tel que Shopify le renvoie : une chaîne. */
  prix: string;
  devise: string;
  quantite?: number;
  /** Le titre de la collection, quand la pièce en a une. */
  categorie?: string;
}): Record<string, unknown> {
  return {
    content_type: "product",
    content_ids: [numeroShopify(variantId)],
    content_name: titre,
    ...(categorie ? { content_category: categorie } : {}),
    contents: [{ id: numeroShopify(variantId), quantity: quantite }],
    // `Number` et non la chaîne : Meta rejette un `value` textuel. Et
    // arrondi, parce que la multiplication ne tombe pas juste en virgule
    // flottante : trois pièces à 29,99 € donnent 89.97000000000001, qui
    // partirait tel quel dans l'événement.
    value: Math.round(Number(prix) * quantite * 100) / 100,
    currency: devise,
  };
}
