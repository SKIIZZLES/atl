import { Arrow, Button } from "components/ui/button";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Le bloc de récit : un texte, une image, un lien.
 *
 * C'est lui qui porte le manifeste sur l'accueil et l'histoire d'une
 * collection sur sa page. Même composant, mêmes proportions — l'image en
 * 3:2 paysage, jamais en portrait — pour que les deux pages se répondent au
 * lieu de se ressembler vaguement.
 *
 * `side` décide de quel côté tombe l'image. C'est la seule variable de
 * composition : alterner d'une section à l'autre évite la colonne unique
 * sans introduire une deuxième mise en page.
 */
export function EditorialSection({
  label,
  title,
  body,
  cta,
  image,
  side = "right",
  tone = "dark",
  id,
}: {
  label?: string;
  title: ReactNode;
  body: ReactNode;
  cta?: { label: string; href: string };
  image?: { url: string; alt: string };
  side?: "left" | "right";
  /** `soft` pose la section sur le noir relevé, pour séparer deux blocs. */
  tone?: "dark" | "soft";
  id?: string;
}) {
  return (
    <section id={id} className={tone === "soft" ? "bg-card" : "bg-background"}>
      <div className="shell section-y grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className={side === "left" ? "md:order-last" : undefined}>
          {label ? <SectionLabel rule>{label}</SectionLabel> : null}
          <EditorialTitle level="h2" className="mt-8">
            {title}
          </EditorialTitle>
          <div className="type-body mt-8 max-w-md text-muted-foreground">
            {body}
          </div>
          {cta ? (
            <div className="mt-10">
              <Button href={cta.href} variant="secondary" className="group">
                {cta.label}
                <Arrow />
              </Button>
            </div>
          ) : null}
        </Reveal>

        {image ? (
          <Reveal delay={90} className="relative aspect-3/2 overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
