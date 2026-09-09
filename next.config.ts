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
