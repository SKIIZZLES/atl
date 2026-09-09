"use client";

import { Arrow, Button } from "components/ui/button";
import { SectionLabel } from "components/ui/section-label";
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

/** Le nom d'un chapitre et sa devise, tels qu'ils sont dans l'admin. */
export type ChapterLabel = { title: string; kicker: string };

export function Hero({ chapters }: { chapters: Record<string, ChapterLabel> }) {
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
    <section className="relative flex w-full min-h-[92svh] overflow-hidden bg-background pt-16 md:aspect-16/9 md:min-h-[660px] md:max-h-[900px] md:pt-20">
      {HERO_SLIDES.map((slide, position) => {
        const active = position === index;
        return (
          <div
            key={slide.handle}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity duration-1000 ease-onde"
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
      <div className="voile-photo absolute inset-0" />
      <div className="grain-overlay absolute inset-0 opacity-40" />

      {/* Le repère n'est plus posé en absolu au bas de la section : il vit
          dans le flux, sous un bloc de texte qui prend la place restante.
          Épinglé, il finissait par recouvrir le bouton dès que le titre
          gagnait une ligne ou que l'écran raccourcissait — et aucune valeur
          de décalage ne tient à toutes les largeurs. */}
      <div className="shell relative flex flex-col py-12 md:py-10">
        <div className="flex flex-1 items-center gap-10">
          <div className="max-w-3xl">
            <SectionLabel
              tone="muted"
              className="border-transparent text-foreground/70"
            >
              Culture in motion
            </SectionLabel>

            {/* Le titre doit dominer : deux lignes occupent environ 36 % de
                la hauteur du hero, la proportion relevée sur la maquette. */}
            <h1 className="type-display mt-6 text-foreground md:mt-8">
              Onde
              <br />
              Noire<span className="align-super text-[0.28em]">®</span>
            </h1>

            <p className="type-label mt-6 leading-loose text-foreground/85">
              Nous ne portons pas l&apos;histoire.
              <br />
              Nous la continuons.
            </p>

            <div className="mt-7">
              {/* Vers le catalogue complet, pas vers la bande des trois
                  chapitres plus bas sur la même page : c'est l'appel
                  principal de l'accueil, il doit mener aux pièces. */}
              <Button href="/search" variant="secondary" className="group">
                Entrer dans l&apos;onde
                <Arrow />
              </Button>
            </div>
          </div>

          <ul
            aria-hidden
            className="type-label ml-auto hidden shrink-0 space-y-2 text-right text-foreground/55 lg:block"
          >
            {FIELD.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        </div>

        {/* Le repère de la maquette, devenu réel : il indexe le défilé, nomme
            le chapitre affiché et permet d'y naviguer. */}
        <div className="shrink-0 pt-6">
          <Link href={`/collections/${current.handle}`} className="group block">
            {/* Le compteur ouvre, le nom domine, la devise le précise, le
                lien conclut. Une vue de défilé doit se lire d'un coup :
                où j'en suis, ce que je regarde, ce que ça veut dire, où ça
                mène. */}
            <span className="type-label block tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(HERO_SLIDES.length).padStart(2, "0")}
            </span>
            <span className="type-h3 mt-3 block text-foreground">
              {chapters[current.handle]?.title ?? current.handle}
            </span>
            {chapters[current.handle]?.kicker ? (
              <span className="type-label mt-2 block text-muted-foreground">
                {chapters[current.handle]!.kicker}
              </span>
            ) : null}
            <span className="type-label mt-4 inline-flex items-center gap-3 border-b border-border-control pb-2 text-foreground transition-colors duration-300 ease-onde group-hover:border-foreground">
              Découvrir
              <Arrow />
            </span>
          </Link>

          <div className="mt-5 flex items-center gap-4">
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
                        ? "block h-px w-10 bg-foreground transition-colors duration-300 ease-onde"
                        : "block h-px w-10 bg-foreground/25 transition-colors duration-300 ease-onde group-hover:bg-foreground/60"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
