import clsx from "clsx";

/**
 * Le HTML écrit par la marque — pages Shopify, politiques de la boutique —
 * rendu dans la typographie du site : le texte courant en sans, les titres
 * en serif éditoriale. L'éditeur de Shopify n'émet que des `h2`, `h3`, `p`
 * et `ul` sans classe, donc tout le style passe par des sélecteurs
 * d'élément.
 */
const Prose = ({ html, className }: { html: string; className?: string }) => {
  return (
    <div
      className={clsx(
        "text-base leading-7 text-muted-foreground",
        "[&_h2]:headline [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:text-foreground",
        "[&_h3]:headline [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:text-foreground",
        "[&_h4]:type-label [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-foreground",
        "[&_p]:mt-5",
        "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:mt-2 [&_li]:pl-1",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:text-signal [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Prose;
