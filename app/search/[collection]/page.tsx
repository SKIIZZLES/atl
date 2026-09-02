import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "components/product-card";
import { defaultSort, sorting } from "lib/constants";
import {
  OFFICIAL_COLLECTION_HANDLES,
  collectionStories,
} from "lib/collection-copy";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} — Onde Noire`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const collection = await getCollection(params.collection);
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  const officialIndex = OFFICIAL_COLLECTION_HANDLES.indexOf(
    params.collection as (typeof OFFICIAL_COLLECTION_HANDLES)[number],
  );
  const story = collectionStories[params.collection];

  return (
    <section>
      {collection ? (
        <div className="mb-14 max-w-2xl">
          {officialIndex !== -1 ? (
            <p className="label-xs text-signal">
              {String(officialIndex + 1).padStart(2, "0")}
            </p>
          ) : null}
          <h1 className="headline mt-3 text-4xl md:text-6xl">
            {collection.title}
          </h1>
          {story ? (
            <p className="editorial mt-6 text-lg italic leading-relaxed text-muted-foreground md:text-xl">
              {story}
            </p>
          ) : null}
          {collection.description ? (
            <p className="mt-5 text-sm leading-relaxed text-pretty text-muted-foreground">
              {collection.description}
            </p>
          ) : null}
        </div>
      ) : null}
      {products.length === 0 ? (
        <p className="label-xs text-muted-foreground">
          Aucune pièce disponible pour le moment
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
