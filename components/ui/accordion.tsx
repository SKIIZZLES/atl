"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

export type AccordionEntry = {
  title: string;
  content: ReactNode;
};

/**
 * Les volets de la fiche produit : description, matières, livraison,
 * retours.
 *
 * Un seul volet ouvert à la fois — la colonne de droite est étroite, et
 * quatre blocs dépliés y noieraient le bouton d'achat. Le premier est
 * ouvert au chargement pour que la description soit lisible sans clic.
 *
 * Le panneau reste dans le DOM quand il est replié, simplement masqué :
 * la recherche du navigateur et les moteurs y accèdent, et le contenu ne
 * dépend pas d'une interaction pour exister.
 */
export function Accordion({ entries }: { entries: AccordionEntry[] }) {
  const base = useId();
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-border">
      {entries.map((entry, index) => {
        const expanded = open === index;
        const panelId = `${base}-panel-${index}`;
        const buttonId = `${base}-button-${index}`;

        return (
          <div key={entry.title} className="border-b border-border">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? -1 : index)}
                className="type-label flex w-full items-center justify-between gap-6 py-5 text-left text-foreground transition-colors duration-300 ease-onde hover:text-signal"
              >
                {entry.title}
                {/* Un chevron dessiné en deux traits : pas d'icône
                    importée pour une flèche de 10 pixels. */}
                <span
                  aria-hidden="true"
                  className="relative size-2.5 shrink-0 transition-transform duration-300 ease-onde"
                  style={{ transform: expanded ? "rotate(45deg)" : "none" }}
                >
                  <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-current" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className="type-body pb-6 text-muted-foreground"
            >
              {entry.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
