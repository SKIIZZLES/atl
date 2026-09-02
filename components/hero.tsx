import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex h-svh min-h-[640px] flex-col justify-end overflow-hidden bg-brun">
      <Image
        src="/editorial/hero.png"
        alt="Deux mannequins en streetwear Onde Noire dans un hall de béton, photographie éditoriale"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-brun via-brun/35 to-brun/10" />
      <div className="grain-overlay absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 md:px-10 md:pb-20">
        <p className="editorial text-lg italic text-brun-foreground/90 md:text-2xl">
          We don&apos;t wear history.
          <br />
          We continue it.
        </p>

        <h1 className="headline mt-5 text-[13vw] text-brun-foreground md:text-[7.5vw]">
          Onde Noire<span className="align-super text-[0.3em]">®</span>
        </h1>

        <div className="mt-8 flex flex-col gap-6 border-t border-brun-foreground/25 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="label-xs text-brun-foreground/70">
            Culture in motion — Afrique · Caraïbes · Europe · Amériques
          </p>

          <Link
            href="/#collections"
            className="label-xs group inline-flex shrink-0 items-center gap-3 border border-brun-foreground px-5 py-3 text-brun-foreground transition-colors duration-300 hover:bg-brun-foreground hover:text-brun"
          >
            Découvrir les collections →
          </Link>
        </div>
      </div>
    </section>
  );
}
