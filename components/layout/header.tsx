"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CartModal from "components/cart/modal";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavCollection = { handle: string; title: string };

export function Header({ collections }: { collections: NavCollection[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-brass bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
        <Link
          href="/"
          className="font-display text-lg uppercase tracking-tight text-foreground transition-colors duration-300 hover:text-signal"
        >
          Onde Noire
        </Link>

        <nav
          aria-label="Collections"
          className="hidden items-center gap-10 md:flex"
        >
          {collections.map((collection) => (
            <Link
              key={collection.handle}
              href={`/search/${collection.handle}`}
              className="label-xs text-muted-foreground transition-colors duration-300 hover:text-signal"
            >
              {collection.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <CartModal />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Bars3Icon className="size-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b-2 border-brass px-5">
            <span className="font-display text-lg uppercase tracking-tight">
              Onde Noire
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <XMarkIcon className="size-5" strokeWidth={1.25} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-8 px-5 pb-24">
            {collections.map((collection) => (
              <Link
                key={collection.handle}
                href={`/search/${collection.handle}`}
                onClick={() => setIsMenuOpen(false)}
                className="font-display text-3xl uppercase tracking-tight transition-colors duration-300 hover:text-signal"
              >
                {collection.title}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
