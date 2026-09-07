import { ART } from "lib/art-direction";
import Image from "next/image";
import Link from "next/link";

/**
 * Les cinq mots posés dans la marge droite. Ce ne sont pas des liens : c'est
 * le champ lexical de la marque, une signature typographique. En faire une
 * navigation promettrait cinq pages qui n'existent pas.
 */
const FIELD = ["Vêtements", "Culture", "Transmission", "Diaspora", "Demain"];

export function Hero() {
  return (
    // La maquette pose le hero à 2,26:1. En viewport haut, une hauteur libre
    // le rendait bien plus profond, ce qui écrasait le titre en proportion —
    // d'où le ratio explicite dès le desktop, borné pour les très grands
    // écrans. Sur mobile la composition se recompose en hauteur d'écran.
    <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-brun md:aspect-9/4 md:min-h-[620px] md:max-h-[880px]">
      <Image
        src={ART.hero.url}
        alt={ART.hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
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

      {/* Le repère de la maquette. Décoratif : il n'y a qu'un visuel de hero,
          donc rien à faire défiler. Le jour où il y en a trois, il devient
          l'index d'un vrai carrousel — d'ici là il ne prétend pas l'être. */}
      <div
        aria-hidden
        className="absolute bottom-8 left-5 flex items-center gap-4 md:bottom-10 md:left-10"
      >
        <span className="label-xs text-brun-foreground/60">01 / 03</span>
        <span className="block h-px w-20 bg-brun-foreground/30" />
      </div>
    </section>
  );
}
