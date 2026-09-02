import clsx from "clsx";
import Link from "next/link";

export const CATEGORIES = [
  "T-Shirts",
  "Hoodies",
  "Sweatshirts",
  "Outerwear",
  "Accessoires",
  "Pièces",
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
          "label-xs shrink-0 border px-4 py-2.5 transition-colors duration-300",
          active
            ? "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            : "border-foreground bg-foreground text-background",
        )}
      >
        Tout
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/search?category=${encodeURIComponent(category)}`}
          className={clsx(
            "label-xs shrink-0 border px-4 py-2.5 transition-colors duration-300",
            active === category
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
          )}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}
