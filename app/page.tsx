import { ChapterCard } from "components/collection/chapter-card";
import { Hero } from "components/hero";
import { NewsletterForm } from "components/newsletter-form";
import { CTASection } from "components/sections/cta-section";
import { Lookbook } from "components/sections/lookbook";
import { Arrow, Button } from "components/ui/button";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { ART, slotFromImage } from "lib/art-direction";
import {
  OFFICIAL_COLLECTION_HANDLES,
  collectionKickers,
  collectionTaglines,
} from "lib/collection-copy";
import { getCollectionProducts, getCollections } from "lib/shopify";
import Image from "next/image";

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
          image:
            slotFromImage(collection.image, collection.title) ??
            slotFromImage(products[0]?.featuredImage, collection.title),
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
              Le composant est celui de l'index des collections : un chapitre
              a la même tête où qu'on le croise. */}
          <ul className="grid gap-px border-y border-border bg-border md:grid-cols-3">
            {officialCollections.map((entry, index) => (
              <li key={entry.handle} className="bg-background">
                <ChapterCard
                  index={index + 1}
                  href={`/collections/${entry.handle}`}
                  title={entry.collection.title}
                  kicker={entry.kicker}
                  image={entry.image}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="manifeste" className="bg-terre text-terre-foreground">
        <div className="shell grid gap-12 py-20 md:grid-cols-[1fr_minmax(0,34rem)_11rem] md:items-center md:gap-14 md:py-24">
          <Reveal>
            <SectionLabel
              tone="muted"
              className="border-transparent text-terre-foreground/60"
            >
              Notre mission
            </SectionLabel>
            <EditorialTitle level="h2" className="mt-8">
              Transformer
              <br />
              la mémoire
              <br />
              en mouvement.
            </EditorialTitle>
            <p className="type-body mt-8 max-w-md text-terre-foreground/75">
              Onde Noire est une maison de création contemporaine qui puise dans
              les racines africaines pour façonner un avenir audacieux. À
              travers le vêtement, nous transmettons des histoires, des valeurs
              et une identité en constante évolution.
            </p>
            <div className="mt-10">
              <Button href="/manifeste" variant="secondary" className="group">
                Lire le manifeste
                <Arrow />
              </Button>
            </div>
          </Reveal>

          {/* Paysage 3:2, et non portrait : c'est le cadrage de la maquette. */}
          <Reveal delay={90} className="relative aspect-3/2 overflow-hidden">
            <Image
              src={ART.manifesto.url}
              alt={ART.manifesto.alt}
              fill
              sizes="(min-width: 768px) 34rem, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div>
            <ul className="type-label space-y-2 text-terre-foreground/55">
              {MISSION_FIELD.map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
            <p className="type-label mt-8 border-t border-terre-foreground/25 pt-8 leading-loose text-terre-foreground/70">
              Certaines histoires se racontent.
              <br />
              D&apos;autres se portent.
            </p>
          </div>
        </div>
      </section>

      {featured ? (
        <Lookbook
          label="Collection en cours"
          title={featured.collection.title}
          body={featured.tagline}
          href={`/collections/${featured.handle}`}
          ctaLabel="Voir la collection"
          products={featured.products}
        />
      ) : null}

      {/* Bannière finale : très large et peu haute, comme la maquette. */}
      <CTASection
        id="rejoindre"
        label="Onde Noire®"
        title={
          <>
            <span className="block">Culture</span>
            <span className="block">doesn&apos;t disappear.</span>
            <span className="block">It moves.</span>
          </>
        }
        image={ART.finale}
      >
        {domain ? <NewsletterForm domain={domain} /> : null}
      </CTASection>
    </>
  );
}
