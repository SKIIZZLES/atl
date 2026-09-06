import clsx from "clsx";

// Boutique française : le format est figé en fr-FR (« 27,99 € »), jamais
// laissé à la locale de l'environnement. Sans ça le serveur rend « €27.99 »
// et le navigateur français « 27,99 € » — deux formats pour un même prix.
const format = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));

const Price = ({
  amount,
  compareAtAmount,
  prefix,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  /** Prix de référence. Barré seulement s'il est réellement supérieur :
   *  Shopify renvoie 0,00 quand aucune variante n'a de prix barré. */
  compareAtAmount?: string | null;
  /** « À partir de » quand les variantes n'ont pas toutes le même prix.
   *  Le montant affiché est alors le plus bas de la fourchette. */
  prefix?: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => {
  const isDiscounted =
    compareAtAmount != null && parseFloat(compareAtAmount) > parseFloat(amount);

  return (
    <p className={className}>
      {prefix ? (
        <span className="mr-1.5 text-muted-foreground">{prefix}</span>
      ) : null}
      {isDiscounted ? (
        <span className="mr-2 text-muted-foreground line-through">
          {format(compareAtAmount, currencyCode)}
        </span>
      ) : null}
      <span className={isDiscounted ? "text-signal" : undefined}>
        {format(amount, currencyCode)}
      </span>
      <span
        className={clsx("ml-1 inline", currencyCodeClassName)}
      >{`${currencyCode}`}</span>
    </p>
  );
};

export default Price;
