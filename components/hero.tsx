import Image from "next/image";
import Link from "next/link";

/**
 * Les cinq mots posés dans la marge droite du hero. Ce ne sont pas des liens :
 * c'est le champ lexical de la marque, une signature typographique. Les
 * transformer en navigation ferait promettre cinq pages qui n'existent pas.
 */
const FIELD = ["Vêtements", "Culture", "Transmission", "Diaspora", "Demain"];

export function Hero() {
  return (
    <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-brun">
      <Image
        src="https://cdn.shopify.com/s/files/1/1088/9438/8549/files/Image_Codex_2_sept._2026_20_12_39.png?v=1788378548"
        alt="Un couple en tenue traditionnelle — elle porte un tignon noué haut, lui un boubou rayé — assis contre un mur de terre"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Dégradé latéral, pas vertical : le texte occupe la moitié gauche et
          le sujet de la photo la droite. Un voile du bas éteindrait le sujet. */}
      <div className="absolute inset-0 bg-linear-to-r from-brun via-brun/75 to-brun/10" />
      <div className="grain-overlay absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex w-full max-w-[1600px] items-center gap-10 px-5 py-24 md:px-10">
        <div className="max-w-2xl">
          <p className="label-xs text-brun-foreground/70">Culture in motion</p>

          <h1 className="headline mt-5 text-[15vw] leading-[0.85] text-brun-foreground md:text-[8vw]">
            Onde
            <br />
            Noire<span className="align-super text-[0.3em]">®</span>
          </h1>

          <p className="label-xs mt-8 leading-loose text-brun-foreground/85">
            Nous ne portons pas l&apos;histoire.
            <br />
            Nous la continuons.
          </p>

          <Link
            href="/#collections"
            className="label-xs mt-10 inline-flex items-center gap-3 bg-signal px-6 py-4 text-background transition-colors duration-300 hover:bg-brass"
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

      {/* Le repère de la maquette. Il est décoratif : il n'y a qu'un visuel de
          hero, donc rien à faire défiler. Le jour où il y en a trois, il
          devient l'index d'un vrai carrousel — d'ici là il ne prétend pas
          l'être, d'où l'`aria-hidden` et l'absence de contrôles. */}
      <div
        aria-hidden
        className="absolute bottom-10 left-5 flex items-center gap-4 md:left-10"
      >
        <span className="label-xs text-brun-foreground/60">01 / 03</span>
        <span className="block h-px w-20 bg-brun-foreground/30" />
      </div>
    </section>
  );
}
