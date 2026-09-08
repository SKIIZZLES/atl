"use client";

import { useEffect, type RefObject } from "react";

/**
 * Enferme le clavier dans un voile plein écran, et rend le focus en sortant.
 *
 * Sans cela, la tabulation quitte le menu ouvert et parcourt la page qui se
 * trouve derrière : on tape dans le vide, sur des liens qu'on ne voit pas.
 * `aria-modal` le dit aux lecteurs d'écran mais n'empêche rien — c'est une
 * annonce, pas un comportement.
 *
 * Au retour, le focus revient sur l'élément qui a ouvert le voile, pour
 * qu'on reprenne la page là où on l'avait laissée.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [ref, active]);
}
