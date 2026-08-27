import Image from "next/image";
import Link from "next/link";

export function Hero({
  featuredCollection,
}: {
  featuredCollection: { handle: string; title: string } | null;
}) {
  return (
    <section className="relative flex h-svh min-h-[640px] flex-col justify-end overflow-hidden">
      <Image
        src="/editorial/hero.png"
        alt="Deux mannequins en streetwear Onde Noire dans un hall de béton, photographie éditoriale"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-background/70" />
      <div className="grain-overlay absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-16 md:px-10 md:pb-24">
        <p className="label-xs text-signal">Chapitre 001 — Transmission</p>

        <h1 className="mt-8 font-display text-[16vw] leading-[0.82] uppercase tracking-[0.06em] text-balance md:text-[11vw]">
          Onde
          <br />
          Noire
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
            Culture × Design × Transmission. Ils ont transformé les vêtements
            en produits. Nous les voyons comme des archives : coupes lourdes,
            matières brutes, mémoire portée.
          </p>

          {featuredCollection ? (
            <Link
              href={`/search/${featuredCollection.handle}`}
              className="label-xs group inline-flex items-center gap-4 border-b border-foreground/40 pb-3 transition-colors duration-300 hover:border-foreground"
            >
              Découvrir {featuredCollection.title}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
