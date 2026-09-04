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
    <div className="group flex items-center gap-2 text-foreground">
      <ShoppingBagIcon
        className={clsx(
          "size-4 transition-transform duration-300 group-hover:-translate-y-0.5",
          className,
        )}
        strokeWidth={1.25}
      />
      <span className="label-xs tabular-nums">
        {count.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
