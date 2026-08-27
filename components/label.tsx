import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        },
      )}
    >
      <div className="flex items-center border border-border bg-background/80 p-2 text-xs backdrop-blur-md">
        <h3 className="label-xs mr-4 line-clamp-2 grow pl-1">{title}</h3>
        <Price
          className="flex-none text-muted-foreground"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden"
        />
      </div>
    </div>
  );
};

export default Label;
