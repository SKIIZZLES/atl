"use client";

import Link from "next/link";

/**
 * L'écran d'erreur était resté celui du gabarit Next.js Commerce : fond
 * blanc, texte anglais, bouton bleu arrondi. Trois choses que la charte
 * exclut, et qui n'apparaissaient qu'en cas de pépin — donc jamais pendant
 * une relecture.
 *
 * Le `bg-white` du gabarit n'était même pas compensé par son `dark:bg-black` :
 * la variante `dark:` de Tailwind suit `prefers-color-scheme`, alors que le
 * site est sombre en permanence. Sur un téléphone réglé en clair, le bloc
 * ressortait donc blanc au milieu du noir.
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-[1600px] flex-col justify-center px-5 py-24 md:px-10">
      <p className="label-xs text-signal">Erreur</p>
      <h1 className="headline mt-6 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
        Le signal s&apos;est interrompu.
      </h1>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
        Un incident est survenu de notre côté. Il est probablement passager :
        réessayez, ou reprenez depuis l&apos;accueil.
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="label-xs inline-flex items-center justify-center gap-3 bg-signal px-6 py-4 text-background transition-colors duration-300 hover:bg-brass"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="label-xs inline-flex items-center justify-center gap-3 border border-foreground px-6 py-4 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          Retour à l&apos;accueil →
        </Link>
      </div>
    </div>
  );
}
