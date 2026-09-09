import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "components/ui/breadcrumb";
import { Arrow, Button } from "components/ui/button";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { articleBySlug, articles, type Block } from "lib/journal";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.standfirst,
  };
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Un article du Journal.
 *
 * La structure est la même pour tous, et c'est elle qui fait la garantie :
 * les sources d'abord, la maison ensuite, jamais dans le même paragraphe.
 *
 *   01 L'histoire            — ce que les sources établissent
 *   02 Ce que l'histoire dit — les éléments culturels et sociaux
 *   03 Ce qui nous a interpellés — la voix de la maison commence ici
 *   04 De l'histoire au design   — le chemin jusqu'à l'objet
 *   05 La pièce              — le produit qui en sort
 *   06 Sources               — les références, avec leurs liens
 *
 * Les sections 01 et 02 portent un filet et un rappel de leur nature ; 03 et
 * 04 en portent un autre. Un lecteur qui arrive au milieu de la page doit
 * pouvoir dire, sans remonter, s'il lit un fait ou une interprétation.
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <section className="shell below-header pb-16 md:pb-20">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Journal", href: "/journal" },
            { label: article.title },
          ]}
        />

        <Reveal className="mt-10">
          <div className="flex items-baseline gap-5">
            <span className="type-label tabular-nums text-muted-foreground">
              {article.numeral}
            </span>
            <SectionLabel>{article.category}</SectionLabel>
          </div>

          <EditorialTitle level="h1" as="h1" className="mt-7 max-w-4xl">
            {article.title}
          </EditorialTitle>

          <p className="type-subtitle mt-10 max-w-2xl text-muted-foreground">
            {article.standfirst}
          </p>

          <time
            dateTime={article.date}
            className="type-label mt-10 block text-muted-foreground"
          >
            {dateFormat.format(new Date(article.date))}
          </time>
        </Reveal>
      </section>

      <Part
        numeral="01"
        title="L'histoire"
        nature="Ce que les sources établissent"
        blocks={article.histoire}
      />
      <Part
        numeral="02"
        title="Ce que l'histoire raconte"
        nature="Ce que les sources établissent"
        blocks={article.raconte}
        tone="card"
      />
      <Part
        numeral="03"
        title="Ce qui nous a interpellés"
        nature="Lecture d'Onde Noire"
        blocks={article.interpelles}
      />
      <Part
        numeral="04"
        title="De l'histoire au design"
        nature="Lecture d'Onde Noire"
        blocks={article.design}
        tone="card"
      />

      {/* 05 — La pièce. Le retour vers l'objet : c'est ce qui ferme la
          boucle article → produit → article. */}
      {article.piece ? (
        <section className="border-b border-border">
          <div className="shell section-y grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4 lg:col-span-3">
              <p className="type-label tabular-nums text-muted-foreground">
                05
              </p>
              <EditorialTitle level="h3" as="h2" className="mt-4">
                La pièce
              </EditorialTitle>
            </div>
            <div className="md:col-span-8">
              <p className="type-label text-muted-foreground">
                Cette histoire a donné naissance à
              </p>
              <h3 className="type-h2 mt-5 max-w-2xl">{article.piece.name}</h3>
              <p className="type-body mt-6 max-w-xl text-muted-foreground">
                {article.piece.why}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  href={`/products/${article.piece.handle}`}
                  className="group"
                >
                  Voir la pièce
                  <Arrow />
                </Button>
                <Button
                  href={`/collections/${article.collectionHandle}`}
                  variant="secondary"
                  className="group"
                >
                  Tout le chapitre
                  <Arrow />
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 06 — Sources. */}
      <section className="border-b border-border">
        <div className="shell section-y grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="type-label tabular-nums text-muted-foreground">06</p>
            <EditorialTitle level="h3" as="h2" className="mt-4">
              Sources
            </EditorialTitle>
          </div>
          <div className="md:col-span-8">
            {/* La réserve de méthode, affichée au lecteur tant que les
                références n'ont pas été ouvertes et contrôlées une par une.
                Une bibliographie qu'on n'a pas lue n'est pas une garantie :
                l'écrire est le minimum. */}
            {!article.sourcesVerifiees ? (
              <p className="type-body max-w-2xl border-l border-border-control pl-6 text-muted-foreground">
                Ces références ont été identifiées par recherche documentaire et
                se recoupent entre elles, mais elles n&apos;ont pas encore été
                ouvertes et contrôlées une par une. Les faits énoncés ci-dessus
                sont donnés sous cette réserve.
              </p>
            ) : null}

            <ul
              className={`divide-y divide-border border-y border-border ${
                article.sourcesVerifiees ? "" : "mt-10"
              }`}
            >
              {article.sources.map((source) => (
                <li key={source.url} className="py-6">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <p className="type-h3 text-foreground transition-colors duration-300 ease-onde group-hover:text-muted-foreground">
                      {source.title}
                    </p>
                    <p className="type-body mt-2 text-muted-foreground">
                      {source.publisher}
                      {source.date ? ` · ${source.date}` : ""}
                    </p>
                    {/* Le gris du système, pas une version atténuée : à
                        70 % il tombait à 4,24:1, sous le seuil de 4,5. Une
                        source dont on ne peut pas lire l'adresse n'est pas
                        une source accessible. */}
                    <p className="type-label mt-3 break-all text-muted-foreground">
                      {source.url}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="shell section-y">
          <p className="type-h2 max-w-3xl">
            Toutes les histoires
            <br />
            sont dans le Journal.
          </p>
          <div className="mt-12">
            <Link
              href="/journal"
              className="type-label group inline-flex items-center gap-3 border-b border-border-control pb-2 text-foreground transition-colors duration-300 ease-onde hover:border-foreground"
            >
              Retour au Journal
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Une des quatre parties rédigées.
 *
 * `nature` est le point important : il dit au lecteur, sur chaque section,
 * s'il lit ce que les sources établissent ou ce que la maison en fait. Un
 * bloc de type `reserve` porte en plus un filet et un libellé, parce qu'une
 * incertitude énoncée au milieu d'un paragraphe se lit comme une affirmation.
 */
function Part({
  numeral,
  title,
  nature,
  blocks,
  tone = "background",
}: {
  numeral: string;
  title: string;
  nature: string;
  blocks: Block[];
  tone?: "background" | "card";
}) {
  const onCard = tone === "card";
  const muted = onCard ? "text-card-foreground/75" : "text-muted-foreground";
  const faint = onCard ? "text-card-foreground/60" : "text-muted-foreground";

  return (
    <section
      className={
        onCard
          ? "bg-card text-card-foreground"
          : "border-b border-border bg-background"
      }
    >
      <div className="shell section-y grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4 lg:col-span-3">
          <p className={`type-label tabular-nums ${faint}`}>{numeral}</p>
          <EditorialTitle level="h3" as="h2" className="mt-4">
            {title}
          </EditorialTitle>
          <p className={`type-label mt-6 ${faint}`}>{nature}</p>
        </div>

        <div className="space-y-6 md:col-span-8">
          {blocks.map((block) =>
            block.kind === "reserve" ? (
              <div
                key={block.text}
                className="max-w-2xl border-l border-border-control pl-6"
              >
                <p className={`type-label ${faint}`}>Réserve</p>
                <p className={`type-body mt-3 ${muted}`}>{block.text}</p>
              </div>
            ) : (
              <p key={block.text} className={`type-body max-w-2xl ${muted}`}>
                {block.text}
              </p>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
