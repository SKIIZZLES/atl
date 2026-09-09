import { ProductCard } from "components/product-card";
import { Gallery } from "components/product/gallery";
import { ProductDetails } from "components/product/product-details";
import { ProductHeroSkeleton } from "components/product/product-hero-skeleton";
import { ProductInfo } from "components/product/product-info";
import { CTASection } from "components/sections/cta-section";
import { EditorialSection } from "components/sections/editorial-section";
import { articleForCollection } from "lib/journal";
import { Breadcrumb } from "components/ui/breadcrumb";
import { Arrow } from "components/ui/button";
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
import Link from "next/link";
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
  // L'article du Journal qui documente ce chapitre, s'il existe. La
  // boucle demandée va dans les deux sens : l'article renvoie à la
  // pièce, la pièce renvoie à l'article.
  const article = articleForCollection(collectionHandle);

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

      {/* L'ordre est structurel, pas rattrapé au positionnement : hero,
          puis les volets, puis le récit, puis les recommandations, puis la
          bannière. Rien n'est déplacé en absolu, rien ne remonte par un
          `z-index`. */}
      <section className="shell below-header pb-16 md:pb-20">
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

        {/* 60 / 40 : la galerie domine, la colonne de décision respire.
            Une seule suspension pour les deux colonnes, avec une empreinte
            à la bonne taille : deux frontières séparées se remplissaient
            l'une après l'autre, et le vide laissé par la seconde faisait
            remonter tout le bas de la page. */}
        <div className="mt-10">
          <Suspense fallback={<ProductHeroSkeleton />}>
            <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
              <div className="min-w-0">
                <Gallery
                  images={images.map((image) => ({
                    src: image.url,
                    altText: image.altText || product.title,
                  }))}
                  colorImages={colorImageMap(product)}
                />
              </div>

              <div className="min-w-0">
                <ProductInfo product={product} sizeGuideHref={sizeGuide?.url} />
              </div>
            </div>
          </Suspense>
        </div>
      </section>

      <ProductDetails
        product={product}
        policies={{
          livraison: policies.livraison?.body,
          retours: policies.remboursement?.body,
        }}
      />

      {/* L'histoire documentée derrière la pièce. Elle ne s'affiche que si
          un article existe pour ce chapitre : pas de lien mort vers une
          recherche qui n'a pas encore été faite. */}
      {article ? (
        <section className="border-y border-border bg-card text-card-foreground">
          <div className="shell section-y grid gap-8 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4 lg:col-span-3">
              <p className="type-label text-card-foreground/60">
                L&apos;histoire derrière cette pièce
              </p>
            </div>
            <div className="md:col-span-8">
              <h2 className="type-h2 max-w-2xl text-balance">
                {article.title}
              </h2>
              <p className="type-body mt-6 max-w-xl text-card-foreground/75">
                {article.standfirst}
              </p>
              <Link
                href={`/journal/${article.slug}`}
                className="type-label group mt-8 inline-flex items-center gap-3 border-b border-border-control pb-2 text-card-foreground transition-colors duration-300 ease-onde hover:border-card-foreground"
              >
                Lire dans le Journal
                <Arrow />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Le récit du chapitre auquel la pièce appartient. Même composant que
          sur la page collection : c'est la même histoire, pas une variante
          écrite pour la fiche. */}
      {product.collection ? (
        <EditorialSection
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

      <section className="bg-background">
        <div className="shell section-y">
          {/* Même raison qu'au-dessus : la place est réservée, sinon la
              bannière finale remonte puis redescend à l'arrivée des
              recommandations. */}
          <Suspense
            fallback={
              <div className="h-72 w-full md:h-96" aria-hidden="true" />
            }
          >
            <RelatedProducts id={product.id} />
          </Suspense>
        </div>
      </section>

      <CTASection
        label="Onde Noire®"
        title={(
          page?.finale.title ?? ["Plus qu'un vêtement.", "Un mouvement."]
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
    <>
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
    </>
  );
}
