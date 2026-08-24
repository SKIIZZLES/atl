import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-context";
import { CartModal } from "@/components/cart/cart-modal";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getOrCreateCart } from "@/app/cart/actions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ondenoire.com"),
  title: {
    default: "Onde Noire — Culture × Design × Transmission",
    template: "%s — Onde Noire",
  },
  description:
    "Onde Noire est une maison de streetwear culturel africain et diasporique : mémoire, transmission et héritage, dans une esthétique premium et contemporaine.",
  openGraph: {
    type: "website",
    siteName: "Onde Noire",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = await getOrCreateCart().catch(() => undefined);

  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-black text-white">
        <CartProvider initialCart={cart}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartModal />
        </CartProvider>
      </body>
    </html>
  );
}
