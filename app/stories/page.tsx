import type { Metadata } from "next";
import Link from "next/link";

import { chapters, refusals } from "lib/stories-copy";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Trois chapitres, trois dates. L'histoire derrière LE TIGNON, N.GRI.TUD et TRANSMISSION 001, et la direction que prend Onde Noire.",
};

export default function StoriesPage() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Ouverture */}
      <header className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="label-xs text-signal">Stories</p>
        <h1 className="headline mt-5 max-w-4xl text-[13vw] leading-[0.9] md:text-[7vw]">
          Ce que le vêtement garde en mémoire
        </h1>
        <p className="editorial mt-8 max-w-2xl text-xl italic leading-relaxed text-muted-foreground md:text-2xl">
          Trois collections, trois dates. Deux viennent de l&apos;histoire
          documentée, la troisième commence maintenant.
        </p>
        <div className="mt-14 border-t border-border" />
      </header>

      {/* Chapitres */}
      {chapters.map((chapter, i) => (
        <article
          key={chapter.handle}
          className={i % 2 === 1 ? "bg-terre text-terre-foreground" : undefined}
        >
          <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
            <div className="grid gap-12 md:grid-cols-12 md:gap-16">
              {/* Colonne de repère : index, date, lieu */}
              <div className="md:col-span-4 lg:col-span-3">
                <p className="headline text-6xl text-signal md:text-7xl">
                  {chapter.index}
                </p>
                <h2 className="headline mt-4 text-2xl md:text-3xl">
                  {chapter.title}
                </h2>
                <dl className="mt-8 space-y-3">
                  <div>
                    <dt className="label-xs text-muted-foreground">Date</dt>
                    <dd className="label-xs mt-1">{chapter.period}</dd>
                  </div>
                  <div>
                    <dt className="label-xs text-muted-foreground">Lieu</dt>
                    <dd className="label-xs mt-1">{chapter.place}</dd>
                  </div>
                </dl>
                <Link
                  href={`/search/${chapter.handle}`}
                  className="label-xs mt-10 inline-flex items-center gap-3 border-b border-signal/50 pb-2 text-signal transition-colors duration-300 hover:border-signal"
                >
                  Voir la collection →
                </Link>
              </div>

              {/* Corps du texte */}
              <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
                <p className="editorial text-2xl italic leading-snug md:text-3xl">
                  {chapter.standfirst}
                </p>
                <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {chapter.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
                <blockquote className="mt-12 border-l-2 border-signal pl-6">
                  <p className="editorial text-xl italic leading-relaxed md:text-2xl">
                    {chapter.pullQuote}
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </article>
      ))}

      {/* Ce que nous refusons */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <p className="label-xs text-signal">Direction artistique</p>
          <h2 className="headline mt-5 max-w-3xl text-4xl md:text-6xl">
            Ce que nous ne ferons pas
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Une direction se définit autant par ses refus que par ses choix.
            Voici les quatre facilités que nous écartons, et pourquoi.
          </p>

          <ul className="mt-16 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {refusals.map((item) => (
              <li key={item.no} className="bg-background p-8 md:p-10">
                <p className="headline text-xl text-cuivre md:text-2xl">
                  {item.no}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.yes}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* La marque */}
      <section className="bg-brun text-brun-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4 lg:col-span-3">
              <p className="label-xs text-signal">La marque</p>
            </div>
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <p className="editorial text-2xl italic leading-snug md:text-3xl">
                Mémoire · Culture · Avenir
              </p>
              <div className="mt-10 space-y-6 text-base leading-relaxed text-brun-foreground/75 md:text-lg">
                <p>
                  Onde Noire est éditée depuis Bourg-en-Bresse, dans l&apos;Ain,
                  et immatriculée en juillet 2026. Une partie des pièces est
                  imprimée à la demande, sans stock : rien n&apos;est produit
                  avant d&apos;être commandé.
                </p>
                <p>
                  La marque s&apos;adresse à une diaspora qui circule entre
                  l&apos;Afrique, les Caraïbes, l&apos;Europe et les Amériques,
                  et qui n&apos;a pas besoin qu&apos;on lui explique d&apos;où
                  viennent ses références.
                </p>
              </div>
              <Link
                href="/search"
                className="label-xs mt-12 inline-flex items-center gap-3 border border-brun-foreground px-5 py-3 text-brun-foreground transition-colors duration-300 hover:bg-brun-foreground hover:text-brun"
              >
                Voir le shop →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
