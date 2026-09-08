import Link from "next/link";

/**
 * Sans ce fichier, Next sert sa page 404 par défaut : fond blanc, texte
 * noir, aucune navigation. Sur un site entièrement sombre, une adresse
 * fautive suffisait donc à faire apparaître une page blanche sans issue.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-[1600px] flex-col justify-center px-5 py-24 md:px-10">
      <p className="label-xs text-signal">404</p>
      <h1 className="headline mt-6 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
        L&apos;adresse est peut-être ancienne, ou mal recopiée. Les trois
        chapitres et le manifeste, eux, sont toujours là.
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="label-xs inline-flex items-center justify-center gap-3 bg-signal px-6 py-4 text-background transition-colors duration-300 hover:bg-brass"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/search"
          className="label-xs inline-flex items-center justify-center gap-3 border border-foreground px-6 py-4 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          Voir le shop →
        </Link>
        <Link
          href="/manifeste"
          className="label-xs inline-flex items-center justify-center gap-3 border border-border px-6 py-4 text-muted-foreground transition-colors duration-300 hover:border-foreground hover:text-foreground"
        >
          Lire le manifeste →
        </Link>
      </div>
    </div>
  );
}
