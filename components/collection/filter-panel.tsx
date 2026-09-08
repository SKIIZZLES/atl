"use client";

import clsx from "clsx";
import {
  priceBandLabel,
  type Facet,
  type FacetKey,
  type PriceBand,
  type Selection,
} from "lib/collection-filters";
import { sorting } from "lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "components/ui/use-focus-trap";

/**
 * Les filtres d'une page collection.
 *
 * Le même composant sert la colonne de gauche en desktop et le tiroir plein
 * écran en mobile : une seule liste de facettes, une seule logique d'URL,
 * deux enveloppes. C'est ce qui évite que le mobile dérive vers un autre
 * jeu de filtres à la première évolution.
 *
 * L'état vit dans l'URL, pas dans le composant. Un filtre posé se partage,
 * se met en favori et revient avec le bouton « précédent » du navigateur.
 */

function useToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (key: FacetKey, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = (params.get(key) ?? "").split(",").filter(Boolean);
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];

      if (next.length > 0) params.set(key, next.join(","));
      else params.delete(key);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );
}

function FacetGroup({
  facet,
  selection,
  bands,
  onToggle,
}: {
  facet: Facet;
  selection: Selection;
  bands: PriceBand[];
  onToggle: (key: FacetKey, value: string) => void;
}) {
  const chosen = selection[facet.key];

  return (
    <fieldset className="border-t border-border pt-6">
      <legend className="type-label pr-3 text-muted-foreground">
        {facet.label}
      </legend>
      <ul className="mt-4 space-y-3">
        {facet.values.map((entry) => {
          const active = chosen.includes(entry.value);
          const band = bands.find((item) => item.value === entry.value);
          const label = band ? priceBandLabel(band) : entry.value;

          return (
            <li key={entry.value}>
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onToggle(facet.key, entry.value)}
                  disabled={entry.count === 0}
                  className="sr-only"
                />
                {/* Une case dessinée : la case native n'accepte ni la
                    couleur du système ni ses angles droits. */}
                <span
                  aria-hidden="true"
                  className={clsx(
                    "flex size-4 shrink-0 items-center justify-center border transition-colors duration-300 ease-onde",
                    active
                      ? "border-signal bg-signal"
                      : "border-border group-hover:border-foreground",
                  )}
                >
                  {active ? (
                    <svg
                      viewBox="0 0 10 8"
                      className="size-2.5 text-background"
                      fill="none"
                    >
                      <path
                        d="M1 4.2 3.5 6.7 9 1.2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  ) : null}
                </span>
                <span
                  className={clsx(
                    "type-body text-sm transition-colors duration-300 ease-onde",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {label}
                </span>
                <span className="type-label ml-auto text-muted-foreground">
                  {entry.count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function FilterPanel({
  facets,
  selection,
  bands,
  onDone,
}: {
  facets: Facet[];
  selection: Selection;
  bands: PriceBand[];
  /** Fermeture du tiroir mobile après un choix. */
  onDone?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const toggle = useToggle();
  const active = Object.values(selection).flat().length;

  return (
    <div className="space-y-6">
      {facets.map((facet) => (
        <FacetGroup
          key={facet.key}
          facet={facet}
          selection={selection}
          bands={bands}
          onToggle={toggle}
        />
      ))}

      {active > 0 ? (
        <button
          type="button"
          onClick={() => {
            router.replace(pathname, { scroll: false });
            onDone?.();
          }}
          className="type-label border-b border-border pb-1 text-muted-foreground transition-colors duration-300 ease-onde hover:border-foreground hover:text-foreground"
        >
          Tout effacer ({active})
        </button>
      ) : null}
    </div>
  );
}

/**
 * Le tri. Un `select` natif plutôt qu'un menu dessiné : sur téléphone il
 * ouvre le sélecteur du système, qui se manipule mieux que n'importe quelle
 * liste refaite à la main.
 */
export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "";

  return (
    <label className="flex items-center gap-3">
      <span className="type-label shrink-0 text-muted-foreground">Trier</span>
      <select
        value={current}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          if (event.target.value) params.set("sort", event.target.value);
          else params.delete("sort");
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        }}
        className="type-label cursor-pointer border border-border bg-background px-3 py-2.5 text-foreground transition-colors duration-300 ease-onde hover:border-foreground"
      >
        {sorting.map((item) => (
          <option key={item.title} value={item.slug ?? ""}>
            {item.title}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Le tiroir mobile. Plein écran, même fond noir, même typographie : c'est
 * la page qui glisse par-dessus, pas une fenêtre d'un autre site.
 */
export function FilterDrawer({
  facets,
  selection,
  bands,
  count,
}: {
  facets: Facet[];
  selection: Selection;
  bands: PriceBand[];
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const active = Object.values(selection).flat().length;

  useFocusTrap(drawerRef, open);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (facets.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="type-label flex items-center gap-2 border border-border px-4 py-2.5 text-foreground transition-colors duration-300 ease-onde hover:border-foreground"
      >
        Filtrer
        {active > 0 ? <span className="text-signal">({active})</span> : null}
      </button>

      {open ? (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Filtres"
          className="fixed inset-0 z-60 flex flex-col bg-background lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
            <span className="type-label text-foreground">Filtres</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer les filtres"
              className="type-label text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground"
            >
              Fermer
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-8">
            <FilterPanel
              facets={facets}
              selection={selection}
              bands={bands}
              onDone={() => setOpen(false)}
            />
          </div>

          <div className="shrink-0 border-t border-border p-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="type-button h-14 w-full bg-signal text-background transition-colors duration-300 ease-onde hover:bg-brass"
            >
              Voir {count} {count > 1 ? "pièces" : "pièce"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
