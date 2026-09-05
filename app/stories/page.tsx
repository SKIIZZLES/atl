import type { Metadata } from "next";
import Link from "next/link";

import {
  axes,
  chapters,
  opening,
  principles,
  refusals,
  sections,
  summary,
  type Block,
  type Section,
} from "lib/stories-copy";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Le manifeste d'Onde Noire : mémoire, culture, avenir. L'histoire de la marque, la direction artistique du futurisme sobre, et les chapitres LE TIGNON, N.GRI.TUD et TRANSMISSION 001.",
};

/** Un texte du manifeste : soit un paragraphe suivi, soit une cadence de
 *  lignes courtes, qu'on rend en vers plutôt qu'en liste. */
function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block) =>
        block.kind === "p" ? (
          <p
            key={block.text.slice(0, 40)}
            className="text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {block.text}
          </p>
        ) : (
          <p
            key={block.lines[0]}
            className="editorial text-lg leading-[1.7] md:text-xl"
          >
            {block.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        ),
      )}
    </div>
  );
}

/** Le rail de gauche, commun à toutes les sections : le chiffre romain
 *  et le titre, alignés sur la même grille que les chapitres. */
function SectionRail({ numeral, title }: { numeral: string; title: string }) {
  return (
    <div className="md:col-span-4 lg:col-span-3">
      <p className="headline text-5xl text-signal md:text-6xl">{numeral}</p>
      <h2 className="headline mt-4 text-2xl md:text-3xl">{title}</h2>
    </div>
  );
}

function ProseSection({
  section,
  tone,
}: {
  section: Section;
  tone: "base" | "terre";
}) {
  return (
    <section
      id={section.id}
      className={
        tone === "terre"
          ? "scroll-mt-24 bg-terre text-terre-foreground"
          : "scroll-mt-24 border-t border-border"
      }
    >
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <SectionRail numeral={section.numeral} title={section.title} />
          <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
            <p className="editorial text-2xl leading-snug md:text-3xl">
              {section.standfirst}
            </p>
            <div className="mt-10">
              <Blocks blocks={section.blocks} />
            </div>
            {section.pullQuote ? (
              <blockquote className="mt-12 border-l-2 border-signal pl-6">
                <p className="editorial text-xl leading-relaxed md:text-2xl">
                  {section.pullQuote}
                </p>
              </blockquote>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function sectionById(id: string): Section {
  const section = sections.find((entry) => entry.id === id);
  if (!section) {
    throw new Error(`Section manquante dans lib/stories-copy.ts : ${id}`);
  }
  return section;
}

export default function StoriesPage() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Ouverture */}
      <header className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="label-xs text-signal">Onde Noire — Stories</p>
        <h1 className="headline mt-5 max-w-5xl text-[11vw] leading-[0.9] md:text-[6vw]">
          {opening.title}
        </h1>
        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="label-xs text-muted-foreground">
              Mémoire · Culture · Avenir
            </p>
          </div>
          <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
            <p className="editorial text-2xl leading-snug md:text-3xl">
              {opening.standfirst}
            </p>
            <div className="mt-10">
              <Blocks blocks={opening.blocks} />
            </div>
          </div>
        </div>
      </header>

      {/* Sommaire */}
      <nav
        aria-label="Sommaire"
        className="mx-auto mt-20 max-w-[1600px] px-5 md:px-10"
      >
        <p className="label-xs text-muted-foreground">Sommaire</p>
        <ul className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {summary.map((entry) => (
            <li key={entry.id} className="bg-background">
              <a
                href={`#${entry.id}`}
                className="flex h-full flex-col gap-3 p-5 transition-colors duration-300 hover:bg-card"
              >
                <span className="label-xs text-signal">{entry.numeral}</span>
                <span className="text-sm text-foreground">{entry.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-20">
        <ProseSection section={sectionById("notre-histoire")} tone="base" />
        <ProseSection
          section={sectionById("pourquoi-onde-noire")}
          tone="terre"
        />
        <ProseSection section={sectionById("le-88eme-echo")} tone="base" />
      </div>

      {/* IV — Les chapitres */}
      <section
        id="les-chapitres"
        className="scroll-mt-24 border-t border-border"
      >
        <div className="mx-auto max-w-[1600px] px-5 pt-20 md:px-10 md:pt-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <SectionRail numeral="IV" title="Les chapitres" />
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <p className="editorial text-2xl leading-snug md:text-3xl">
                Chaque collection est datée et située, comme une pièce
                d&apos;archive — sauf que l&apos;archive est ouverte.
              </p>
              <p className="mt-10 text-base leading-relaxed text-muted-foreground md:text-lg">
                Les deux premiers chapitres viennent de l&apos;histoire
                documentée. Le troisième commence maintenant.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                <h3 className="headline mt-4 text-2xl md:text-3xl">
                  {chapter.title}
                </h3>
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
                <p className="editorial text-2xl leading-snug md:text-3xl">
                  {chapter.standfirst}
                </p>
                <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {chapter.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
                <blockquote className="mt-12 border-l-2 border-signal pl-6">
                  <p className="editorial text-xl leading-relaxed md:text-2xl">
                    {chapter.pullQuote}
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </article>
      ))}

      {/* V — Le futurisme sobre */}
      <section
        id="futurisme-sobre"
        className="scroll-mt-24 bg-terre text-terre-foreground"
      >
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <SectionRail numeral="V" title="Le futurisme sobre" />
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <p className="editorial text-2xl leading-snug md:text-3xl">
                Et si une civilisation avait conservé ses archives pendant des
                siècles avant de les transmettre à une génération future ? Quel
                serait son langage visuel ?
              </p>
              <div className="mt-10 space-y-8">
                <p className="text-base leading-relaxed text-terre-foreground/75 md:text-lg">
                  Onde Noire ne cherche pas à représenter
                  «&nbsp;l&apos;Afrique&nbsp;» avec les codes visuels attendus.
                  Pas d&apos;afrofuturisme devenu décoration. Pas
                  d&apos;accumulation de motifs. Pas de clichés tribaux utilisés
                  comme texture. Pas de folklore vendu comme identité.
                </p>
                <p className="editorial text-lg leading-[1.7] md:text-xl">
                  {[
                    "Probablement pas bruyant.",
                    "Probablement pas saturé.",
                    "Probablement pas prévisible.",
                    "Il serait précis.",
                    "Dense.",
                    "Mystérieux.",
                    "Technologique.",
                    "Spirituel.",
                    "Minimal.",
                  ].map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-16 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {axes.map((axis) => (
              <li key={axis.index} className="bg-terre p-8 md:p-10">
                <p className="label-xs text-signal">{axis.index}</p>
                <p className="headline mt-4 text-xl md:text-2xl">
                  {axis.title}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-terre-foreground/75">
                  {axis.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProseSection section={sectionById("langage-visuel")} tone="base" />
      <ProseSection section={sectionById("streetwear")} tone="terre" />

      {/* VIII — Nos principes */}
      <section id="principes" className="scroll-mt-24 border-t border-border">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <SectionRail numeral="VIII" title="Nos principes" />
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <p className="editorial text-2xl leading-snug md:text-3xl">
                Cinq règles qui décident de ce qui entre dans une pièce, et de
                ce qui n&apos;y entre pas.
              </p>
              <ol className="mt-12 divide-y divide-border border-y border-border">
                {principles.map((principle, i) => (
                  <li
                    key={principle.title}
                    className="flex gap-6 py-8 md:gap-10"
                  >
                    <span className="label-xs mt-1 shrink-0 text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="headline text-xl text-cuivre md:text-2xl">
                        {principle.title}
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        {principle.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* IX — Ce que nous ne sommes pas */}
      <section
        id="n-est-pas"
        className="scroll-mt-24 bg-terre text-terre-foreground"
      >
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <SectionRail numeral="IX" title="Onde Noire n'est pas" />
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <ul className="divide-y divide-border border-y border-border">
                {refusals.map((refusal) => (
                  <li
                    key={refusal}
                    className="editorial py-6 text-xl leading-snug md:text-2xl"
                  >
                    {refusal}
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-base leading-relaxed text-terre-foreground/75 md:text-lg">
                Onde Noire est un système culturel. Une marque qui construit ses
                propres signes. Ses propres archives. Ses propres transmissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProseSection section={sectionById("vision")} tone="base" />

      {/* Clôture */}
      <section className="bg-brun text-brun-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <p className="headline max-w-4xl text-3xl leading-[1.05] md:text-6xl">
            Ce qui a été oublié n&apos;a pas disparu.
            <br />
            Nous sommes encore en transmission.
          </p>
          <p className="label-xs mt-10 text-signal">
            Mémoire · Culture · Avenir
          </p>

          <div className="mt-20 grid gap-12 border-t border-border pt-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4 lg:col-span-3">
              <p className="label-xs text-muted-foreground">La marque</p>
            </div>
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <div className="space-y-6 text-base leading-relaxed text-brun-foreground/75 md:text-lg">
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
