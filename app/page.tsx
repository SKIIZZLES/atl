import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getCollection, isShopifyConfigured } from "@/lib/shopify";
import type { Collection } from "@/lib/shopify/types";

async function safeGetCollection(handle: string): Promise<Collection | undefined> {
  try {
    return await getCollection(handle, { first: 4 });
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const [transmission, ngritud] = isShopifyConfigured
    ? await Promise.all([
        safeGetCollection("transmission-001"),
        safeGetCollection("n-gri-tud"),
      ])
    : [undefined, undefined];

  return (
    <div>
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
          Culture × Design × Transmission
        </p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          ONDE NOIRE
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-400">
          Ils ont transformé les vêtements en produits. Nous les voyons comme
          des archives.
        </p>
        <Link
          href="/collections/transmission-001"
          className="mt-10 border border-white px-8 py-3 text-xs uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          Découvrir Transmission 001
        </Link>
      </section>

      {!isShopifyConfigured && (
        <section className="mx-auto max-w-2xl px-6 pb-24 text-center text-sm text-neutral-500">
          <p>
            Le catalogue Shopify n&apos;est pas encore connecté. Définissez
            <code className="mx-1 rounded bg-neutral-900 px-1.5 py-0.5">
              SHOPIFY_STORE_DOMAIN
            </code>
            et
            <code className="mx-1 rounded bg-neutral-900 px-1.5 py-0.5">
              SHOPIFY_STOREFRONT_ACCESS_TOKEN
            </code>
            pour afficher les produits.
          </p>
        </section>
      )}

      {transmission && transmission.products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <div className="mb-10 flex items-baseline justify-between">
            <h2 className="text-lg uppercase tracking-widest text-white">
              {transmission.title}
            </h2>
            <Link
              href={`/collections/${transmission.handle}`}
              className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
            >
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {transmission.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {ngritud && ngritud.products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
          <div className="mb-10 flex items-baseline justify-between">
            <h2 className="text-lg uppercase tracking-widest text-white">
              {ngritud.title}
            </h2>
            <Link
              href={`/collections/${ngritud.handle}`}
              className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
            >
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {ngritud.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
