import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { ShareButton } from "components/product/share-button";
import { VariantSelector } from "components/product/variant-selector";
import { Accordion, type AccordionEntry } from "components/ui/accordion";
import { SectionLabel } from "components/ui/section-label";
import { collectionPages, isOfficialHandle } from "lib/collection-copy";
import type { Product } from "lib/shopify/types";
import Link from "next/link";

/**
 * La colonne d'informations d'une fiche produit.
 *
 * Elle suit l'ordre de lecture d'un achat : à quoi j'ai affaire, combien,
 * dans quelle taille et quel coloris, puis j'ajoute — le reste ensuite.
 *
 * Deux éléments de la maquette manquent volontairement, faute de source :
 * la notation, qui exigerait de vrais avis et qu'on ne fabrique pas ; et
 * les favoris, qui supposent un compte client. Un cœur qui n'enregistre
 * rien est un mensonge poli.
 */
export function ProductInfo({
  product,
  policies,
  sizeGuideHref,
}: {
  product: Product;
  policies: { livraison?: string; retours?: string };
  /** Le guide des tailles, quand le fournisseur en fournit un. */
  sizeGuideHref?: string;
}) {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  // Même règle que sur la carte, sans quoi un même produit annonce deux
  // prix différents selon la page où on le regarde.
  const hasRange = minVariantPrice.amount !== maxVariantPrice.amount;

  const handle = product.collection?.handle;
  const signature =
    handle && isOfficialHandle(handle) ? collectionPages[handle].signature : [];

  const entries: AccordionEntry[] = [];
  if (product.descriptionHtml) {
    entries.push({
      title: "Description",
      content: <Prose className="text-sm" html={product.descriptionHtml} />,
    });
  }
  if (policies.livraison) {
    entries.push({
      title: "Livraison",
      content: <Prose className="text-sm" html={policies.livraison} />,
    });
  }
  if (policies.retours) {
    entries.push({
      title: "Retours",
      content: <Prose className="text-sm" html={policies.retours} />,
    });
  }

  return (
    <div>
      {product.collection ? (
        <Link href={`/collections/${product.collection.handle}`}>
          <SectionLabel rule>{product.collection.title}</SectionLabel>
        </Link>
      ) : null}

      <h1 className="type-h1 mt-6 text-balance text-foreground">
        {product.title}
      </h1>

      {signature.length > 0 ? (
        <p className="type-label mt-6 leading-loose text-muted-foreground">
          {signature.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      ) : null}

      <div className="mt-8 border-b border-border pb-8">
        <Price
          className="type-price text-base text-foreground"
          prefix={hasRange ? "À partir de" : undefined}
          amount={minVariantPrice.amount}
          compareAtAmount={product.compareAtPriceRange.minVariantPrice.amount}
          currencyCode={minVariantPrice.currencyCode}
        />
      </div>

      <div className="mt-8">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
      </div>

      {sizeGuideHref ? (
        <a
          href={sizeGuideHref}
          target="_blank"
          rel="noopener noreferrer"
          className="type-label -mt-2 mb-8 inline-flex items-center gap-2 border-b border-border pb-1 text-muted-foreground transition-colors duration-300 ease-onde hover:border-foreground hover:text-foreground"
        >
          Guide des tailles
          <span aria-hidden="true">→</span>
        </a>
      ) : null}

      <AddToCart product={product} />

      <div className="mt-6 flex items-center justify-between gap-4">
        <ShareButton title={product.title} />
        {product.availableForSale ? (
          <p className="type-label text-muted-foreground">En stock</p>
        ) : null}
      </div>

      {/* Les trois réponses qu'on cherche avant de valider un panier. */}
      <ul className="mt-10 grid gap-4 border-y border-border py-6 sm:grid-cols-3">
        {[
          { label: "Livraison", detail: "France et international" },
          { label: "Paiement sécurisé", detail: "Chiffré par Shopify" },
          { label: "Retours", detail: "Selon nos conditions" },
        ].map((item) => (
          <li key={item.label}>
            <p className="type-label text-foreground">{item.label}</p>
            <p className="type-caption mt-1.5 text-muted-foreground">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>

      {entries.length > 0 ? (
        <div className="mt-10">
          <Accordion entries={entries} />
        </div>
      ) : null}
    </div>
  );
}
