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
