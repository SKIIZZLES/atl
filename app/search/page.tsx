import { ProductCard } from "components/product-card";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Recherche",
  description: "Rechercher des pièces dans le catalogue Onde Noire.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "résultats" : "résultat";

  return (
    <>
      {searchValue ? (
        <p className="label-xs mb-8 text-muted-foreground">
          {products.length === 0
            ? "Aucune pièce ne correspond à "
            : `${products.length} ${resultsText} pour `}
          &quot;{searchValue}&quot;
        </p>
      ) : null}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </>
  );
}
