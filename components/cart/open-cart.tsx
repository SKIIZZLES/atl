import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  const count = quantity ?? 0;

  return (
    <div className="group flex items-center gap-1.5 text-foreground">
      <ShoppingBagIcon
        className={clsx(
          "size-4 transition-transform duration-300 group-hover:-translate-y-0.5",
          className,
        )}
        strokeWidth={1.25}
      />
      {/* `hidden md:block` et non `md:inline` : à spécificité égale Tailwind
          tranche par l'ordre d'émission, et `.hidden` sort avant `.inline` —
          le mot resterait visible sur mobile. `.block` sort après. */}
      <span className="label-xs hidden md:block">Panier</span>
      <span className="label-xs tabular-nums">({count})</span>
    </div>
  );
}
