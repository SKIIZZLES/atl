"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

/**
 * La révélation au défilement, seule et même sur tout le site.
 *
 * Le bloc part légèrement plus bas et transparent, et se pose quand il
 * entre dans le champ. Le décalage sert à faire arriver les éléments d'une
 * même rangée l'un après l'autre plutôt qu'en bloc — c'est ce qui donne le
 * rythme de film plutôt que celui d'un diaporama.
 *
 * L'état de départ est en CSS, pas en JavaScript : la feuille de style
 * annule déjà la révélation pour qui a demandé moins d'animations, et une
 * règle sous `noscript` remet le bloc visible si le script ne s'exécute
 * jamais. L'apparition est un confort ; le contenu, non.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  /** Millisecondes. Trois crans suffisent : 0, 90, 180. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          // Une seule fois : un bloc qui rejoue son entrée à chaque
          // passage transforme la page en manège.
          observer.disconnect();
        }
      },
      // On déclenche un peu avant le bord bas, sinon l'animation commence
      // alors que le bloc est déjà lu.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={clsx("reveal", shown && "reveal-in", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
