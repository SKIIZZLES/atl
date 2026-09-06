import clsx from "clsx";

const format = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));

const Price = ({
  amount,
  compareAtAmount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  /** Prix de référence. Barré seulement s'il est réellement supérieur :
   *  Shopify renvoie 0,00 quand aucune variante n'a de prix barré. */
  compareAtAmount?: string | null;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => {
  const isDiscounted =
    compareAtAmount != null && parseFloat(compareAtAmount) > parseFloat(amount);

  return (
    <p suppressHydrationWarning={true} className={className}>
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
