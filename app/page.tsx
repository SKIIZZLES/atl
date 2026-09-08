import { Hero } from "components/hero";
import { NewsletterForm } from "components/newsletter-form";
import { ART } from "lib/art-direction";
import {
  OFFICIAL_COLLECTION_HANDLES,
  collectionKickers,
  collectionTaglines,
} from "lib/collection-copy";
import { getCollectionProducts, getCollections } from "lib/shopify";
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
 * Les mots posés dans la marge du manifeste et de la bannière finale. Ce ne
 * sont pas des liens : c'est le champ lexical de la marque. En faire une
 * navigation promettrait des pages qui n'existent pas.
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
  const allCollections = await getCollections().catch(() => []);

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

  // La collection mise en avant sur la bande ivoire est la première publiée,
  // pas une constante : si elle se vide un jour, la bande suit au lieu de
  // pointer vers une page sans produit.
  const featured = officialCollections[0];

  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  return (
    <>
      {/* Les libellés viennent de Shopify : renommer une collection dans
          l'admin met le défilé à jour, sans toucher au code. */}
      <Hero
        labels={Object.fromEntries(
          officialCollections.map((entry) => [
            entry.handle,
            entry.collection.title,
          ]),
        )}
      />

      {officialCollections.length > 0 ? (
        <section id="collections" className="scroll-mt-20">
          <h2 className="sr-only">Collections</h2>
          {/* Trois cartes compactes en 4:3, le format relevé sur la maquette.
              Le texte est posé sur l'image, pas empilé dessous : ce ne sont
              pas des cartes produit, ce sont des chapitres. */}
          <ul className="grid gap-px border-y border-border bg-border md:grid-cols-3">
            {officialCollections.map((entry, index) => (
              <li key={entry.handle} className="bg-background">
                <Link
                  href={`/search/${entry.handle}`}
                  className="group relative flex aspect-4/3 flex-col justify-between overflow-hidden p-6 md:p-8"
                >
                  {entry.image ? (
                    <Image
                      src={entry.image.url}
                      alt={entry.image.altText || entry.collection.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : null}
                  {/* Deux voiles : latéral pour la colonne de texte, du bas
                      pour décoller le titre du sujet. */}
                  <div className="absolute inset-0 bg-linear-to-r from-brun/95 via-brun/55 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-brun/90 to-transparent" />

                  <p className="label-xs relative inline-flex self-start border-b border-signal pb-1 text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="relative">
                    <h3 className="headline text-3xl text-brun-foreground md:text-4xl">
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
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-[1fr_minmax(0,34rem)_11rem] md:items-center md:gap-14 md:px-10 md:py-24">
          <div>
            <p className="label-xs text-terre-foreground/60">Notre mission</p>
            <h2 className="editorial mt-8 text-4xl leading-[1.05] md:text-6xl">
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
              href="/manifeste"
              className="label-xs mt-10 inline-flex items-center gap-3 border-b border-terre-foreground/50 pb-2 text-terre-foreground transition-colors duration-300 hover:border-terre-foreground"
            >
              Lire le manifeste →
            </Link>
          </div>

          {/* Paysage 3:2, et non portrait : c'est le cadrage de la maquette. */}
          <div className="relative aspect-3/2 overflow-hidden">
            <Image
              src={ART.manifesto.url}
              alt={ART.manifesto.alt}
              fill
              sizes="(min-width: 768px) 34rem, 100vw"
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
          <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-14 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14 md:px-10 md:py-16">
            <div>
              <p className="label-xs text-craie-foreground/60">
                Collection en cours
              </p>
              <h2 className="editorial mt-5 text-5xl md:text-6xl">
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
                  className="w-36 shrink-0 snap-start md:w-auto md:flex-1"
                >
                  <Link
                    href={`/product/${product.handle}`}
                    className="group block"
                    aria-label={product.title}
                  >
                    <div className="relative aspect-3/4 overflow-hidden bg-archive">
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

      {/* Bannière finale : très large et peu haute, comme la maquette. */}
      <section
        id="rejoindre"
        className="relative flex items-center overflow-hidden bg-brun md:aspect-5/2 md:max-h-[560px]"
      >
        <Image
          src={ART.finale.url}
          alt={ART.finale.alt}
          aria-hidden={ART.finale.alt === ""}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-brun via-brun/80 to-brun/15" />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-12 px-5 py-16 text-brun-foreground md:flex-row md:items-center md:justify-between md:px-10 md:py-20">
          <div className="max-w-xl">
            <p className="label-xs text-brun-foreground/60">Onde Noire®</p>
            <h2 className="editorial mt-6 text-4xl leading-[1.05] md:text-6xl">
              Culture
              <br />
              doesn&apos;t disappear.
              <br />
              It moves.
            </h2>
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
