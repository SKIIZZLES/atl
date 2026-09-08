import { CartProvider } from "components/cart/cart-context";
import { Header } from "components/layout/header";
import Footer from "components/layout/footer";
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
  colorScheme: "dark",
  themeColor: "#0a0a0a",
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
    >
      <body className="bg-background font-sans text-foreground antialiased">
        {/* Les blocs à révéler partent transparents. Sans script, ils le
            resteraient : cette règle les rend visibles d'emblée. L'entrée
            est un confort, le contenu ne l'est pas. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
        <CartProvider cartPromise={cart}>
          <Header collections={navCollections} />
          <main className="min-h-screen">{children}</main>
          <Footer collections={navCollections} />
        </CartProvider>
      </body>
    </html>
  );
}
