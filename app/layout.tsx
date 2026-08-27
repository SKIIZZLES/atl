import { CartProvider } from "components/cart/cart-context";
import { Header } from "components/layout/header";
import Footer from "components/layout/footer";
import { getCart, getCollections } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} — Culture × Design × Transmission`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Onde Noire est une maison de streetwear culturel africain et diasporique. Ils ont transformé les vêtements en produits. Nous les voyons comme des archives.",
  openGraph: {
    title: `${SITE_NAME} — Culture × Design × Transmission`,
    description:
      "Streetwear culturel africain et diasporique. Mémoire, héritage, transmission.",
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
    .filter((collection) => !collection.handle.startsWith("hidden-homepage"))
    .map((collection) => ({
      handle: collection.handle,
      title: collection.title,
    }));

  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} bg-background`}
    >
      <body className="bg-background font-sans text-foreground antialiased">
        <CartProvider cartPromise={cart}>
          <Header collections={navCollections} />
          <main className="min-h-screen">{children}</main>
          <Footer collections={navCollections} />
        </CartProvider>
      </body>
    </html>
  );
}
