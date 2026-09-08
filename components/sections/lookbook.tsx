import { Arrow, Button } from "components/ui/button";
import { EditorialTitle } from "components/ui/editorial-title";
import { Reveal } from "components/ui/reveal";
import { SectionLabel } from "components/ui/section-label";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

/**
 * La bande de collection : une rupture de registre, pas de luminosité.
 *
 * Elle était le seul aplat ivoire du site. Elle passe au second noir : on
 * garde la bande — l'œil comprend qu'il change de chapitre — mais le site
 * reste sombre d'un bout à l'autre.
 *
 * Une planche contact — cinq pièces d'un même chapitre, alignées, sans nom
 * ni prix. Ce n'est pas une grille produit : c'est une image de la
 * collection, et le détail se lit sur la page du chapitre.
 *
 * D'où le défilement horizontal en mobile plutôt qu'un repli en grille :
 * empilée, la rangée perd exactement ce qui en fait une planche.
 */
export function Lookbook({
  label,
  title,
  body,
  href,
  ctaLabel,
  products,
}: {
  label: string;
  title: string;
  body?: string;
  href: string;
  ctaLabel: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="bg-card text-card-foreground">
      <div className="shell grid items-center gap-10 py-14 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14 md:py-16">
        <Reveal>
          <SectionLabel tone="muted">{label}</SectionLabel>
          <EditorialTitle level="h2" className="mt-5">
            {title}
          </EditorialTitle>
          {body ? (
            <p className="type-body mt-5 max-w-xs text-muted-foreground">
              {body}
            </p>
          ) : null}
          <div className="mt-8">
            <Button href={href} className="group">
              {ctaLabel}
              <Arrow />
            </Button>
          </div>
        </Reveal>

        <Reveal
          as="ul"
          delay={90}
          className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:px-0"
        >
          {products.slice(0, 5).map((product) => (
            <li
              key={product.id}
              className="w-36 shrink-0 snap-start md:w-auto md:flex-1"
            >
              <Link
                href={`/products/${product.handle}`}
                className="group block"
                aria-label={product.title}
              >
                <div className="relative aspect-3/4 overflow-hidden bg-background">
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      fill
                      sizes="(min-width: 768px) 16vw, 40vw"
                      className="object-cover transition-transform duration-700 ease-onde group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
