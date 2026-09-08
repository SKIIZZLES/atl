import { Arrow, Button } from "components/ui/button";
import { SectionLabel } from "components/ui/section-label";
import { Reveal } from "components/ui/reveal";
import Image from "next/image";
import type { ReactNode } from "react";

/**
 * La bannière d'appel qui ferme une page — accueil, collection ou produit.
 *
 * Toujours la même construction : une photographie très large et peu haute,
 * un voile latéral plutôt que du bas (le texte occupe la gauche, le sujet la
 * droite — un voile du bas éteindrait le visage), et un titre en serif.
 *
 * Le ratio est explicite. En hauteur libre, ce bloc devenait deux fois plus
 * profond que la maquette sur un écran 16:9, ce qui écrasait le titre en
 * proportion alors que sa taille était juste.
 */
export function CTASection({
  label,
  title,
  cta,
  image,
  children,
  id,
}: {
  label?: string;
  title: ReactNode;
  cta?: { label: string; href: string };
  image: { url: string; alt: string };
  /** Un formulaire à la place du bouton, pour la bannière d'inscription. */
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative flex items-center overflow-hidden bg-brun md:aspect-5/2 md:max-h-[560px]"
    >
      <Image
        src={image.url}
        alt={image.alt}
        aria-hidden={image.alt === ""}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-r from-brun via-brun/80 to-brun/15" />

      <div className="shell section-y relative text-brun-foreground">
        <Reveal className="max-w-xl">
          {label ? <SectionLabel>{label}</SectionLabel> : null}
          <h2 className="type-h2 mt-6">{title}</h2>
          {cta ? (
            <div className="mt-10">
              <Button href={cta.href} className="group">
                {cta.label}
                <Arrow />
              </Button>
            </div>
          ) : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
