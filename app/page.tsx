import { Hero } from "components/hero";
import { NewsletterForm } from "components/newsletter-form";
import { ProductCard } from "components/product-card";
import {
  OFFICIAL_COLLECTION_HANDLES,
  collectionTaglines,
} from "lib/collection-copy";
import { getCollectionProducts, getCollections, getProducts } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  description:
    "We don't wear history. We continue it. Onde Noire, culture in motion — Afrique, Caraïbes, Europe, Amériques.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const [allCollections, newArrivals] = await Promise.all([
    getCollections().catch(() => []),
    getProducts({ sortKey: "CREATED_AT", reverse: true }).catch(() => []),
  ]);

  const collectionsByHandle = new Map(
    allCollections.map((collection) => [collection.handle, collection]),
  );

  const officialCollections = (
    await Promise.all(
      OFFICIAL_COLLECTION_HANDLES.map(async (handle) => {
        const collection = collectionsByHandle.get(handle);
        if (!collection) return null;
        const products = await getCollectionProducts({
          collection: handle,
        }).catch(() => []);
        if (products.length === 0) return null;
        return {
          handle,
          collection,
          tagline: collectionTaglines[handle] ?? "",
          image: products[0]?.featuredImage,
        };
      }),
    )
  ).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  return (
    <>
      <Hero />

      {newArrivals.length > 0 ? (
        <section id="shop" className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-xs text-signal">Current transmission</p>
              <h2 className="headline mt-3 text-4xl md:text-6xl">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/search"
              className="label-xs shrink-0 border border-border px-4 py-3 text-muted-foreground transition-colors duration-300 hover:border-foreground hover:text-foreground"
            >
              Voir tout le shop
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6 md:gap-y-16">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="manifeste" className="bg-terre text-terre-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <p className="label-xs text-terre-foreground/60">Manifeste</p>
          <p className="headline mt-8 max-w-4xl text-4xl md:text-6xl">
            Onde Noire n&apos;est pas une esthétique.
            <br />
            C&apos;est une transmission.
          </p>
          <p className="editorial mt-10 max-w-2xl text-xl italic leading-relaxed text-terre-foreground/85 md:text-2xl">
            Afrique. Caraïbes. Europe. Amériques.
            <br />
            Des mémoires différentes. Une histoire qui continue de circuler.
          </p>
          <Link
            href="/#story"
            className="label-xs mt-10 inline-flex items-center gap-3 border-b border-terre-foreground/50 pb-2 text-terre-foreground transition-colors duration-300 hover:border-terre-foreground"
          >
            Discover the story
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {officialCollections.length > 0 ? (
        <section
          id="collections"
          className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28"
        >
          <p className="label-xs text-muted-foreground">Les collections</p>
          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {officialCollections.map((entry, index) => (
              <Link
                key={entry.handle}
                href={`/search/${entry.handle}`}
                className="group relative flex aspect-[3/4] flex-col justify-end bg-background p-6"
              >
                {entry.image ? (
                  <Image
                    src={entry.image.url}
                    alt={entry.image.altText || entry.collection.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-t from-brun/90 via-brun/20 to-transparent" />

                <div className="relative">
                  <span className="label-xs text-brun-foreground/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="headline mt-2 text-3xl text-brun-foreground">
                    {entry.collection.title}
                  </h3>
                  <p className="editorial mt-3 text-sm italic leading-relaxed text-brun-foreground/85">
                    {entry.tagline}
                  </p>
                  <span className="label-xs mt-4 inline-flex items-center gap-2 text-brun-foreground">
                    Discover
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section id="story" className="border-t border-border">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:px-10 md:py-28">
          <div>
            <p className="label-xs text-signal">Beyond the garment</p>
            <h2 className="headline mt-6 text-4xl md:text-5xl">
              Nous ne portons pas l&apos;histoire.
              <br />
              Nous la continuons.
            </h2>
            <p className="editorial mt-8 max-w-md text-lg italic leading-relaxed text-muted-foreground">
              Chaque chapitre est une collecte : un motif, un geste, un mot
              conservés dans la coupe et la matière. Ce que vous portez est
              daté, situé, documenté — une pièce pensée pour durer plus
              longtemps que la saison qui l&apos;a vu naître.
            </p>
          </div>
          <div className="relative aspect-4/5 overflow-hidden">
            <Image
              src="/editorial/archive.png"
              alt="Vêtements pliés sur une surface de béton dans la pénombre"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-brun text-brun-foreground">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-20 md:flex-row md:items-center md:justify-between md:px-10 md:py-24">
          <div>
            <h2 className="headline text-3xl md:text-4xl">
              Stay in the transmission
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brun-foreground/70">
              Nouveaux drops. Histoires. Archives. Signaux.
            </p>
          </div>
          {domain ? <NewsletterForm domain={domain} /> : null}
        </div>
      </section>
    </>
  );
}
