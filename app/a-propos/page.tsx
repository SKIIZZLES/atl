import { axes, opening, principles, refusals } from "lib/stories-copy";
import type { Metadata } from "next";
import Link from "next/link";

import { Arrow, Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Onde Noire, maison de création contemporaine éditée depuis Bourg-en-Bresse. Le futurisme sobre, nos principes, et ce que la marque n'est pas.",
};

/**
 * La page « À propos » ne réécrit rien : elle recompose ce que le fondateur a
 * déjà écrit — les cinq axes du futurisme sobre, les cinq principes, les
 * refus — autour des seuls faits que l'immatriculation atteste. Le manifeste
 * complet reste à /manifeste ; cette page en est l'entrée courte.
 */
export default function AProposPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <p className="type-label text-foreground">À propos</p>
          <h1 className="headline mt-6 max-w-4xl text-[13vw] leading-[0.88] md:text-[7vw]">
            Onde Noire<span className="align-super text-[0.28em]">®</span>
          </h1>
          <p className="editorial mt-10 max-w-2xl text-xl italic leading-relaxed text-muted-foreground md:text-2xl">
            {opening.standfirst}
          </p>
          <p className="type-label mt-10 text-foreground">
            Mémoire · Culture · Avenir
          </p>
        </div>
      </section>

      <section className="bg-card text-card-foreground">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:grid-cols-12 md:gap-16 md:px-10 md:py-28">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="type-label text-card-foreground/60">La maison</p>
          </div>
          <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
            <div className="space-y-6 text-base leading-relaxed text-card-foreground/80 md:text-lg">
              <p>
                Onde Noire est une maison de création contemporaine qui puise
                dans les racines africaines pour façonner un avenir audacieux. À
                travers le vêtement, nous transmettons des histoires, des
                valeurs et une identité en constante évolution.
              </p>
              <p>
                Elle est éditée depuis Bourg-en-Bresse, dans l&apos;Ain, et
                immatriculée en juillet 2026. Une partie des pièces est imprimée
                à la demande, sans stock : rien n&apos;est produit avant
                d&apos;être commandé.
              </p>
              <p>
                La marque s&apos;adresse à une diaspora qui circule entre
                l&apos;Afrique, les Caraïbes, l&apos;Europe et les Amériques, et
                qui n&apos;a pas besoin qu&apos;on lui explique d&apos;où
                viennent ses références.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <p className="type-label text-foreground">Le futurisme sobre</p>
          <h2 className="editorial mt-6 max-w-3xl text-3xl leading-[1.1] md:text-5xl">
            Cinq axes, et rien qui ne serve la transmission.
          </h2>

          <ul className="mt-14 grid gap-px bg-border md:grid-cols-2">
            {axes.map((axis) => (
              <li key={axis.index} className="bg-background p-8 md:p-10">
                <p className="type-label text-foreground">{axis.index}</p>
                <h3 className="headline mt-4 text-xl md:text-2xl">
                  {axis.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {axis.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-card text-card-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <p className="type-label text-card-foreground/60">Nos principes</p>
          <dl className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
            {principles.map((principle) => (
              <div key={principle.title}>
                <dt className="headline text-lg md:text-xl">
                  {principle.title}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-card-foreground/70">
                  {principle.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <p className="type-label text-foreground">
            Onde Noire n&apos;est pas
          </p>
          <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
            {refusals.map((refusal) => (
              <li
                key={refusal}
                className="py-5 text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {refusal}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <p className="headline max-w-4xl text-3xl leading-[1.05] md:text-5xl">
            Certaines histoires se racontent.
            <br />
            D&apos;autres se portent.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/manifeste" className="group">
              Lire le manifeste
              <Arrow />
            </Button>
            <Button href="/search" variant="secondary" className="group">
              Voir le shop
              <Arrow />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
