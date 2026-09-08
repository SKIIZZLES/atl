import { ProductCard } from "components/product-card";
import { Gallery } from "components/product/gallery";
import { ProductInfo } from "components/product/product-info";
import { CTASection } from "components/sections/cta-section";
import { EditorialSection } from "components/sections/editorial-section";
import { Breadcrumb } from "components/ui/breadcrumb";
import { ART, HERO_SLIDES } from "lib/art-direction";
import {
  collectionPages,
  collectionStories,
  isOfficialHandle,
} from "lib/collection-copy";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { orderProductImages, sizeGuideImage } from "lib/product-images";
import { colorImageMap } from "lib/product-options";
import {
  getProduct,
  getProductRecommendations,
  getShopPolicies,
} from "lib/shopify";
import type { ShopPolicies } from "lib/shopify/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable },
    },
    openGraph: url ? { images: [{ url, width, height, alt }] } : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const [product, policies] = await Promise.all([
    getProduct(params.handle),
    // Perdre les politiques coûte deux volets sur la fiche ; laisser
    // remonter l'erreur coûterait la page entière.
    getShopPolicies().catch((): ShopPolicies => ({})),
  ]);

  if (!product) return notFound();

  const images = orderProductImages(product.images);
  const sizeGuide = sizeGuideImage(product.images);
  const collectionHandle = product.collection?.handle;
  const page =
    collectionHandle && isOfficialHandle(collectionHandle)
      ? collectionPages[collectionHandle]
      : null;
  const slide = HERO_SLIDES.find((entry) => entry.handle === collectionHandle);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="shell below-header pb-20 md:pb-24">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Collections", href: "/collections" },
            ...(product.collection
              ? [
                  {
                    label: product.collection.title,
                    href: `/collections/${product.collection.handle}`,
                  },
                ]
              : []),
            { label: product.title },
          ]}
        />

        <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="w-full lg:basis-3/5">
            <Suspense
              fallback={
                <div className="aspect-4/5 w-full overflow-hidden bg-card" />
              }
            >
              <Gallery
                images={images.map((image) => ({
                  src: image.url,
                  altText: image.altText || product.title,
                }))}
                colorImages={colorImageMap(product)}
              />
            </Suspense>
          </div>

          <div className="lg:basis-2/5">
            <Suspense fallback={null}>
              <ProductInfo
                product={product}
                policies={{
                  livraison: policies.livraison?.body,
                  retours: policies.remboursement?.body,
                }}
                sizeGuideHref={sizeGuide?.url}
              />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={null}>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>

      {/* Le récit du chapitre auquel la pièce appartient. Même composant que
          sur la page collection : c'est la même histoire, pas une variante
          écrite pour la fiche. */}
      {product.collection ? (
        <EditorialSection
          tone="soft"
          side="left"
          label={product.collection.title}
          title={page?.editorial.title ?? product.collection.title}
          body={
            <p>
              {collectionStories[product.collection.handle] ??
                `Cette pièce fait partie de ${product.collection.title}.`}
            </p>
          }
          cta={{
            label: "Voir la collection",
            href: `/collections/${product.collection.handle}`,
          }}
          image={slide?.wide}
        />
      ) : null}

      <CTASection
        label="Onde Noire®"
        title={(
          page?.finale.title ?? [
            "Certaines histoires se racontent.",
            "D'autres se portent.",
          ]
        ).map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        cta={
          page?.finale.cta ?? {
            label: "Rejoindre le mouvement",
            href: "/#rejoindre",
          }
        }
        image={ART.finale}
      />
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="mt-20 border-t border-border pt-12 md:mt-24 md:pt-16">
      <h2 className="type-label mb-8 text-muted-foreground">
        Vous aimerez aussi
      </h2>
      {/* Exactement la carte des pages collection. Elle passait ici par une
          tuile bordée à étiquette flottante, héritée du gabarit d'origine :
          une même pièce n'avait pas la même tête selon la page. */}
      <ul className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:px-0">
        {relatedProducts.slice(0, 4).map((product) => (
          <li
            key={product.handle}
            className="w-44 shrink-0 snap-start md:w-auto"
          >
            <ProductCard
              product={product}
              sizes="(min-width: 768px) 22vw, 45vw"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
