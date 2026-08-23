import { formatPrice } from "@/lib/shopify/utils";

export function Price({
  amount,
  currencyCode,
  compareAtAmount,
  className,
}: {
  amount: string;
  currencyCode: string;
  compareAtAmount?: string | null;
  className?: string;
}) {
  const onSale =
    compareAtAmount !== undefined &&
    compareAtAmount !== null &&
    Number(compareAtAmount) > Number(amount);

  return (
    <span className={className}>
      {onSale && (
        <span className="mr-2 text-neutral-500 line-through">
          {formatPrice(compareAtAmount!, currencyCode)}
        </span>
      )}
      <span className={onSale ? "text-white" : undefined}>
        {formatPrice(amount, currencyCode)}
      </span>
    </span>
  );
}
