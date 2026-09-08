import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Le bouton du site. Un seul.
 *
 * Avant, chaque page inventait le sien : le hero en or, la bande claire en
 * ivoire inversé, « Ajouter au panier » en pleine largeur sur un aplat
 * clair, les puces de catégorie dans un troisième format. Cinq boutons
 * pour un même geste. Ici il n'y a plus qu'une hauteur, une typographie,
 * un interlettrage, une transition — et deux intentions.
 *
 * Les classes fautives ne sont pas citées : le scanner de Tailwind lit
 * aussi les commentaires, et les nommer suffirait à réémettre les
 * utilitaires qu'on vient de retirer.
 *
 * `primary` porte l'action principale d'un écran : fond or, texte noir.
 * `secondary` accompagne : transparent, contour, texte ivoire.
 * `quiet` est le lien souligné du système — pas un rectangle, mais il
 * partage la même typographie et la même transition, ce qui le fait
 * appartenir à la même famille.
 */
type Variant = "primary" | "secondary" | "quiet";

const BASE =
  "type-button inline-flex items-center justify-center gap-3 transition-all duration-300 ease-onde";

/* Le rectangle plein : même hauteur pour `primary` et `secondary`, sans quoi
   deux boutons côte à côte ne s'alignent pas. 52 px au doigt, 56 px à la
   souris — au-dessus des 44 px que recommande WCAG pour une cible tactile. */
const BOX = "h-[52px] px-7 md:h-14 md:px-8";

const VARIANTS: Record<Variant, string> = {
  primary: clsx(
    BOX,
    "bg-signal text-background hover:-translate-y-0.5 hover:bg-brass",
  ),
  secondary: clsx(
    BOX,
    "border border-signal/60 text-foreground hover:-translate-y-0.5 hover:border-signal hover:bg-signal hover:text-background",
  ),
  quiet:
    "border-b border-signal/50 pb-2 text-signal hover:border-signal hover:text-brass",
};

type CommonProps = {
  variant?: Variant;
  /** Pleine largeur : le panier sur mobile, les formulaires. */
  full?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >;
type AsButton = CommonProps & { href?: undefined } & Omit<
    ComponentProps<"button">,
    "className" | "children"
  >;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", full, className, children, ...rest } = props;
  const classes = clsx(BASE, VARIANTS[variant], full && "w-full", className);

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest as Omit<AsLink, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { href: _ignored, ...buttonProps } = rest as Omit<
    AsButton,
    keyof CommonProps
  >;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

/**
 * La flèche qui suit le libellé des appels à l'action. Elle avance un peu
 * au survol — c'est le seul mouvement décoratif que s'autorise le système.
 */
export function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-300 ease-onde group-hover:translate-x-1"
    >
      →
    </span>
  );
}
