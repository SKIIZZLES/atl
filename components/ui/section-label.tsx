import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * L'étiquette qui ouvre une section : « COLLECTION », « NOTRE MISSION »,
 * « VOUS AIMEREZ AUSSI », ou le numéro d'un chapitre.
 *
 * Elle existe pour que ces mots aient partout le même poids. Quand la barre
 * est présente, elle donne l'accroche visuelle de la maquette ; sans elle,
 * c'est la même typographie posée seule.
 */
export function SectionLabel({
  children,
  rule = false,
  tone = "signal",
  className,
}: {
  children: ReactNode;
  /** Le trait or sous le mot, pour les ouvertures de section. */
  rule?: boolean;
  tone?: "signal" | "muted" | "inverse";
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "type-label",
        rule && "inline-flex border-b pb-1.5",
        tone === "signal" && "border-signal text-signal",
        tone === "muted" && "border-border text-muted-foreground",
        tone === "inverse" &&
          "border-craie-foreground/40 text-craie-foreground/70",
        className,
      )}
    >
      {children}
    </p>
  );
}
