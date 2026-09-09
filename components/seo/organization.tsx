import { LOGO } from "lib/art-direction";
import { baseUrl } from "lib/utils";

/**
 * Qui parle, en langage de moteur de recherche.
 *
 * « Onde noire » est d'abord, pour Google, une requête de four à micro-ondes
 * de couleur noire : la page de résultats est occupée par Conforama, Darty
 * et Boulanger. Un site qui ne dit rien de lui-même laisse le moteur deviner
 * — et il devine l'électroménager, parce que c'est ce que les autres pages
 * lui ont appris.
 *
 * Ce bloc dit trois choses que rien d'autre ne dit :
 *
 *   `Organization` — Onde Noire est une marque, pas un produit. Le logo, les
 *   comptes sociaux et le pays donnent au moteur de quoi rattacher le site à
 *   une entité, ce qui est la condition d'un panneau de connaissance.
 *
 *   `sameAs` — les deux comptes du fondateur, repris du pied de page. Ce
 *   sont eux qui prouvent que la marque existe ailleurs que sur ce domaine ;
 *   c'est le signal le plus fort dont on dispose sans presse ni backlinks.
 *
 *   `WebSite` — le nom du site et sa langue, pour que le titre affiché en
 *   résultat soit « Onde Noire » et non le contenu de la balise `<title>`
 *   recomposé par le moteur.
 *
 * Rien ici n'est inventé : le nom, les adresses sociales et le logo sont
 * ceux déjà présents dans le projet. Il manque volontairement l'adresse
 * postale et le numéro SIREN — ils renforceraient encore l'entité, mais ce
 * sont des données que la maison doit choisir de publier.
 */

const SOCIALS = [
  "https://instagram.com/onde.noire",
  "https://tiktok.com/@le88emeecho",
];

export function OrganizationJsonLd() {
  const name = process.env.SITE_NAME || "Onde Noire";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name,
    alternateName: "Onde Noire®",
    url: baseUrl,
    logo: LOGO.lockup.url,
    image: LOGO.lockup.url,
    description:
      "Maison de création indépendante. Onde Noire part de références culturelles africaines et diasporiques — une loi, un journal, une archive — et en fait des vêtements et des récits contemporains.",
    slogan: "Nous ne portons pas l'histoire. Nous la continuons.",
    foundingDate: "2026-07",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bourg-en-Bresse",
      addressRegion: "Ain",
      addressCountry: "FR",
    },
    sameAs: SOCIALS,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name,
    inLanguage: "fr-FR",
    publisher: { "@id": `${baseUrl}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website]),
      }}
    />
  );
}
