export default {
  /**
   * Les adresses changées gardent une porte ouverte.
   *
   * Le catalogue vivait sous `/search/<collection>` et `/product/<pièce>` :
   * une convention héritée du gabarit de départ, pas un choix. Les nouvelles
   * adresses sont celles de la spécification — et celles de Shopify, ce qui
   * évite de devoir traduire un lien à chaque fois qu'on en copie un depuis
   * l'admin.
   *
   * Permanent, parce que c'est un déménagement, pas un aiguillage : les
   * liens partagés et l'indexation suivent au lieu de se périmer.
   *
   * Les deux adresses anglaises sont là pour la même raison, dans l'autre
   * sens : la spécification les nomme, le site répond en français.
   */
  async redirects() {
    return [
      {
        source: "/product/:handle",
        destination: "/products/:handle",
        permanent: true,
      },
      {
        source: "/search/:handle",
        destination: "/collections/:handle",
        permanent: true,
      },
      // « Le shop » a longtemps vécu sous une adresse de collection, alors
      // qu'aucune collection Shopify ne porte ce `handle` : le catalogue
      // complet n'est pas un chapitre. Les onglets et les liens restés sur
      // l'ancienne adresse tombaient donc sur un 404. Ils rejoignent la page
      // qui existe vraiment.
      {
        source: "/collections/le-shop",
        destination: "/search",
        permanent: true,
      },
      { source: "/manifesto", destination: "/manifeste", permanent: true },
      { source: "/about", destination: "/a-propos", permanent: true },
      { source: "/stories", destination: "/manifeste", permanent: true },

      // Trois pièces gardaient l'adresse du fournisseur ou du gabarit, alors
      // que leur titre est français depuis longtemps : la casquette
      // s'appelait `finn-two-tone-nylon-cap`, le coupe-vent
      // `gold-floral-camouflage-windbreaker-jacket`, et le hoodie de
      // N.GRI.TUD portait encore `template34`. Ces adresses étaient
      // publiques, servies dans le plan du site, et lisibles par l'acheteur
      // dans sa barre d'adresse.
      //
      // Ces trois lignes doivent partir en production AVANT que les
      // `handle` ne changent chez Shopify. Le site lit le catalogue en
      // direct : à la seconde où un `handle` change, l'ancienne adresse ne
      // correspond plus à rien. Sans le renvoi déjà en place, elle tombe sur
      // un document d'erreur — qui, sous PPR, répond 200 et non 404, donc un
      // moteur l'enregistre comme une page valide et vide.
      {
        source: "/products/finn-two-tone-nylon-cap",
        destination: "/products/le-tignon-casquette-repere",
        permanent: true,
      },
      {
        source: "/products/gold-floral-camouflage-windbreaker-jacket",
        destination: "/products/le-tignon-coupe-vent-parure",
        permanent: true,
      },
      {
        source: "/products/template34",
        destination: "/products/n-gri-tud-hoodie-parole",
        permanent: true,
      },
      // Une quatrième, trouvée après coup : le bonnet n'apparaissait nulle
      // part sur le site, donc pas non plus dans la liste des adresses
      // anglaises. Il était actif, titré en français et proposé sur Google,
      // mais absent des canaux « Headless » que lit ce site — invendable ici.
      // Publié depuis, il rejoint le catalogue avec l'adresse du fournisseur.
      {
        source: "/products/embroidered-autumn-leaves-cuffed-beanie",
        destination: "/products/n-gri-tud-bonnet-lisere",
        permanent: true,
      },

      // Les adresses de l'ancienne boutique Shopify.
      //
      // Avant le passage en headless, `ondenoire.com` servait le thème
      // Shopify, dont les adresses suivent des formes imposées :
      // `/policies/...`, `/pages/...`, `/cart`, `/account/...`,
      // `/collections/all`. Google les a indexées à ce moment-là. Aucune
      // n'existe dans ce site — il n'y a de route ni pour `/cart`, ni pour
      // `/account`, ni pour `/policies` (les nôtres sont sous `/politiques`)
      // — donc elles tombent toutes en 404 franc.
      //
      // Search Console en compte dix. Les lignes ci-dessous couvrent les
      // formes connues ; la liste exacte reste à confirmer par l'export.
      // Un renvoi pour une adresse que personne ne demande ne coûte rien,
      // et il évite de perdre le crédit d'une page déjà indexée.

      // Les cinq politiques, de leur nom Shopify vers le nôtre.
      {
        source: "/policies/legal-notice",
        destination: "/politiques/mentions-legales",
        permanent: true,
      },
      {
        source: "/policies/terms-of-service",
        destination: "/politiques/conditions-generales",
        permanent: true,
      },
      {
        source: "/policies/shipping-policy",
        destination: "/politiques/livraison",
        permanent: true,
      },
      {
        source: "/policies/refund-policy",
        destination: "/politiques/remboursement",
        permanent: true,
      },
      {
        source: "/policies/privacy-policy",
        destination: "/politiques/confidentialite",
        permanent: true,
      },

      // Les pages Shopify vivent ici à la racine, sans le préfixe `/pages`.
      { source: "/pages/:handle", destination: "/:handle", permanent: true },

      // Le panier est un tiroir, pas une page : personne ne peut y arriver
      // par une adresse. Le catalogue est la destination utile.
      { source: "/cart", destination: "/search", permanent: true },

      // La collection fourre-tout de Shopify n'existe pas ici — le catalogue
      // complet a sa propre page.
      { source: "/collections/all", destination: "/search", permanent: true },

      // Les comptes clients ne sont pas ouverts. L'icône du header le dit
      // déjà ; ces adresses ramènent à l'accueil plutôt qu'au vide.
      { source: "/account", destination: "/", permanent: true },
      { source: "/account/:path*", destination: "/", permanent: true },
    ];
  },
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};
