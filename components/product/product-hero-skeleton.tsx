/**
 * L'empreinte du hero produit pendant que son contenu arrive.
 *
 * Elle n'est pas décorative. La galerie et la colonne de décision sont
 * suspendues — leurs composants lisent l'URL, ce qui les rend dynamiques —
 * et la coquille de la page part donc sans elles : les volets, le récit et
 * la bannière étaient émis d'abord, et remontaient à l'écran avant la
 * pièce. Réserver la place exacte du hero remet chaque section sous celle
 * qui la précède, dès le premier rendu.
 *
 * Rien ne clignote : ce sont des aplats du fond, pas des barres animées.
 */
export function ProductHeroSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <div className="aspect-square w-full bg-card" />
      <div>
        <div className="h-3 w-28 bg-card" />
        <div className="mt-7 h-12 w-full bg-card md:h-16" />
        <div className="mt-3 h-12 w-3/4 bg-card md:h-16" />
        <div className="mt-8 h-4 w-40 bg-card" />
        <div className="mt-8 h-7 w-24 bg-card" />
        <div className="mt-10 h-9 w-48 bg-card" />
        <div className="mt-8 h-11 w-full bg-card" />
        <div className="mt-8 h-[52px] w-full bg-card md:h-14" />
      </div>
    </div>
  );
}
