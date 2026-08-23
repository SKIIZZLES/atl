import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getCollection } from "@/lib/shopify";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle).catch(() => undefined);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description || undefined,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await getCollection(handle, { first: 48 }).catch(
    () => undefined
  );

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-2xl uppercase tracking-widest text-white">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            {collection.description}
          </p>
        )}
      </div>

      {collection.products.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Aucun produit disponible dans cette collection pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {collection.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
