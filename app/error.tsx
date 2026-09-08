"use client";

import { Arrow, Button } from "components/ui/button";

/**
 * L'écran d'erreur était resté celui du gabarit Next.js Commerce : fond
 * blanc, texte anglais, bouton bleu arrondi. Trois choses que la charte
 * exclut, et qui n'apparaissaient qu'en cas de pépin — donc jamais pendant
 * une relecture.
 *
 * Son fond clair n'était même pas rattrapé par sa contrepartie sombre : la
 * variante conditionnelle de Tailwind suit `prefers-color-scheme`, alors que
 * le site est sombre en permanence. Sur un téléphone réglé en clair, le bloc
 * ressortait donc blanc au milieu du noir.
 *
 * Les noms de classes fautifs ne sont pas cités ici : le scanner de Tailwind
 * lit aussi les commentaires, et les rappeler suffirait à réémettre les
 * utilitaires qu'on vient de retirer.
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="shell flex min-h-[60svh] flex-col justify-center py-24">
      <p className="type-label text-foreground">Erreur</p>
      <h1 className="type-h2 mt-6 max-w-3xl">
        Le signal s&apos;est interrompu.
      </h1>
      <p className="type-body mt-8 max-w-xl text-muted-foreground">
        Un incident est survenu de notre côté. Il est probablement passager :
        réessayez, ou reprenez depuis l&apos;accueil.
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Button type="button" onClick={() => reset()}>
          Réessayer
        </Button>
        <Button href="/" variant="secondary" className="group">
          Retour à l&apos;accueil
          <Arrow />
        </Button>
      </div>
    </div>
  );
}
