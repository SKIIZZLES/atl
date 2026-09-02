import { CartProvider } from "components/cart/cart-context";
import { Header } from "components/layout/header";
import Footer from "components/layout/footer";
import { getCart, getCollections } from "lib/shopify";
import { baseUrl } from "lib/utils";
import type { Metadata, Viewport } from "next";
import { Anton, Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const editorial = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
  colorScheme: "light",
  themeColor: "#f3efe7",
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
      className={`${display.variable} ${editorial.variable} ${body.variable} ${mono.variable} bg-background`}
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
