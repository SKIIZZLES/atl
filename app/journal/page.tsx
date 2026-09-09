import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "components/ui/breadcrumb";
import { Arrow } from "components/ui/button";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { articles, enPreparation } from "lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Les histoires derrière les pièces d'Onde Noire : la recherche, les sources, et ce que la maison en a fait.",
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * L'index du Journal.
 *
 * Le Journal est le troisième espace éditorial, et le seul qui s'appuie sur
 * des sources extérieures : le manifeste dit ce que la maison défend,
 * « À propos » dit comment elle travaille, le Journal montre le travail.
 *
 * Il se lit comme une revue et non comme un blog : un numéro par article,
 * une catégorie, une grande image quand il y en a une, et la date. Les
 * sujets repérés mais non documentés apparaissent aussi, marqués comme
 * tels — un chapitre sans source est une case vide assumée, pas un prétexte
 * à écrire une histoire plausible.
 */
export default function JournalPage() {
  return (
    <>
      <section className="shell below-header pb-16 md:pb-20">
        <Breadcrumb
          items={[{ label: "Accueil", href: "/" }, { label: "Journal" }]}
        />

        <Reveal className="mt-10">
          <SectionLabel rule>Journal</SectionLabel>
          <EditorialTitle level="h1" className="mt-7 max-w-4xl">
            Les histoires
            <br />
            derrière les pièces.
          </EditorialTitle>
          <p className="type-subtitle mt-10 max-w-2xl text-muted-foreground">
            Chaque chapitre part d&apos;un fait daté et situé. On écrit ici ce
            que les sources établissent, ce qu&apos;elles ne tranchent pas, et
            ce que nous en avons fait — dans cet ordre, et jamais mélangés.
          </p>
        </Reveal>
      </section>

      <section className="shell pb-24 md:pb-32">
        <ul className="grid gap-px bg-border md:grid-cols-2">
          {articles.map((article, position) => (
            <Reveal
              as="li"
              key={article.slug}
              delay={position * 80}
              className="bg-background"
            >
              <Link
                href={`/journal/${article.slug}`}
                className="group flex h-full flex-col p-8 transition-colors duration-300 ease-onde hover:bg-hover md:p-12"
              >
                <div className="flex items-baseline gap-5">
                  <span className="type-label tabular-nums text-muted-foreground">
                    {article.numeral}
                  </span>
                  <span className="type-label text-muted-foreground">
                    {article.category}
                  </span>
                </div>

                <h2 className="type-h2 mt-8 max-w-xl text-balance">
                  {article.title}
                </h2>

                <p className="type-body mt-6 max-w-xl grow text-muted-foreground">
                  {article.standfirst}
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                  <span className="type-label inline-flex items-center gap-3 border-b border-border-control pb-2 text-foreground transition-colors duration-300 ease-onde group-hover:border-foreground">
                    Lire l&apos;histoire
                    <Arrow />
                  </span>
                  <time
                    dateTime={article.date}
                    className="type-label text-muted-foreground"
                  >
                    {dateFormat.format(new Date(article.date))}
                  </time>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Les sujets repérés, sans texte inventé pour les remplir. La case
          vide est le sujet de la section : c'est elle qui rend crédible ce
          qui est écrit à côté. */}
      {enPreparation.length > 0 ? (
        <section className="border-t border-border bg-card text-card-foreground">
          <div className="shell section-y">
            <SectionLabel tone="muted">Histoires en préparation</SectionLabel>
            <ul className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
              {enPreparation.map((subject) => (
                <li key={subject.collectionHandle}>
                  <h3 className="type-h3">{subject.title}</h3>
                  <p className="type-body mt-4 max-w-xl text-card-foreground/70">
                    {subject.why}
                  </p>
                  <Link
                    href={`/collections/${subject.collectionHandle}`}
                    className="type-label group mt-6 inline-flex items-center gap-3 border-b border-border-control pb-2 text-card-foreground transition-colors duration-300 ease-onde hover:border-card-foreground"
                  >
                    Voir le chapitre
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
