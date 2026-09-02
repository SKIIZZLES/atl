import { WaveDivider } from "components/wave-divider";
import Image from "next/image";
import Link from "next/link";

export function Hero({
  featuredCollection,
}: {
  featuredCollection: { handle: string; title: string } | null;
}) {
  return (
    <section className="relative flex h-svh min-h-[640px] flex-col justify-end overflow-hidden bg-indigo">
      <div className="absolute inset-y-0 right-0 w-[42%] bg-signal md:w-[34%]" />

      <div className="absolute inset-x-0 top-0 mx-auto h-[74%] w-[80%] max-w-2xl overflow-hidden rounded-t-[999px] md:h-[80%] md:w-[50%]">
        <Image
          src="/editorial/hero.png"
          alt="Deux mannequins en streetwear Onde Noire dans un hall de béton, photographie éditoriale"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 80vw"
          className="object-cover"
        />
        <div className="grain-overlay absolute inset-0 opacity-30" />
      </div>

      <p className="label-xs absolute left-5 top-6 text-brass md:left-10 md:top-10">
        Chapitre 001 — Transmission
      </p>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <h1 className="font-display text-[15vw] leading-[0.8] uppercase tracking-tight text-balance text-kraft md:text-[10vw]">
          Onde
          <br />
          Noire
        </h1>

        <div className="mt-6 flex flex-col gap-6 border-t border-kraft/25 pb-8 pt-6 md:flex-row md:items-end md:justify-between md:pb-10">
          <p className="max-w-md text-sm leading-relaxed text-pretty text-kraft/80">
            Streetwear culturel africain et diasporique. Ils ont transformé
            les vêtements en produits. Nous les voyons comme des archives.
          </p>

          {featuredCollection ? (
            <Link
              href={`/search/${featuredCollection.handle}`}
              className="label-xs group inline-flex shrink-0 items-center gap-3 border-2 border-kraft px-4 py-3 text-kraft transition-colors duration-300 hover:bg-kraft hover:text-kraft-foreground"
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

      <WaveDivider color="var(--brass)" className="relative z-10" />
    </section>
  );
}
