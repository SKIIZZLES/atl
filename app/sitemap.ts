import { articles } from "lib/journal";
import { getCollections, getPages, getProducts } from "lib/shopify";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

/**
 * Les pages écrites par la maison.
 *
 * Le plan du site ne listait que l'accueil et ce qui vient de Shopify —
 * collections, produits, pages. Autrement dit : tout ce que le catalogue
 * fabrique, et rien de ce que la maison écrit. Le manifeste, « À propos »
 * et le Journal, qui sont précisément les pages au texte original, n'y
 * figuraient pas. Un moteur les trouve quand même en suivant les liens,
 * mais plus tard, et sans savoir qu'elles comptent.
 *
 * Le Journal est repris de `lib/journal.ts` plutôt que recopié : une liste
 * d'adresses écrite à la main se périme au premier article ajouté.
 */
const EDITORIAL = [
  "/manifeste",
  "/a-propos",
  "/journal",
  "/collections",
  "/search",
  ...articles.map((article) => `/journal/${article.slug}`),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = ["", ...EDITORIAL].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // `frontpage` est la collection par défaut de Shopify. La barre de
  // navigation l'écarte déjà — elle n'est le chapitre de rien et double le
  // catalogue. La proposer au moteur alors qu'aucun lien du site n'y mène
  // revenait à lui offrir une page en double, ce qui divise le crédit entre
  // deux adresses au lieu de le concentrer sur une.
  const collectionsPromise = getCollections().then((collections) =>
    collections
      .filter((collection) => collection.handle !== "frontpage")
      .map((collection) => ({
        url: `${baseUrl}${collection.path}`,
        lastModified: collection.updatedAt,
      })),
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: product.updatedAt,
    })),
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt,
    })),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
