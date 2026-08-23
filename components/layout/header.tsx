"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";

const NAV_LINKS = [
  { title: "Transmission 001", handle: "transmission-001" },
  { title: "N.GRI.TUD", handle: "n-gri-tud" },
];

export function Header() {
  const { cart, openCart } = useCart();
  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-white"
        >
          Onde Noire
        </Link>

        <nav className="hidden gap-8 text-xs uppercase tracking-widest text-neutral-300 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.handle}
              href={`/collections/${link.handle}`}
              className="transition-colors hover:text-white"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <button
          onClick={openCart}
          aria-label="Ouvrir le panier"
          className="relative text-xs uppercase tracking-widest text-neutral-300 hover:text-white"
        >
          Panier{itemCount > 0 ? ` (${itemCount})` : ""}
        </button>
      </div>
    </header>
  );
}
