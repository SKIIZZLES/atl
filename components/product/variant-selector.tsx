"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

const OPTION_LABELS: Record<string, string> = {
  color: "Coloris",
  colour: "Coloris",
  couleur: "Coloris",
  size: "Taille",
  taille: "Taille",
};

const COLOR_OPTIONS = new Set(["color", "colour", "couleur"]);

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // A colorway's swatch is the image of the first variant carrying it, which is
  // what Shopify assigns per colorway on imported products.
  const swatchFor = (optionName: string, value: string) =>
    variants.find((variant) =>
      variant.selectedOptions.some(
        (selected) =>
          selected.name.toLowerCase() === optionName && selected.value === value,
      ),
    )?.image ?? null;

  return options.map((option) => {
    const optionNameLowerCase = option.name.toLowerCase();
    const isColorOption = COLOR_OPTIONS.has(optionNameLowerCase);

    return (
      <form key={option.id}>
        <dl className="mb-8">
          <dt className="label-xs mb-4 text-muted-foreground">
            {OPTION_LABELS[optionNameLowerCase] ?? option.name}
          </dt>
          <dd className={clsx("flex flex-wrap", isColorOption ? "gap-2" : "gap-3")}>
            {option.values.map((value) => {
              // Base option params on current searchParams so we can preserve any other param state.
              const optionParams: Record<string, string> = {};
              searchParams.forEach((v, k) => (optionParams[k] = v));
              optionParams[optionNameLowerCase] = value;

              // Filter out invalid options and check if the option combination is available for sale.
              const filtered = Object.entries(optionParams).filter(
                ([key, value]) =>
                  options.find(
                    (option) =>
                      option.name.toLowerCase() === key &&
                      option.values.includes(value),
                  ),
              );
              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(
                  ([key, value]) =>
                    combination[key] === value && combination.availableForSale,
                ),
              );

              // The option is active if it's in the selected options.
              const isActive = searchParams.get(optionNameLowerCase) === value;
              const swatch = isColorOption
                ? swatchFor(optionNameLowerCase, value)
                : null;

              if (swatch) {
                return (
                  <button
                    formAction={() => updateOption(optionNameLowerCase, value)}
                    key={value}
                    aria-disabled={!isAvailableForSale}
                    aria-label={`${value}${!isAvailableForSale ? " — épuisé" : ""}`}
                    disabled={!isAvailableForSale}
                    title={`${value}${!isAvailableForSale ? " — épuisé" : ""}`}
                    className={clsx(
                      "relative size-16 overflow-hidden border transition-all duration-300",
                      {
                        "border-foreground ring-1 ring-foreground": isActive,
                        "border-border hover:border-foreground":
                          !isActive && isAvailableForSale,
                        "cursor-not-allowed border-border opacity-35":
                          !isAvailableForSale,
                      },
                    )}
                  >
                    <Image
                      src={swatch.url}
                      alt={swatch.altText || value}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                );
              }

              return (
                <button
                  formAction={() => updateOption(optionNameLowerCase, value)}
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  title={`${value}${!isAvailableForSale ? " — épuisé" : ""}`}
                  className={clsx(
                    "flex min-w-[48px] items-center justify-center border border-border px-3 py-2 text-xs uppercase tracking-widest transition-colors duration-300",
                    {
                      "cursor-default border-foreground bg-foreground text-background":
                        isActive,
                      "hover:border-foreground": !isActive && isAvailableForSale,
                      "relative cursor-not-allowed overflow-hidden text-muted-foreground/40 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-border":
                        !isAvailableForSale,
                    },
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>
      </form>
    );
  });
}
