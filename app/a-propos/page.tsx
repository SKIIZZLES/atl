import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import { Arrow, Button } from "components/ui/button";
import { ART } from "lib/art-direction";

import {
  beyond,
  collections,
  doing,
  facts,
  intro,
  method,
  origin,
  who,
} from "lib/about-copy";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Onde Noire, maison de création indépendante éditée depuis Bourg-en-Bresse : qui nous sommes, comment nous travaillons, et ce que nous construisons au-delà du vêtement.",
};

/**
 * La page « À propos ».
 *
 * Elle et le manifeste répondent à deux questions différentes, et cette
 * page-ci est la seconde : qui parle, et comment. Le manifeste dit ce que
 * la maison défend ; celle-ci montre l'atelier — les faits, les étapes, ce
 * qui est produit et comment.
 *
 * D'où trois écarts de traitement, volontaires, pour qu'on ne confonde
 * jamais les deux pages en arrivant dessus :
 *
 *   — Numérotation arabe 01 à 06, quand le manifeste va de I à X.
 *   — Pas de cadence en lignes courtes, pas de citation détachée : ce sont
 *     les deux figures du manifeste, et elles lui restent.
 *   — Une seule photographie, et un tableau de faits en ouverture. La page
 *     tient par sa structure, pas par son souffle.
 *
 * Le contenu vit dans `lib/about-copy.ts`. Il vivait dans
 * `lib/stories-copy.ts`, c'est-à-dire dans le manifeste lui-même : les deux
 * pages affichaient les mêmes phrases.
 */
export default function AProposPage() {
  return (
    <>
      {/* Ouverture. Pas d'image : le manifeste s'ouvre sur un portrait
          plein cadre, et c'est sa signature. Celle-ci s'ouvre sur un
          tableau de faits, ce qui annonce la nature de la page dès la
          première seconde. */}
      <section className="below-header border-b border-border">
        <div className="shell pb-20 md:pb-28">
          <SectionLabel>{intro.label}</SectionLabel>
          <h1 className="type-display mt-6 max-w-4xl">
            Onde Noire<span className="align-super text-[0.28em]">®</span>
          </h1>
          <p className="type-subtitle mt-10 max-w-2xl text-muted-foreground">
            {intro.standfirst}
          </p>

          <dl className="mt-16 grid gap-x-10 gap-y-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="type-label text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="type-body mt-2 text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 01 — Qui est Onde Noire ? */}
      <Section numeral={who.numeral} title={who.title}>
        <div className="max-w-2xl space-y-6">
          {who.blocks.map((block) => (
            <p key={block} className="type-body text-muted-foreground">
              {block}
            </p>
          ))}
        </div>
      </Section>

      {/* 02 — Comment tout a commencé */}
      <Section numeral={origin.numeral} title={origin.title} tone="card">
        <div className="max-w-2xl space-y-6">
          {origin.blocks.map((block) => (
            <p key={block} className="type-body text-card-foreground/75">
              {block}
            </p>
          ))}
        </div>
      </Section>

      {/* 03 — Ce que nous faisons */}
      <Section numeral={doing.numeral} title={doing.title}>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {doing.items.map((item, position) => (
            <Reveal
              as="li"
              key={item.title}
              delay={position * 60}
              className="grid gap-3 py-8 md:grid-cols-12 md:gap-10"
            >
              <h3 className="type-h3 md:col-span-5">{item.title}</h3>
              <p className="type-body text-muted-foreground md:col-span-7">
                {item.text}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* La seule photographie de la page. Elle sépare ce que fait la
          maison de ce qu'elle a sorti, et laisse respirer une page dense en
          texte. Le fond noir est posé sur la section : si l'image ne charge
          pas, la bande reste sombre au lieu de s'ouvrir sur du vide clair. */}
      <section className="relative isolate aspect-16/9 w-full overflow-hidden bg-background md:aspect-21/9">
        <Image
          src={ART.finale.url}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="voile-photo absolute inset-0" />
      </section>

      {/* 04 — Nos collections */}
      <Section numeral="04" title="Nos collections">
        <p className="type-body max-w-2xl text-muted-foreground">
          Trois chapitres à ce jour. Chacun part d&apos;une source précise,
          datée et située ; l&apos;histoire complète est racontée dans le
          manifeste.
        </p>
        <ul className="mt-14 grid gap-px bg-border md:grid-cols-3">
          {collections.map((collection, position) => (
            <Reveal
              as="li"
              key={collection.handle}
              delay={position * 80}
              className="flex flex-col bg-background p-8 md:p-10"
            >
              <p className="type-label text-muted-foreground">
                {collection.period} · {collection.place}
              </p>
              <h3 className="type-h3 mt-4">{collection.title}</h3>
              <p className="type-body mt-5 grow text-muted-foreground">
                {collection.text}
              </p>
              <Link
                href={`/collections/${collection.handle}`}
                className="type-label group mt-8 inline-flex items-center gap-3 self-start border-b border-border-control pb-2 text-foreground transition-colors duration-300 ease-onde hover:border-foreground"
              >
                Voir le chapitre
                <Arrow />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 05 — Notre manière de créer */}
      <Section numeral="05" title="Notre manière de créer" tone="card">
        <p className="type-body max-w-2xl text-card-foreground/75">
          Six étapes, toujours dans cet ordre. Une pièce qui ne franchit pas la
          deuxième ne sera jamais dessinée.
        </p>
        <ol className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12 lg:grid-cols-3">
          {method.map((step, position) => (
            <Reveal as="li" key={step.numeral} delay={position * 60}>
              <p className="type-label tabular-nums text-card-foreground/60">
                {step.numeral}
              </p>
              <h3 className="type-h3 mt-3">{step.title}</h3>
              <p className="type-body mt-4 text-card-foreground/75">
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 06 — Plus qu'une marque */}
      <Section numeral={beyond.numeral} title={beyond.title}>
        <div className="max-w-2xl space-y-6">
          {beyond.blocks.map((block) => (
            <p key={block} className="type-body text-muted-foreground">
              {block}
            </p>
          ))}
        </div>
      </Section>

      {/* Sortie de page. Elle nomme explicitement la différence entre les
          deux pages, pour que le lecteur sache ce qu'il va trouver s'il
          suit le lien plutôt que de relire la même chose autrement. */}
      <section className="border-t border-border">
        <div className="shell section-y">
          <p className="type-h2 max-w-3xl">
            Voilà comment nous travaillons.
            <br />
            Ce que nous défendons est écrit ailleurs.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/manifeste" className="group">
              Lire le manifeste
              <Arrow />
            </Button>
            <Button href="/search" variant="secondary" className="group">
              Voir les pièces
              <Arrow />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * L'enveloppe d'une section numérotée.
 *
 * Le numéro et le titre se posent dans une colonne étroite à gauche à
 * partir du grand écran, le contenu à droite : c'est la mise en page d'un
 * dossier, pas d'un texte suivi, et c'est ce qui distingue le plus
 * nettement cette page du manifeste à première vue.
 */
function Section({
  numeral,
  title,
  tone = "background",
  children,
}: {
  numeral: string;
  title: string;
  tone?: "background" | "card";
  children: React.ReactNode;
}) {
  const onCard = tone === "card";
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
          <p
            className={`type-label tabular-nums ${
              onCard ? "text-card-foreground/60" : "text-muted-foreground"
            }`}
          >
            {numeral}
          </p>
          <EditorialTitle level="h3" as="h2" className="mt-4">
            {title}
          </EditorialTitle>
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </section>
  );
}
