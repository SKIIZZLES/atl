import type { Metadata } from "next";
import Link from "next/link";

import { Lookbook } from "components/sections/lookbook";
import { EditorialTitle } from "components/ui/editorial-title";
import { SectionLabel } from "components/ui/section-label";
import {
  OFFICIAL_COLLECTION_HANDLES,
  collectionKickers,
  collectionTaglines,
} from "lib/collection-copy";
import { getCollectionProducts, getCollections } from "lib/shopify";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "Planches des chapitres Onde Noire — Le Tignon, N.GRI.TUD, Transmission 001.",
};

/**
 * Page lookbook.
 *
 * L'URL `/lookbook` tombait dans le catch-all `app/[page]`, sans page Shopify
 * correspondante : soft 404 Next (200 + corps vide). Ici on assemble les
 * planches déjà utilisées sur l'accueil, une par chapitre officiel.
 */
export default async function LookbookPage() {
  const allCollections = await getCollections().catch(() => []);
  const byHandle = new Map(allCollections.map((c) => [c.handle, c]));

  const chapters = (
    await Promise.all(
      OFFICIAL_COLLECTION_HANDLES.map(async (handle) => {
        const collection = byHandle.get(handle);
        if (!collection) return null;
        const products = await getCollectionProducts({
          collection: handle,
        }).catch(() => []);
        if (products.length === 0) return null;
        return {
          handle,
          title: collection.title,
          kicker: collectionKickers[handle] ?? "Collection",
          tagline: collectionTaglines[handle] ?? "",
          products,
        };
      }),
    )
  ).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return (
    <>
      <div className="below-header mx-auto max-w-3xl px-5 pb-12 md:px-10 md:pb-16">
        <SectionLabel tone="muted">Lookbook</SectionLabel>
        <EditorialTitle level="h1" as="h1" className="mt-6">
          Planches
        </EditorialTitle>
        <p className="type-body mt-8 max-w-xl text-muted-foreground">
          Cinq pièces par chapitre, sans nom ni prix — l&apos;image de la
          collection. Le détail se lit sur la page du chapitre.
        </p>
      </div>

      {chapters.length === 0 ? (
        <div className="mx-auto max-w-3xl px-5 pb-24 md:px-10">
          <p className="type-body text-muted-foreground">
            Les planches arrivent avec les prochaines pièces. En attendant,{" "}
            <Link
              href="/search"
              className="text-foreground underline underline-offset-4"
            >
              voir le catalogue
            </Link>
            .
          </p>
        </div>
      ) : (
        chapters.map((chapter) => (
          <Lookbook
            key={chapter.handle}
            label={chapter.kicker}
            title={chapter.title}
            body={chapter.tagline}
            href={`/collections/${chapter.handle}`}
            ctaLabel="Voir la collection"
            products={chapter.products}
          />
        ))
      )}
    </>
  );
}
