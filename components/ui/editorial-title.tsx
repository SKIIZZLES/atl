import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Les titres de la maison, aux quatre niveaux du système.
 *
 * On choisit un niveau, jamais une taille : c'est ce qui fait qu'un titre
 * de collection pèse le même poids sur l'accueil, sur la page collection et
 * sur la fiche produit. La balise HTML se choisit séparément du niveau
 * visuel, parce que la hiérarchie du document et celle du regard ne
 * coïncident pas toujours — un titre de carte est un `h3` dans une liste et
 * un `h1` sur sa propre page, pour la même taille apparente.
 */
type Level = "display" | "h1" | "h2" | "h3";

const LEVELS: Record<Level, string> = {
  display: "type-display",
  h1: "type-h1",
  h2: "type-h2",
  h3: "type-h3",
};

export function EditorialTitle({
  level = "h2",
  as,
  children,
  className,
}: {
  level?: Level;
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  children: ReactNode;
  className?: string;
}) {
  const Tag = as ?? (level === "display" ? "h1" : level);
  return <Tag className={clsx(LEVELS[level], className)}>{children}</Tag>;
}
