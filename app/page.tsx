import { Hero } from "components/hero";
import { ProductCard } from "components/product-card";
import { WaveDivider } from "components/wave-divider";
import { getCollectionProducts, getCollections } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

const dividerColors = ["var(--signal)", "var(--indigo)", "var(--ocre)"];

export const metadata = {
  description:
    "Onde Noire est une maison de streetwear culturel africain et diasporique. Culture × Design × Transmission.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const allCollections = await getCollections().catch(() => []);
  const visibleCollections = allCollections.filter(
    (collection) => !collection.handle.startsWith("hidden-homepage"),
  );

  const collections = (
    await Promise.all(
      visibleCollections.map(async (collection) => ({
        ...collection,
        products: await getCollectionProducts({
          collection: collection.handle,
        }),
      })),
    )
  ).filter((collection) => collection.products.length > 0);

  const featured = collections[0] ?? null;

  return (
    <>
      <Hero
        featuredCollection={
          featured ? { handle: featured.handle, title: featured.title } : null
        }
      />

      <section id="manifeste" className="bg-kraft text-kraft-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <p className="label-xs text-kraft-foreground/50 md:col-span-3">
              Manifeste
            </p>
            <div className="md:col-span-8 md:col-start-5">
              <p className="font-display text-2xl leading-[1.15] uppercase tracking-tight text-balance md:text-4xl">
                Ils ont transformé les vêtements en produits. Nous les voyons
                comme des archives.
              </p>
              <p className="mt-8 max-w-xl text-sm leading-relaxed text-pretty text-kraft-foreground/70">
                Onde Noire documente les cultures africaines et diasporiques
                par le vêtement. Chaque chapitre est une collecte : un motif,
                un geste, un mot conservés dans la coupe et la matière. Séries
                courtes, ateliers identifiés, pièces destinées à passer de
                main en main.
              </p>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider color="var(--signal)" className="bg-kraft" />

      {collections.map((collection, sectionIndex) => (
        <section key={collection.handle} id={collection.handle}>
          <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-3xl uppercase tracking-tight text-balance md:text-5xl">
                  {collection.title}
                </h2>
                {collection.description ? (
                  <p className="mt-5 text-sm leading-relaxed text-pretty text-muted-foreground">
                    {collection.description}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/search/${collection.handle}`}
                className="label-xs shrink-0 border-2 border-border px-4 py-3 text-muted-foreground transition-colors duration-300 hover:border-foreground hover:text-foreground"
              >
                Voir la collection
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
              {collection.products.slice(0, 8).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </div>
          <WaveDivider
            color={dividerColors[sectionIndex % dividerColors.length]}
          />
        </section>
      ))}

      <section id="archive" className="bg-indigo text-kraft">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:px-10 md:py-28">
          <div className="relative aspect-4/5 overflow-hidden border-2 border-kraft/20">
            <Image
              src="/editorial/archive.png"
              alt="Vêtements pliés sur une surface de béton dans la pénombre"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:pl-10">
            <p className="label-xs text-brass">Archive vivante</p>
            <h2 className="mt-6 font-display text-3xl uppercase tracking-tight text-balance md:text-5xl">
              Conserver,
              <br />
              porter,
              <br />
              transmettre
            </h2>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-pretty text-kraft/70">
              Chaque pièce quitte l&apos;atelier avec une fiche : origine du
              tissu, atelier, chapitre. Ce que vous portez est daté, situé,
              documenté — un objet destiné à durer plus longtemps que la
              saison qui l&apos;a vu naître.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
