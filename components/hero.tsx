"use client";

import { HERO_SLIDES } from "lib/art-direction";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Les cinq mots posés dans la marge droite. Ce ne sont pas des liens : c'est
 * le champ lexical de la marque, une signature typographique. En faire une
 * navigation promettrait cinq pages qui n'existent pas.
 */
const FIELD = ["Vêtements", "Culture", "Transmission", "Diaspora", "Demain"];

/** Assez lent pour qu'on ait le temps de lire, assez court pour qu'on voie
 *  qu'il y a une suite. */
const INTERVAL_MS = 6000;

export function Hero({ labels }: { labels: Record<string, string> }) {
  const [index, setIndex] = useState(0);
  const current = HERO_SLIDES[index]!;

  useEffect(() => {
    // Un défilement automatique est du confort ; pour qui le supporte mal,
    // c'est un symptôme. On ne le ralentit pas, on ne le lance pas.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % HERO_SLIDES.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    // La maquette pose le hero à 2,26:1. En viewport haut, une hauteur libre
    // le rendait bien plus profond, ce qui écrasait le titre en proportion —
    // d'où le ratio explicite dès le desktop, borné pour les très grands
    // écrans. Sur mobile la composition se recompose en hauteur d'écran.
    <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-brun md:aspect-9/4 md:min-h-[620px] md:max-h-[880px]">
      {HERO_SLIDES.map((slide, position) => {
        const active = position === index;
        return (
          <div
            key={slide.handle}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity duration-1000 ease-out"
            style={{ opacity: active ? 1 : 0 }}
          >
            {/* Deux sources, pas une image redimensionnée : le fichier large
                est en 2,36:1, l'écran d'un téléphone en 1:2 environ. Recadré
                en `cover` il n'en resterait qu'une tranche verticale. Tant
                qu'un chapitre n'a pas son cadrage vertical, il retombe sur le
                large — moins bon, mais jamais vide. */}
            {slide.portrait ? (
              <>
                <div className="absolute inset-0 md:hidden">
                  <Image
                    src={slide.portrait.url}
                    alt={slide.portrait.alt}
                    fill
                    priority={position === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 hidden md:block">
                  <Image
                    src={slide.wide.url}
                    alt={slide.wide.alt}
                    fill
                    priority={position === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>
              </>
            ) : (
              <Image
                src={slide.wide.url}
                alt={slide.wide.alt}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            )}
          </div>
        );
      })}

      {/* Dégradé latéral, pas vertical : le texte occupe la moitié gauche et
          le sujet la droite. Un voile du bas éteindrait le visage. */}
      <div className="absolute inset-0 bg-linear-to-r from-brun via-brun/75 to-brun/5" />
      <div className="grain-overlay absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex w-full max-w-[1600px] items-center gap-10 px-5 py-24 md:px-10">
        <div className="max-w-3xl">
          <p className="label-xs text-brun-foreground/70">Culture in motion</p>

          {/* Le titre doit dominer : deux lignes à 10vw occupent environ 36 %
              de la hauteur du hero, la proportion relevée sur la maquette. */}
          <h1 className="headline mt-6 text-[17vw] leading-[0.82] text-brun-foreground md:mt-8 md:text-[10vw]">
            Onde
            <br />
            Noire<span className="align-super text-[0.28em]">®</span>
          </h1>

          <p className="label-xs mt-8 leading-loose text-brun-foreground/85 md:mt-10">
            Nous ne portons pas l&apos;histoire.
            <br />
            Nous la continuons.
          </p>

          <Link
            href="/#collections"
            className="label-xs mt-8 inline-flex items-center gap-3 bg-signal px-6 py-4 text-background transition-colors duration-300 hover:bg-brass md:mt-10"
          >
            Entrer dans l&apos;onde →
          </Link>
        </div>

        <ul
          aria-hidden
          className="label-xs ml-auto hidden shrink-0 space-y-2 text-right text-brun-foreground/55 lg:block"
        >
          {FIELD.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>
      </div>

      {/* Le repère de la maquette, devenu réel : il indexe le défilé, nomme
          le chapitre affiché et permet d'y naviguer. */}
      <div className="absolute inset-x-5 bottom-8 md:inset-x-10 md:bottom-10">
        <Link
          href={`/search/${current.handle}`}
          className="label-xs inline-flex items-center gap-3 border-b border-signal/50 pb-2 text-signal transition-colors duration-300 hover:border-signal"
        >
          {labels[current.handle] ?? current.handle} →
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <span className="label-xs tabular-nums text-brun-foreground/60">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((slide, position) => (
              <button
                key={slide.handle}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Vue ${position + 1} sur ${HERO_SLIDES.length}`}
                aria-current={position === index}
                className="group py-3"
              >
                <span
                  className={
                    position === index
                      ? "block h-px w-10 bg-brun-foreground transition-colors duration-300"
                      : "block h-px w-10 bg-brun-foreground/25 transition-colors duration-300 group-hover:bg-brun-foreground/60"
                  }
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
