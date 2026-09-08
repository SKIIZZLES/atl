import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

/**
 * Le fil d'Ariane des pages collection et produit.
 *
 * Le dernier maillon n'est pas un lien — il désigne la page où l'on se
 * trouve — et il porte `aria-current` pour que ce soit dit aussi aux
 * lecteurs d'écran, pas seulement montré.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="type-label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="transition-colors duration-300 ease-onde hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className="text-foreground"
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {last ? null : (
                <li aria-hidden="true" className="text-border">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
