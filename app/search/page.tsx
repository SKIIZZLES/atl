import { CategoryNav } from "components/category-nav";
import { SortSelect } from "components/collection/filter-panel";
import { ProductGrid } from "components/product-grid";
import { Breadcrumb } from "components/ui/breadcrumb";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Le shop",
  description: "Toutes les pièces Onde Noire.",
};

/**
 * Le catalogue complet, et la recherche.
 *
 * Il vivait dans une mise en page héritée du gabarit d'origine : une liste
 * de collections à gauche, un « Trier par » à droite, la grille au milieu.
 * Trois colonnes de chrome autour du produit. La page utilise désormais les
 * mêmes blocs que les collections — même en-tête, même grille, même tri —
 * pour qu'on la reconnaisse comme une page du site et non comme un écran de
 * recherche greffé.
 */
export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const searchValue =
    typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // `product_type` est le champ que la barre de catégories interroge : les
  // libellés doivent exister mot pour mot côté Shopify.
  const query = category ? `product_type:"${category}"` : searchValue;
  const products = await getProducts({ sortKey, reverse, query });

  return (
    <section className="shell below-header pb-24">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Le shop", href: category ? "/search" : undefined },
          ...(category ? [{ label: category }] : []),
        ]}
      />

      <Reveal className="mt-10">
        <SectionLabel rule>Toutes les pièces</SectionLabel>
        <EditorialTitle level="h1" className="mt-7">
          {category ?? "Le shop"}
        </EditorialTitle>
      </Reveal>

      <div className="mt-10">
        <CategoryNav active={category} />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <p className="type-label text-muted-foreground">
          {searchValue ? (
            <>
              {products.length === 0
                ? "Aucune pièce pour "
                : `${products.length} ${products.length > 1 ? "pièces" : "pièce"} pour `}
              «&nbsp;{searchValue}&nbsp;»
            </>
          ) : (
            <>
              {products.length} {products.length > 1 ? "pièces" : "pièce"}
            </>
          )}
        </p>
        <SortSelect />
      </div>

      <div className="mt-12">
        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <p className="type-body text-muted-foreground">
            Aucune pièce disponible pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}
