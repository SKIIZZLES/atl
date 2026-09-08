import { ChapterCard } from "components/collection/chapter-card";
import { CTASection } from "components/sections/cta-section";
import { Arrow, Button } from "components/ui/button";
import { Breadcrumb } from "components/ui/breadcrumb";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { ART, slotFromImage } from "lib/art-direction";
import {
  OFFICIAL_COLLECTION_HANDLES,
  collectionKickers,
  collectionTaglines,
} from "lib/collection-copy";
import { getCollections } from "lib/shopify";

export const metadata = {
  title: "Collections",
  description:
    "Les chapitres d'Onde Noire : Le Tignon, N.GRI.TUD, Transmission 001.",
};

export default async function CollectionsIndexPage() {
  const all = await getCollections().catch(() => []);
  const byHandle = new Map(all.map((entry) => [entry.handle, entry]));

  // L'ordre est celui des chapitres, pas celui de Shopify : Transmission 001
  // est le premier signal, il ferme la série au lieu de l'ouvrir par ordre
  // alphabétique.
  const chapters = OFFICIAL_COLLECTION_HANDLES.map((handle) =>
    byHandle.get(handle),
  ).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <>
      <section className="shell below-header pb-16 md:pb-20">
        <Breadcrumb
          items={[{ label: "Accueil", href: "/" }, { label: "Collections" }]}
        />
        <Reveal className="mt-10 max-w-3xl">
          <SectionLabel rule>Trois chapitres</SectionLabel>
          <EditorialTitle level="h1" className="mt-7">
            Collections
          </EditorialTitle>
          <p className="type-body mt-8 max-w-xl text-muted-foreground">
            Chaque chapitre porte une idée et ses pièces. Ensemble ils racontent
            la même chose : une culture qui ne disparaît pas, qui se déplace.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-border">
        <ul className="grid gap-px bg-border md:grid-cols-3">
          {chapters.map((collection, index) => (
            <li key={collection.handle} className="bg-background">
              <ChapterCard
                index={index + 1}
                href={`/collections/${collection.handle}`}
                title={collection.title}
                kicker={collectionKickers[collection.handle]}
                image={slotFromImage(collection.image, collection.title)}
                ratio="3/4"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="shell section-y">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <SectionLabel tone="muted">Tout le catalogue</SectionLabel>
            <EditorialTitle level="h2" className="mt-6">
              Voir toutes les pièces
            </EditorialTitle>
            <p className="type-body mt-6 text-muted-foreground">
              {chapters
                .map((collection) => collectionTaglines[collection.handle])
                .filter(Boolean)
                .join(" ")}
            </p>
          </div>
          <Button href="/search" variant="secondary" className="group shrink-0">
            Le shop
            <Arrow />
          </Button>
        </Reveal>
      </section>

      <CTASection
        label="Onde Noire®"
        title={
          <>
            <span className="block">Certaines histoires se racontent.</span>
            <span className="block">D&apos;autres se portent.</span>
          </>
        }
        cta={{ label: "Rejoindre le mouvement", href: "/#rejoindre" }}
        image={ART.finale}
      />
    </>
  );
}
