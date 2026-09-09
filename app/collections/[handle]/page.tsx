import { CollectionHero } from "components/collection/collection-hero";
import {
  FilterDrawer,
  FilterPanel,
  SortSelect,
} from "components/collection/filter-panel";
import { ProductGrid } from "components/product-grid";
import { CTASection } from "components/sections/cta-section";
import { EditorialSection } from "components/sections/editorial-section";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { ART, HERO_SLIDES, slotFromImage } from "lib/art-direction";
import {
  applyFilters,
  buildFacets,
  parseSelection,
  priceBands,
} from "lib/collection-filters";
import {
  collectionPages,
  collectionStories,
  isOfficialHandle,
} from "lib/collection-copy";
import { defaultSort, sorting } from "lib/constants";
import { getCollection, getCollectionProducts } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { handle } = await props.params;
  const collection = await getCollection(handle);
  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} — Onde Noire`,
  };
}

export default async function CollectionPage(props: PageProps) {
  const { handle } = await props.params;
  const searchParams = (await props.searchParams) ?? {};

  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts({ collection: handle, sortKey, reverse }),
  ]);

  if (!collection) return notFound();

  const selection = parseSelection(searchParams);
  const facets = buildFacets(products);
  const bands = priceBands(products);
  const visible = applyFilters(products, selection);

  // Le contenu éditorial n'existe que pour les trois chapitres officiels.
  // Une collection technique ou saisonnière obtient le même gabarit, sans
  // les blocs de récit — plutôt qu'un texte inventé pour remplir.
  const page = isOfficialHandle(handle) ? collectionPages[handle] : null;
  const slide = HERO_SLIDES.find((entry) => entry.handle === handle);

  return (
    <>
      <CollectionHero
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Collections", href: "/collections" },
          { label: collection.title },
        ]}
        title={collection.title}
        signature={page?.signature ?? []}
        intro={page?.intro ?? collection.description ?? undefined}
        image={slide?.wide ?? slotFromImage(collection.image, collection.title)}
      />

      <section id="pieces" className="shell section-y scroll-mt-20">
        <div className="lg:flex lg:gap-14">
          {/* Colonne de filtres en desktop. Elle suit le défilement : une
              grille de vingt pièces dépasse la hauteur d'écran, et
              remonter pour changer une taille est une punition. */}
          {facets.length > 0 ? (
            <aside className="hidden w-56 shrink-0 lg:block">
              <div className="sticky top-28">
                <FilterPanel
                  facets={facets}
                  selection={selection}
                  bands={bands}
                />
              </div>
            </aside>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <p className="type-label text-muted-foreground">
                {visible.length} {visible.length > 1 ? "pièces" : "pièce"}
              </p>

              <div className="flex items-center gap-3">
                <div className="lg:hidden">
                  <FilterDrawer
                    facets={facets}
                    selection={selection}
                    bands={bands}
                    count={visible.length}
                  />
                </div>
                <SortSelect />
              </div>
            </div>

            {visible.length > 0 ? (
              <ProductGrid products={visible} columns={3} />
            ) : (
              <p className="type-body text-muted-foreground">
                Aucune pièce ne correspond à ces filtres.
              </p>
            )}
          </div>
        </div>
      </section>

      {page ? (
        <>
          <EditorialSection
            tone="soft"
            label={page.editorial.label}
            title={page.editorial.title}
            body={page.editorial.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 first:mt-0">
                {paragraph}
              </p>
            ))}
            cta={page.editorial.cta}
            image={
              slotFromImage(collection.image, collection.title) ?? undefined
            }
          />

          {page.statement ? (
            <section className="bg-background">
              <div className="shell section-y">
                <Reveal className="mx-auto max-w-4xl text-center">
                  <SectionLabel className="text-foreground">
                    {collection.title}
                  </SectionLabel>
                  <EditorialTitle level="h2" className="mt-8 text-balance">
                    {page.statement}
                  </EditorialTitle>
                </Reveal>
              </div>
            </section>
          ) : null}

          <CTASection
            label="Onde Noire®"
            title={page.finale.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            cta={page.finale.cta}
            image={ART.finale}
          />
        </>
      ) : collectionStories[handle] ? (
        <EditorialSection
          tone="soft"
          label={collection.title}
          title={collectionStories[handle]!}
          body={null}
          image={slotFromImage(collection.image, collection.title) ?? undefined}
        />
      ) : null}
    </>
  );
}
