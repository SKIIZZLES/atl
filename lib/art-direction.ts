/**
 * Les visuels éditoriaux de la page d'accueil, déclarés en un seul endroit.
 *
 * La direction artistique impose un sujet précis à chaque emplacement : une
 * femme seule au tignon noir et or dans le hero, un homme en hoodie capuche
 * relevée pour N.GRI.TUD, une silhouette dans la bannière finale. Les
 * disperser dans le JSX rendait chaque écart invisible ; ici la liste se lit
 * d'un coup et se compare à la maquette.
 *
 * Les visuels des trois cartes de collection ne sont PAS ici : ils viennent
 * du champ image de la collection dans l'admin Shopify, pour que la marque
 * puisse les changer sans toucher au code.
 *
 * Chaque entrée note le cadrage natif du fichier, parce que c'est lui qui
 * décide de l'emplacement : le hero est en 2,25:1, une image portrait y
 * perdrait la tête et les épaules.
 */
export type ArtDirectionSlot = {
  url: string;
  alt: string;
};

const FILES = "https://cdn.shopify.com/s/files/1/1088/9438/8549/files";

/**
 * Les trois vues du hero. Le repère « 01 / 03 » de la maquette ne pilotait
 * rien tant qu'il n'y avait qu'un visuel ; il indexe maintenant un vrai
 * défilé, un chapitre par vue.
 *
 * `portrait` est de la direction artistique, pas du redimensionnement : sur
 * un téléphone le cadre est proche du 1:2, et un fichier large y perdrait
 * son sujet. Là où le portrait manque, on retombe sur le cadrage large —
 * moins bon, mais jamais vide.
 */
export type HeroSlide = {
  handle: string;
  wide: ArtDirectionSlot;
  portrait?: ArtDirectionSlot;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    handle: "le-tignon",
    wide: {
      url: `${FILES}/Portrait_cinematographique_ultra_realiste_d_une_femme_noire_africaine_portant_un_immense_tignon_noir.png?v=1788820473`,
      alt: "Femme portant un immense tignon noir orné de motifs dorés, cadrage cinématographique en lumière chaude",
    },
    portrait: {
      url: `${FILES}/Portrait_de_profil_d_une_femme_noire_portant_un_tignon_noir_orne_de_motifs_dores_cheveux_naturels_l.png?v=1788820474`,
      alt: "Femme de profil portant un tignon noir orné de motifs dorés, cheveux naturels",
    },
  },
  {
    handle: "n-gri-tud",
    // Pas encore de cadrage vertical pour ce chapitre.
    wide: {
      url: `${FILES}/Homme_noir_portant_un_hoodie_noir_premium_avec_capuche_relevee_visage_partiellement_plonge_dans_l_o_84dcf57f-d1e5-4d1c-b0cf-ed3f48bf028b.png?v=1788820473`,
      alt: "Homme portant un hoodie noir premium, capuche relevée, visage partiellement dans l'ombre",
    },
  },
  {
    handle: "transmission-001",
    // Pas encore de cadrage vertical pour ce chapitre.
    wide: {
      url: `${FILES}/Homme_noir_africain_contemporain_portant_un_hoodie_noir_premium_oversize_vu_de_trois-quarts_dos_to_4caeb02f-ee86-405e-bf14-469d9fa985cc.png?v=1788820475`,
      alt: "Homme portant un hoodie noir premium oversize, vu de trois-quarts dos",
    },
  },
];

export const ART = {
  /**
   * Hero — femme seule, tignon noir et or, fond minéral, lumière chaude.
   * 1584 × 672, soit 2,36:1 : le cadre du hero est en 2,25:1, l'image y
   * entre presque sans perte.
   */
  hero: {
    url: `${FILES}/Portrait_cinematographique_ultra_realiste_d_une_femme_noire_africaine_portant_un_immense_tignon_noir.png?v=1788820473`,
    alt: "Femme portant un immense tignon noir orné de motifs dorés, cadrage cinématographique en lumière chaude",
  },

  /**
   * Hero, version mobile. Direction artistique, pas simple redimensionnement :
   * le fichier large fait 2,36:1, un écran de téléphone environ 1:2. En
   * `object-cover` il ne resterait qu'une tranche verticale de l'image, le
   * tignon coupé en haut. Ce portrait 768 × 1376 tient le cadre mobile.
   */
  heroPortrait: {
    url: `${FILES}/Portrait_de_profil_d_une_femme_noire_portant_un_tignon_noir_orne_de_motifs_dores_cheveux_naturels_l.png?v=1788820474`,
    alt: "Femme de profil portant un tignon noir orné de motifs dorés, cheveux naturels",
  },

  /**
   * Manifeste — même univers, cadrage paysage.
   * 1408 × 768, soit 1,83:1, recadré en 3:2 comme la maquette.
   */
  manifesto: {
    url: `${FILES}/Femme_noire_africaine_contemporaine_de_25_a_32_ans_peau_noire_profonde_avec_texture_naturelle_reali.png?v=1788820473`,
    alt: "Portrait d'une femme noire, peau à texture naturelle, en lumière basse",
  },

  /**
   * Bannière finale — silhouette de dos, capuche relevée, motifs dorés.
   * 1584 × 672 : le recadrage en 5:2 ne coupe presque rien.
   */
  finale: {
    url: `${FILES}/Homme_noir_vu_de_dos_portant_un_hoodie_noir_premium_avec_capuche_relevee_motifs_dores_complexes_cou_db73e812-b43d-407b-b88e-4573553c06fc.png?v=1788820474`,
    alt: "",
  },
} satisfies Record<string, ArtDirectionSlot>;
