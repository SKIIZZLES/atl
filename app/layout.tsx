import { CartProvider } from "components/cart/cart-context";
import { Header } from "components/layout/header";
import Footer from "components/layout/footer";
import { OrganizationJsonLd } from "components/seo/organization";
import { getCart, getCollections } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

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
 * `opsz` est un axe variable de Fraunces : la lettre se resserre et ses
 * empattements s'affinent à mesure que la taille monte, ce qui est
 * exactement ce qu'on attend d'un titre de deux lignes en pleine page.
 */
const editorial = Fraunces({
  subsets: ["latin"],
  // Police variable : on ne liste pas de graisses, on prend l'axe entier —
  // c'est la condition posée par `next/font` pour demander un axe
  // supplémentaire, et cela évite de télécharger trois coupes figées.
  axes: ["opsz"],
  variable: "--font-editorial-face",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-face",
  display: "swap",
});

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
      className={`${editorial.variable} ${sans.variable} bg-background`}
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
      </body>
    </html>
  );
}
