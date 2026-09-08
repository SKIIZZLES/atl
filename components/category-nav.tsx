import clsx from "clsx";
import Link from "next/link";

/**
 * Ces libellés ne sont pas décoratifs : `/search?category=` interroge Shopify
 * avec `product_type:"<libellé>"`. Toute entrée ajoutée ici doit exister mot
 * pour mot dans le champ « type de produit » d'au moins un article, sinon le
 * filtre renvoie une page vide.
 */
export const CATEGORIES = [
  "T-Shirts",
  "Hoodies & Sweats",
  "Pantalons",
  "Vestes & Manteaux",
  "Robes",
  "Accessoires",
] as const;

export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav
      aria-label="Catégories"
      className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0"
    >
      <Link
        href="/search"
        className={clsx(
          "type-label shrink-0 border px-4 py-2.5 transition-colors duration-300",
          active
            ? "border-border-control text-muted-foreground hover:border-foreground hover:text-foreground"
            : "border-signal text-signal",
        )}
      >
        Tout
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/search?category=${encodeURIComponent(category)}`}
          className={clsx(
            "type-label shrink-0 border px-4 py-2.5 transition-colors duration-300",
            active === category
              ? "border-signal text-signal"
              : "border-border-control text-muted-foreground hover:border-foreground hover:text-foreground",
          )}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}
