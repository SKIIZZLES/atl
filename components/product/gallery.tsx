"use client";

import clsx from "clsx";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type GalleryImage = { src: string; altText: string };

/**
 * La galerie produit.
 *
 * Deux compositions, un seul jeu d'images. En desktop : une grande image,
 * la colonne de miniatures à gauche, des flèches, un compteur. En mobile :
 * un défilé qui se balaie au doigt — un vrai défilement à aimants, pas une
 * animation refaite à la main, donc l'inertie du système et rien à
 * réapprendre.
 *
 * `colorImages` fait le lien avec le sélecteur de coloris : choisir une
 * couleur amène la galerie sur la bonne pièce au lieu de laisser le
 * visiteur regarder un noir en ayant cliqué sur un beige. La correspondance
 * passe par l'URL du visuel de la variante, la seule donnée que Shopify
 * garantisse — le code coloris des libellés (« 0-Y99-Front Side ») ne dit
 * pas le nom de la couleur.
 */
export function Gallery({
  images,
  colorImages,
}: {
  images: GalleryImage[];
  colorImages?: Record<string, string>;
}) {
  const [index, setIndex] = useState(0);
  const searchParams = useSearchParams();
  const trackRef = useRef<HTMLUListElement>(null);

  // La valeur de coloris choisie, quel que soit le nom donné à l'option.
  const color =
    searchParams.get("couleur") ??
    searchParams.get("color") ??
    searchParams.get("colour");

  useEffect(() => {
    if (!color || !colorImages) return;
    const url = colorImages[color];
    if (!url) return;
    const found = images.findIndex((image) => image.src === url);
    if (found >= 0) setIndex(found);
  }, [color, colorImages, images]);

  // Le défilé mobile suit l'index quand il change ailleurs (miniature,
  // coloris) ; le sens inverse est géré par l'écouteur de défilement.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.children[index] as HTMLElement | undefined;
    if (!target) return;
    if (Math.abs(track.scrollLeft - target.offsetLeft) < 4) return;
    track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, [index]);

  if (images.length === 0) return null;

  const total = images.length;
  const previous = index === 0 ? total - 1 : index - 1;
  const next = index + 1 < total ? index + 1 : 0;
  const counter = (
    <p className="type-label tabular-nums text-muted-foreground">
      {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </p>
  );

  return (
    <div className="lg:flex lg:gap-5">
      {/* Colonne de miniatures — desktop seulement. */}
      {total > 1 ? (
        <ul className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
          {images.map((image, position) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Voir le visuel ${position + 1} sur ${total}`}
                aria-current={position === index}
                className={clsx(
                  "relative block aspect-4/5 w-full overflow-hidden border transition-colors duration-300 ease-onde",
                  position === index
                    ? "border-foreground"
                    : "border-border hover:border-foreground",
                  /* Le fond du cadre : une miniature au format PNG laisse
                     voir ce qu'il y a dessous par ses zones transparentes. */
                  "bg-background",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="min-w-0 flex-1">
        {/* Desktop : une seule grande image, changée sur place.
            Cadre carré et image contenue, pas recadrée : les mockups du
            fournisseur sont en 1200 × 1200, et les faire entrer dans un
            portrait 4:5 en `cover` coupait un cinquième de la largeur —
            c'est-à-dire les manches d'un vêtement oversize. Le guide des
            tailles, lui, est en 1200 × 580 : il se pose dans le cadre au
            lieu d'être rogné jusqu'à l'illisible. */}
        <div className="relative hidden aspect-square overflow-hidden bg-background lg:block">
          <Image
            src={images[index]!.src}
            alt={images[index]!.altText}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-contain"
          />

          {total > 1 ? (
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
              {counter}
              <div className="flex items-center border border-border bg-background/85 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIndex(previous)}
                  aria-label="Visuel précédent"
                  className="px-4 py-3 text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground"
                >
                  <Chevron direction="left" />
                </button>
                <span className="h-5 w-px bg-border" />
                <button
                  type="button"
                  onClick={() => setIndex(next)}
                  aria-label="Visuel suivant"
                  className="px-4 py-3 text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground"
                >
                  <Chevron direction="right" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Mobile : le défilé se balaie. */}
        <div className="lg:hidden">
          <ul
            ref={trackRef}
            onScroll={(event) => {
              const track = event.currentTarget;
              const position = Math.round(track.scrollLeft / track.clientWidth);
              if (position !== index && position >= 0 && position < total) {
                setIndex(position);
              }
            }}
            className="-mx-5 flex snap-x snap-mandatory overflow-x-auto"
          >
            {images.map((image, position) => (
              <li
                key={image.src}
                className="relative aspect-square w-screen shrink-0 snap-center bg-background"
              >
                <Image
                  src={image.src}
                  alt={image.altText}
                  fill
                  priority={position === 0}
                  sizes="100vw"
                  className="object-contain"
                />
              </li>
            ))}
          </ul>

          {total > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-4">
              {counter}
              <ul className="flex gap-2 overflow-x-auto">
                {images.map((image, position) => (
                  <li key={image.src}>
                    <button
                      type="button"
                      onClick={() => setIndex(position)}
                      aria-label={`Voir le visuel ${position + 1} sur ${total}`}
                      aria-current={position === index}
                      className={clsx(
                        "relative block size-14 overflow-hidden border transition-colors duration-300 ease-onde",
                        position === index
                          ? "border-foreground"
                          : "border-border",
                      )}
                    >
                      <Image
                        src={image.src}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 8 14" fill="none" className="size-3" aria-hidden="true">
      <path
        d={direction === "left" ? "M7 1 1 7l6 6" : "M1 1l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
