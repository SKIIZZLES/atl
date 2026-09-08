import { Arrow, Button } from "components/ui/button";
import { Breadcrumb, type Crumb } from "components/ui/breadcrumb";
import { SectionLabel } from "components/ui/section-label";
import Image from "next/image";

/**
 * Le hero d'une page collection.
 *
 * Même construction que celui de l'accueil — ratio explicite, voile
 * latéral, grain — mais un cran plus bas dans la hiérarchie : le titre est
 * en H1 et non en display, parce que la page d'accueil est l'enseigne et
 * celle-ci un chapitre.
 *
 * Le fil d'Ariane est posé dans le hero et non au-dessus : la maquette
 * n'ouvre pas sur une bande vide, et le contraste du voile suffit à le
 * rendre lisible sur l'image.
 */
export function CollectionHero({
  crumbs,
  title,
  signature,
  intro,
  image,
  cta,
}: {
  crumbs: Crumb[];
  title: string;
  signature: string[];
  intro?: string;
  image?: { url: string; alt: string } | null;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative flex w-full min-h-[70svh] items-end overflow-hidden bg-brun pt-16 md:aspect-9/4 md:min-h-[540px] md:max-h-[760px] md:items-center md:pt-20">
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : null}

      {/* Voile latéral : le texte occupe la gauche, le sujet la droite. */}
      <div className="absolute inset-0 bg-linear-to-r from-brun via-brun/75 to-brun/10" />
      <div className="grain-overlay absolute inset-0 opacity-40" />

      <div className="shell relative py-14 md:py-12">
        <Breadcrumb items={crumbs} />

        <div className="mt-10 max-w-2xl md:mt-14">
          <SectionLabel rule>Collection</SectionLabel>

          <h1 className="type-h1 mt-7 text-brun-foreground">{title}</h1>

          {signature.length > 0 ? (
            <p className="type-label mt-8 leading-loose text-brun-foreground/85">
              {signature.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          ) : null}

          {intro ? (
            <p className="type-body mt-7 max-w-lg text-brun-foreground/75">
              {intro}
            </p>
          ) : null}

          {cta ? (
            <div className="mt-10">
              <Button href={cta.href} className="group">
                {cta.label}
                <Arrow />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
