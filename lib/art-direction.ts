/**
 * Les visuels éditoriaux de la page d'accueil, déclarés en un seul endroit.
 *
 * La direction artistique impose un sujet précis à chaque emplacement : une
 * femme seule au tignon noir et or dans le hero, un homme en hoodie capuche
 * relevée pour N.GRI.TUD, un paysage sombre pour la bannière finale. Les
 * disperser dans le JSX rendait chaque écart invisible ; ici la liste se lit
 * d'un coup et se compare à la maquette.
 *
 * `url` pointe vers Shopify Files, seul hébergement dont dispose le projet
 * pour une image qui n'est pas dans `public/`. Les entrées marquées
 * PROVISOIRE attendent la photographie définitive : elles tiennent la
 * composition sans être le sujet demandé.
 */
export type ArtDirectionSlot = {
  url: string;
  alt: string;
  /** Vrai tant que le visuel n'est pas celui que la direction demande. */
  provisional?: boolean;
};

const FILES = "https://cdn.shopify.com/s/files/1/1088/9438/8549/files";

/** Femme contemporaine, tignon noir couvert de motifs graphiques dorés. */
const TIGNON = `${FILES}/Femme_noire_africaine_contemporaine_portant_un_tignon_noir_volumineux_couvert_de_motifs_graphiques_d.png?v=1788816920`;

/** Homme de dos, hoodie noir premium, capuche relevée, motifs dorés. */
const HOODIE = `${FILES}/Homme_noir_vu_de_dos_portant_un_hoodie_noir_premium_avec_capuche_relevee_motifs_dores_complexes_cou.png?v=1788816965`;

/** Silhouette Onde Noire, cadrage vertical. */
const SILHOUETTE = `${FILES}/rn-image_picker_lib_temp_82da46f1-562d-4591-b36e-a0b498e22f84.png?v=1788817051`;

export const ART = {
  /**
   * Hero — femme seule, tignon noir et or, fond minéral, lumière chaude.
   * PROVISOIRE : le visuel définitif est un cadrage large 2,33:1 avec le
   * sujet à droite. Celui-ci est un portrait 848×1264, donc recadré serré.
   */
  hero: {
    url: TIGNON,
    alt: "Femme portant un tignon noir couvert de motifs graphiques dorés, devant un mur minéral en lumière rasante",
    provisional: true,
  },

  /** Manifeste — même sujet, cadrage plus large dans la maquette. */
  manifesto: {
    url: SILHOUETTE,
    alt: "Silhouette portant une pièce Onde Noire, cadrage vertical en lumière basse",
    provisional: true,
  },

  /** Bannière finale — paysage sombre, silhouette au premier plan. */
  finale: {
    url: HOODIE,
    alt: "",
    provisional: true,
  },
} satisfies Record<string, ArtDirectionSlot>;
