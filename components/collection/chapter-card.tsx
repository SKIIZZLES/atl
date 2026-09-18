import { EditorialTitle } from "components/ui/editorial-title";
import { SectionLabel } from "components/ui/section-label";
import Image from "next/image";
import Link from "next/link";

/**
 * La carte d'un chapitre : le numéro, le nom, sa devise, une photographie
 * plein cadre.
 *
 * Le même composant sur la page d'accueil et sur l'index des collections.
 * Ce ne sont pas des cartes produit — le texte est posé sur l'image, pas
 * empilé dessous — et c'est cette différence de traitement qui dit au
 * visiteur qu'il regarde un chapitre et non un article.
 *
 * Le visuel vient du champ image de la collection dans l'admin Shopify :
 * la marque peut le changer sans toucher au code.
 */
export function ChapterCard({
  index,
  href,
  title,
  kicker,
  image,
  ratio = "4/3",
}: {
  index: number;
  href: string;
  title: string;
  kicker?: string;
  image?: { url: string; alt: string } | null;
  /** L'index des collections respire davantage que la bande d'accueil. */
  ratio?: "4/3" | "3/4";
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col justify-between overflow-hidden p-6 md:p-8 ${
        ratio === "3/4" ? "aspect-4/5 md:aspect-3/4" : "aspect-4/3"
      }`}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 ease-onde group-hover:scale-[1.03]"
        />
      ) : null}

      {/* Un seul dégradé doux (bas/gauche) : les deux voiles globaux
          empilaient trop de noir et noyaient le bas de la photo.
          Plancher ~0,55 côté texte — titres restent blancs. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to top left, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.28) 42%, rgba(0, 0, 0, 0.08) 100%)",
        }}
      />

      <SectionLabel rule className="relative self-start">
        {String(index).padStart(2, "0")}
      </SectionLabel>

      <div className="relative">
        <EditorialTitle level="h3" as="h3" className="text-foreground">
          {title}
        </EditorialTitle>
        {kicker ? (
          <p className="type-label mt-2 text-foreground/70">{kicker}</p>
        ) : null}
        <span className="type-label mt-6 inline-flex items-center gap-3 border-b border-border-control pb-2 text-foreground transition-colors duration-300 ease-onde group-hover:border-foreground">
          Découvrir
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-onde group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
