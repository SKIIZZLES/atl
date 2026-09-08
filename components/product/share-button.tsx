"use client";

import { useState } from "react";

/**
 * Partager la pièce.
 *
 * Sur téléphone, `navigator.share` ouvre la feuille de partage du système —
 * messages, réseaux, notes — ce qu'aucune rangée d'icônes recopiée ne sait
 * faire aussi bien. Ailleurs, on copie l'adresse et on le dit, parce qu'un
 * bouton qui ne répond rien laisse croire qu'il n'a pas marché.
 */
export function ShareButton({ title }: { title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          setState("copied");
          window.setTimeout(() => setState("idle"), 2500);
        } catch {
          // Un partage annulé n'est pas un échec : on ne dit rien.
          if (!navigator.share) setState("failed");
        }
      }}
      className="type-label inline-flex items-center gap-2 text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="size-4"
        aria-hidden="true"
      >
        <path
          d="M8 10.5V1.5m0 0L5 4.5M8 1.5l3 3M2.5 9v4.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
      {state === "copied"
        ? "Lien copié"
        : state === "failed"
          ? "Copie impossible"
          : "Partager"}
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Le lien a été copié." : ""}
      </span>
    </button>
  );
}
