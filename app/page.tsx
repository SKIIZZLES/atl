import { CategoryNav } from "components/category-nav";
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
        <section
          id="shop"
          className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-xs text-signal">Dernières pièces</p>
              <h2 className="headline mt-3 text-4xl md:text-6xl">Nouveautés</h2>
            </div>
            <Link
              href="/search"
              className="label-xs shrink-0 self-start border border-foreground px-5 py-3 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background md:self-auto"
            >
              Voir tout le shop →
            </Link>
          </div>

          <div className="mt-8">
            <CategoryNav />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-6 md:gap-y-16">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="manifeste" className="bg-terre text-terre-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
          <p className="label-xs text-terre-foreground/60">Manifeste</p>
          <p className="headline mt-8 max-w-4xl text-3xl md:text-6xl">
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
            href="/stories"
            className="label-xs mt-10 inline-flex items-center gap-3 border-b border-terre-foreground/50 pb-2 text-terre-foreground transition-colors duration-300 hover:border-terre-foreground"
          >
            Découvrir l&apos;histoire →
          </Link>
        </div>
      </section>

      {officialCollections.length > 0 ? (
        <section id="collections">
          {officialCollections.map((entry, index) => (
            <Link
              key={entry.handle}
              href={`/search/${entry.handle}`}
              className="group relative flex h-[75svh] min-h-[520px] items-end overflow-hidden md:h-[85svh]"
            >
              {entry.image ? (
                <Image
                  src={entry.image.url}
                  alt={entry.image.altText || entry.collection.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                />
              ) : null}
              <div className="absolute inset-0 bg-linear-to-t from-brun via-brun/45 to-brun/10" />

              <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 md:px-10 md:pb-20">
                <p className="label-xs text-brun-foreground/70">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="headline mt-3 text-5xl text-brun-foreground md:text-8xl">
                  {entry.collection.title}
                </h3>
                <p className="editorial mt-5 max-w-md text-lg italic leading-relaxed text-brun-foreground/85 md:text-xl">
                  {entry.tagline}
                </p>
                <span className="label-xs mt-8 inline-flex items-center gap-3 border border-brun-foreground px-5 py-3 text-brun-foreground transition-colors duration-300 group-hover:bg-brun-foreground group-hover:text-brun">
                  Découvrir →
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : null}

      <section id="story">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:px-10 md:py-28">
          <div>
            <h2 className="headline text-4xl md:text-6xl">
              Au-delà du vêtement.
            </h2>
            <p className="editorial mt-8 max-w-md text-xl italic leading-relaxed md:text-2xl">
              Nous ne portons pas l&apos;histoire. Nous la continuons.
            </p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Chaque collection est un chapitre : un motif, un geste, un mot que
              la coupe et la matière gardent en mémoire. Ce que vous portez est
              daté, situé, documenté — une pièce pensée pour durer plus
              longtemps que la saison qui l&apos;a vue naître.
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
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-24">
          <div>
            <h2 className="headline text-3xl md:text-4xl">
              Restez dans la transmission.
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
