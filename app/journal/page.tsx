import { CTASection } from "components/sections/cta-section";
import { Arrow, Button } from "components/ui/button";
import { Breadcrumb } from "components/ui/breadcrumb";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { ART } from "lib/art-direction";

export const metadata = {
  title: "Journal",
  description:
    "Le journal d'Onde Noire : notes de collection, archives et entretiens.",
};

/**
 * Le journal.
 *
 * La barre de navigation le réclamait depuis le début ; l'entrée y était
 * rendue inerte, ce qui donnait une navigation à trou. La page existe donc,
 * et elle dit exactement ce qu'elle est : un chapitre ouvert, pas encore
 * écrit. Aucun article inventé pour meubler — un journal se remplit de ce
 * que la maison a réellement à dire.
 */
export default function JournalPage() {
  return (
    <>
      <section className="shell below-header pb-20 md:pb-24">
        <Breadcrumb
          items={[{ label: "Accueil", href: "/" }, { label: "Journal" }]}
        />

        <Reveal className="mt-10 max-w-3xl">
          <SectionLabel rule>Journal</SectionLabel>
          <EditorialTitle level="h1" className="mt-7">
            Ce qui s&apos;écrit
            <br />
            entre deux
            <br />
            collections.
          </EditorialTitle>
          <p className="type-body mt-10 max-w-xl text-muted-foreground">
            Le journal ouvrira avec le prochain chapitre. Il portera ce qui ne
            tient pas sur une étiquette : les notes de collection, les archives
            qu&apos;on remonte, les entretiens, les partis pris de fabrication.
          </p>
          <p className="type-body mt-5 max-w-xl text-muted-foreground">
            En attendant, tout ce que la maison a déjà écrit se lit ailleurs.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/manifeste" className="group">
              Le manifeste
              <Arrow />
            </Button>
            <Button href="/a-propos" variant="secondary" className="group">
              À propos
              <Arrow />
            </Button>
          </div>
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
