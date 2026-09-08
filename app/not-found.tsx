import { Arrow, Button } from "components/ui/button";

/**
 * Sans ce fichier, Next sert sa page 404 par défaut : fond blanc, texte
 * noir, aucune navigation. Sur un site entièrement sombre, une adresse
 * fautive suffisait donc à faire apparaître une page blanche sans issue.
 */
export default function NotFound() {
  return (
    <div className="shell flex min-h-[60svh] flex-col justify-center py-24">
      <p className="type-label text-foreground">404</p>
      <h1 className="type-h2 mt-6 max-w-3xl">Cette page n&apos;existe pas.</h1>
      <p className="type-body mt-8 max-w-xl text-muted-foreground">
        L&apos;adresse est peut-être ancienne, ou mal recopiée. Les trois
        chapitres et le manifeste, eux, sont toujours là.
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Button href="/">Retour à l&apos;accueil</Button>
        <Button href="/collections" variant="secondary" className="group">
          Les collections
          <Arrow />
        </Button>
        <Button href="/manifeste" variant="secondary" className="group">
          Lire le manifeste
          <Arrow />
        </Button>
      </div>
    </div>
  );
}
