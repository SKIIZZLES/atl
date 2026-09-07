import { CategoryNav } from "components/category-nav";
import { Hero } from "components/hero";
import { NewsletterForm } from "components/newsletter-form";
import { ProductCard } from "components/product-card";
import {
  OFFICIAL_COLLECTION_HANDLES,
  collectionKickers,
  collectionTaglines,
} from "lib/collection-copy";
import {
  getCollectionProducts,
  getCollections,
  getProducts,
} from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  description:
    "We don't wear history. We continue it. Onde Noire, culture in motion — Afrique, Caraïbes, Europe, Amériques.",
  openGraph: {
    type: "website",
  },
};

/**
 * Les mots posés dans la marge du bloc mission et de la bannière de fin.
 * Ce ne sont pas des liens : c'est le champ lexical de la marque, une
 * signature typographique. En faire une navigation promettrait des pages
 * qui n'existent pas.
 */
const MISSION_FIELD = ["Culture", "Héritage", "Identité", "Création", "Demain"];
const JOIN_FIELD = [
  "Vêtements",
  "Articles",
  "Archives",
  "Communauté",
  "Newsletter",
];

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
          products,
          kicker: collectionKickers[handle] ?? "",
          tagline: collectionTaglines[handle] ?? "",
          image: collection.image ?? products[0]?.featuredImage,
        };
      }),
    )
  ).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  // La collection mise en avant sur la bande claire est la première publiée,
  // pas une constante : si elle se vide un jour, la bande suit au lieu de
  // pointer vers une page sans produit.
  const featured = officialCollections[0];

  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  return (
    <>
      <Hero />

      {officialCollections.length > 0 ? (
        <section id="collections" className="scroll-mt-20">
          <h2 className="sr-only">Collections</h2>
          {/* Les trois chapitres sur une seule rangée, texte posé sur l'image
              plutôt qu'en dessous : les visuels ont leur sujet à droite, la
              moitié gauche est du décor sur lequel on peut écrire. */}
          <ul className="grid gap-px border-y border-border bg-border md:grid-cols-3">
            {officialCollections.map((entry, index) => (
              <li key={entry.handle} className="bg-background">
                <Link
                  href={`/search/${entry.handle}`}
                  className="group relative flex aspect-3/2 flex-col justify-between overflow-hidden p-6 md:p-8"
                >
                  {entry.image ? (
                    <Image
                      src={entry.image.url}
                      alt={entry.image.altText || entry.collection.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-r from-brun via-brun/70 to-brun/10" />

                  <p className="label-xs relative inline-flex self-start border-b border-signal pb-1 text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="relative">
                    <h3 className="headline text-2xl text-brun-foreground md:text-3xl">
                      {entry.collection.title}
                    </h3>
                    <p className="label-xs mt-2 text-brun-foreground/70">
                      {entry.kicker}
                    </p>
                    <span className="label-xs mt-6 inline-flex items-center gap-3 border-b border-signal/50 pb-2 text-signal transition-colors duration-300 group-hover:border-signal">
                      Découvrir →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="manifeste" className="bg-terre text-terre-foreground">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-[1fr_minmax(0,24rem)_12rem] md:items-center md:gap-14 md:px-10 md:py-28">
          <div>
            <p className="label-xs text-terre-foreground/60">Notre mission</p>
            <h2 className="editorial mt-8 text-4xl leading-[1.1] md:text-5xl">
              Transformer
              <br />
              la mémoire
              <br />
              en mouvement.
            </h2>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-terre-foreground/75">
              Onde Noire est une maison de création contemporaine qui puise dans
              les racines africaines pour façonner un avenir audacieux. À
              travers le vêtement, nous transmettons des histoires, des valeurs
              et une identité en constante évolution.
            </p>
            <Link
              href="/stories"
              className="label-xs mt-10 inline-flex items-center gap-3 border-b border-terre-foreground/50 pb-2 text-terre-foreground transition-colors duration-300 hover:border-terre-foreground"
            >
              Lire le manifeste →
            </Link>
          </div>

          <div className="relative aspect-4/5 overflow-hidden">
            <Image
              src="/editorial/archive.png"
              alt="Vêtements pliés sur une surface de béton dans la pénombre"
              fill
              sizes="(min-width: 768px) 24rem, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <ul className="label-xs space-y-2 text-terre-foreground/55">
              {MISSION_FIELD.map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
            <p className="label-xs mt-8 border-t border-terre-foreground/25 pt-8 leading-loose text-terre-foreground/70">
              Certaines histoires se racontent.
              <br />
              D&apos;autres se portent.
            </p>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="bg-craie text-craie-foreground">
          <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-16 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14 md:px-10 md:py-20">
            <div>
              <p className="label-xs text-craie-foreground/60">
                Collection en cours
              </p>
              <h2 className="editorial mt-5 text-4xl md:text-5xl">
                {featured.collection.title}
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-craie-foreground/75">
                {featured.tagline}
              </p>
              <Link
                href={`/search/${featured.handle}`}
                className="label-xs mt-8 inline-flex items-center gap-3 bg-craie-foreground px-6 py-4 text-craie transition-opacity duration-300 hover:opacity-80"
              >
                Voir la collection →
              </Link>
            </div>

            {/* Défilement horizontal plutôt qu'un repli en grille : la rangée
                de pièces est une planche contact, elle perd son sens empilée. */}
            <ul className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:px-0">
              {featured.products.slice(0, 5).map((product) => (
                <li
                  key={product.id}
                  className="w-40 shrink-0 snap-start md:w-auto md:flex-1"
                >
                  <Link
                    href={`/product/${product.handle}`}
                    className="group block"
                    aria-label={product.title}
                  >
                    <div className="relative aspect-4/5 overflow-hidden bg-craie-foreground/5">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          sizes="(min-width: 768px) 16vw, 40vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

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

      <section id="rejoindre" className="relative overflow-hidden bg-brun">
        <Image
          src="/editorial/hero.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-brun via-brun/80 to-brun/20" />

        <div className="relative mx-auto flex max-w-[1600px] flex-col gap-12 px-5 py-20 text-brun-foreground md:flex-row md:items-center md:justify-between md:px-10 md:py-28">
          <div className="max-w-xl">
            <p className="label-xs text-brun-foreground/60">Onde Noire®</p>
            <h2 className="editorial mt-6 text-4xl leading-[1.1] md:text-5xl">
              La culture ne disparaît pas.
              <br />
              Elle se déplace.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-brun-foreground/70">
              Nouveaux drops. Histoires. Archives. Signaux.
            </p>
            {domain ? (
              <div className="mt-8">
                <NewsletterForm domain={domain} />
              </div>
            ) : null}
          </div>

          <ul
            aria-hidden
            className="label-xs hidden shrink-0 space-y-2 text-right text-brun-foreground/55 md:block"
          >
            {JOIN_FIELD.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
