import { CategoryNav } from "components/category-nav";
import { ProductCard } from "components/product-card";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Shop",
  description: "Toutes les pièces Onde Noire.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const {
    sort,
    q: searchValue,
    category,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const query = category ? `product_type:"${category}"` : searchValue;
  const products = await getProducts({ sortKey, reverse, query });
  const resultsText = products.length > 1 ? "pièces" : "pièce";

  return (
    <>
      <div className="mb-10">
        <h1 className="headline text-4xl md:text-5xl">
          {category ?? "Le shop"}
        </h1>
        <div className="mt-8">
          <CategoryNav active={category} />
        </div>
      </div>

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
      ) : (
        <p className="label-xs text-muted-foreground">
          Aucune pièce disponible pour le moment
        </p>
      )}
    </>
  );
}
