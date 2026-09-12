import { FournisseurConsentement } from "components/analytics/consentement";
import { GoogleConsentement } from "components/analytics/google-consentement";
import { MetaPixel } from "components/analytics/meta-pixel";
import { CartProvider } from "components/cart/cart-context";
import { Header } from "components/layout/header";
import Footer from "components/layout/footer";
import { OrganizationJsonLd } from "components/seo/organization";
import { getCart, getCollections } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

/**
 * Deux familles, et deux seulement.
 *
 * Le brief impose une serif éditoriale pour les très grands titres et une
 * sans moderne pour la navigation et les petits textes. Le site en chargeait
 * quatre : une display condensée pour les titres, une serif pour les
 * citations, une sans pour le texte, une mono pour les libellés. Quatre
 * familles, c'est quatre dialectes — et deux téléchargements de police pour
 * rien.
 *
 * Elles ne passent plus par `next/font/google` : les deux fichiers sont
 * versionnés dans `public/fonts/` et déclarés dans `globals.css`, à une
 * adresse qui ne change pas d'un build à l'autre. Les `@font-face`, les
 * plages de graisses et les métriques de repli sont là-bas.
 */

/** Les deux fichiers à charger tôt : ils portent tout le texte visible. */
const POLICES = [
  "/fonts/fraunces-latin-variable.woff2",
  "/fonts/ibm-plex-sans-latin-variable.woff2",
];

/**
 * L'identifiant de mesure Google Analytics 4.
 *
 * Il sert deux choses : la mesure d'audience, et la validation de la
 * propriété Search Console — « Google Analytics » est l'une des méthodes
 * acceptées, ce qui évite d'avoir à toucher au DNS.
 *
 * GA4 dépose des cookies, que la CNIL exige couverts par un consentement.
 * Ils le sont désormais : le fragment ci-dessous ouvre sur un refus de
 * tout — c'est le « mode consentement » de Google — et
 * `GoogleConsentement` ne lève ce refus que sur un « Accepter ».
 *
 * `@vercel/analytics`, lui, ne pose aucun cookie. C'est pourquoi il n'a
 * jamais eu à poser la question, et pourquoi il reste hors du bandeau.
 */
const GA_MESURE = "G-TTH21K0528";

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME}® — Culture in Motion`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "We don't wear history. We continue it. Onde Noire est une maison de streetwear culturel afro-diasporique — Afrique, Caraïbes, Europe, Amériques.",
  openGraph: {
    title: `${SITE_NAME}® — Culture in Motion`,
    description: "We don't wear history. We continue it.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    follow: true,
    index: true,
  },
  /* Une adresse canonique par page.
     Le site répond sur `ondenoire.com` et sur `www.ondenoire.com`, et les
     fiches produit acceptent en plus des paramètres de variante
     (`?color=…&size=…`). Autant d'adresses pour un même contenu : sans
     déclaration, un moteur doit choisir laquelle compte, et il répartit le
     crédit entre elles au lieu de le concentrer.
     `"./"` est relatif : Next le résout contre `metadataBase` et le chemin
     de la page rendue, si bien qu'une seule ligne ici en couvre toutes —
     et qu'une nouvelle page n'a rien à déclarer pour être couverte. */
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  // Ces deux lignes ne sont pas décoratives : elles sont le dernier recours.
  // Sur le chemin d'erreur, Next sert un document qui n'embarque aucune
  // feuille de style et ne passe pas par le layout ci-dessous — ni les
  // classes, ni les styles en ligne n'y arrivent. `color-scheme: dark` est
  // alors la seule chose qui empêche le navigateur de peindre du blanc.
  colorScheme: "dark",
  // Le fond du site. Recopié à la main, et il avait dérivé : il valait encore
  // le noir d'avant la palette neutre.
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();
  const collections = await getCollections().catch(() => []);

  const navCollections = collections
    .filter(
      (collection) =>
        !collection.handle.startsWith("hidden-homepage") &&
        collection.handle !== "frontpage",
    )
    .map((collection) => ({
      handle: collection.handle,
      title: collection.title,
    }));

  return (
    <html
      lang="fr"
      className="bg-background"
      /* Le fond en style en ligne, et non seulement en classe.
         `bg-background` est un utilitaire : il n'existe que si la feuille de
         style arrive. Sur le chemin d'erreur, Next sert un document qui n'en
         embarque aucune — les trois `bg-background` du layout deviennent
         alors inertes et le navigateur peint sa couleur par défaut, blanche.
         C'est la seule façon dont ce site peut encore devenir blanc.
         La déclaration ci-dessous s'efface devant le jeton quand il est là,
         et ne sert que de canot de sauvetage quand il manque : aucune valeur
         à tenir à jour, contrairement aux deux qui avaient déjà dérivé. */
      style={{ backgroundColor: "var(--background, #000000)" }}
    >
      {/* Les deux polices sont demandées tôt plutôt que découvertes à la
          lecture de la feuille de style. `crossOrigin` est obligatoire : une
          police est toujours chargée en mode anonyme, et sans cet attribut le
          navigateur téléchargerait le fichier deux fois. */}
      <head>
        {POLICES.map((police) => (
          <link
            key={police}
            rel="preload"
            as="font"
            type="font/woff2"
            href={police}
            crossOrigin="anonymous"
          />
        ))}

        {/* Google Analytics 4.
            Écrit ici en balises brutes plutôt qu'avec `next/script` : le
            validateur de Search Console récupère le HTML servi et y cherche
            le fragment. `next/script` en stratégie `afterInteractive` injecte
            le tag depuis le client, après hydratation — il serait absent du
            document que le validateur lit, et la validation échouerait.

            Le `consent default` précède le `config`, et cet ordre est le
            seul qui compte : après, GA4 aurait déjà posé son cookie. */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MESURE}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GA_MESURE}');`,
          }}
        />
      </head>
      <body
        className="bg-background font-sans text-foreground antialiased"
        style={{
          backgroundColor: "var(--background, #000000)",
          color: "var(--foreground, #f5f5f5)",
        }}
      >
        {/* Les blocs à révéler partent transparents. Sans script, ils le
            resteraient : cette règle les rend visibles d'emblée. L'entrée
            est un confort, le contenu ne l'est pas. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>

        {/* Qui parle. Sans cette déclaration, un moteur qui rencontre
            « onde noire » n'a aucune raison de penser à une marque plutôt
            qu'à un four à micro-ondes de couleur noire. */}
        <OrganizationJsonLd />
        {/* Le consentement enveloppe tout ce qui mesure. Il enveloppe aussi
            les pages, parce que la fiche produit envoie son propre
            événement et doit pouvoir lire la réponse. */}
        <FournisseurConsentement>
          <CartProvider cartPromise={cart}>
            <Header collections={navCollections} />
            {/* Le fond est posé explicitement ici aussi : `html` et `body` le
              portent déjà, mais une section sans fond déclaré hériterait
              sinon du blanc du navigateur si l'un des deux venait à sauter. */}
            <main
              className="min-h-screen bg-background text-foreground"
              style={{ backgroundColor: "var(--background, #000000)" }}
            >
              {children}
            </main>
            <Footer collections={navCollections} />
          </CartProvider>

          {/* Les deux mesures soumises au consentement. Le pixel Meta ne
              charge rien tant qu'il n'est pas accordé ; GA4 est déjà chargé
              mais sans cookie, et attend le même feu vert pour en poser. */}
          <MetaPixel />
          <GoogleConsentement />
        </FournisseurConsentement>

        {/* La balise `<script>` écrite à la main a été retirée : elle
            chargeait `/_vercel/insights/script.js`, c'est-à-dire exactement
            ce que ce composant injecte lui-même. Garder les deux aurait
            compté chaque visite deux fois. */}
        <Analytics />
      </body>
    </html>
  );
}
