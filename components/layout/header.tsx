"use client";

import {
  Bars3Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CartModal from "components/cart/modal";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavCollection = { handle: string; title: string };

export function Header({ collections }: { collections: NavCollection[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const collectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        collectionsRef.current &&
        !collectionsRef.current.contains(event.target as Node)
      ) {
        setIsCollectionsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-brun/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground transition-colors duration-300 hover:text-signal"
        >
          ONDE NOIRE®
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-8 md:flex"
        >
          <Link
            href="/"
            className="label-xs text-foreground transition-colors duration-300 hover:text-signal"
          >
            Accueil
          </Link>

          <div className="relative" ref={collectionsRef}>
            <button
              type="button"
              onClick={() => setIsCollectionsOpen((open) => !open)}
              className="label-xs flex items-center gap-1 text-foreground transition-colors duration-300 hover:text-signal"
              aria-expanded={isCollectionsOpen}
            >
              Collections
              <ChevronDownIcon className="size-3" strokeWidth={2} />
            </button>
            {isCollectionsOpen ? (
              <div className="absolute left-0 top-full mt-3 min-w-48 border border-border bg-background py-2 shadow-lg">
                {collections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={`/search/${collection.handle}`}
                    onClick={() => setIsCollectionsOpen(false)}
                    className="label-xs block px-4 py-2.5 text-foreground transition-colors duration-300 hover:bg-card hover:text-signal"
                  >
                    {collection.title}
                  </Link>
                ))}
                {/* « Accueil » a remplacé « Shop » dans la barre : le catalogue
                    complet reste joignable ici, pour ne pas retirer un chemin
                    de navigation que la maquette ne montre simplement pas. */}
                <Link
                  href="/search"
                  onClick={() => setIsCollectionsOpen(false)}
                  className="label-xs mt-2 block border-t border-border px-4 py-2.5 pt-4 text-muted-foreground transition-colors duration-300 hover:bg-card hover:text-signal"
                >
                  Toutes les pièces
                </Link>
              </div>
            ) : null}
          </div>

          <Link
            href="/manifeste"
            className="label-xs text-foreground transition-colors duration-300 hover:text-signal"
          >
            Manifeste
          </Link>
          {/* La maquette liste « Journal ». La page n'existe pas encore :
              l'entrée tient sa place dans la composition sans prétendre
              mener quelque part — ni lien, ni focus clavier. */}
          <span
            aria-hidden
            className="label-xs cursor-default text-muted-foreground/50"
            title="Bientôt"
          >
            Journal
          </span>
          <Link
            href="/a-propos"
            className="label-xs text-foreground transition-colors duration-300 hover:text-signal"
          >
            À propos
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/search"
            className="hidden text-foreground transition-colors duration-300 hover:text-signal md:block"
            aria-label="Rechercher"
          >
            <MagnifyingGlassIcon className="size-5" strokeWidth={1.5} />
          </Link>

          <UserIcon
            aria-hidden
            className="hidden size-5 text-muted-foreground/50 md:block"
            strokeWidth={1.5}
          />

          <CartModal />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Bars3Icon className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <span className="font-display text-lg tracking-tight text-signal">
              ONDE NOIRE®
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <XMarkIcon className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pb-24 pt-10">
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className="headline text-3xl"
            >
              Shop
            </Link>
            <div className="flex flex-col gap-5 border-l-2 border-signal pl-4">
              <span className="label-xs text-muted-foreground">
                Collections
              </span>
              {collections.map((collection) => (
                <Link
                  key={collection.handle}
                  href={`/search/${collection.handle}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="headline text-2xl"
                >
                  {collection.title}
                </Link>
              ))}
            </div>
            <Link
              href="/manifeste"
              onClick={() => setIsMenuOpen(false)}
              className="headline text-3xl"
            >
              Stories
            </Link>
            <Link
              href="/a-propos"
              onClick={() => setIsMenuOpen(false)}
              className="headline text-3xl"
            >
              À propos
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
