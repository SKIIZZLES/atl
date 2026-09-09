"use client";

import CartModal from "components/cart/modal";
import { useFocusTrap } from "components/ui/use-focus-trap";
import clsx from "clsx";
import { LOGO } from "lib/art-direction";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavCollection = { handle: string; title: string };

/**
 * La barre de navigation, identique sur les trois gabarits.
 *
 * Elle flotte sur le hero au chargement — fond transparent, simple voile
 * dégradé pour tenir le contraste du lettrage — et bascule sur un noir
 * opaque dès qu'on défile. C'est la transition « très légère » demandée :
 * l'image respire en haut de page, le texte reste lisible ensuite.
 *
 * Elle était en noir à 90 % avec un flou : la bande ivoire remontait au
 * travers et la barre paraissait blanchie.
 */

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Manifeste", href: "/manifeste" },
  { label: "Journal", href: "/journal" },
  { label: "À propos", href: "/a-propos" },
] as const;

export function Header({ collections }: { collections: NavCollection[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useFocusTrap(menuRef, isMenuOpen);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Le menu doit se fermer quand la page change, sinon il recouvre la page
  // qu'on vient de demander.
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCollectionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  // Le marron doux a son propre jeton : le texte secondaire du site est
  // passé à la valeur de la charte, plus froide, et la barre ne devait pas
  // suivre ce changement. 6,42:1 sur le noir, au-dessus du seuil.
  const linkClass =
    "type-nav text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground";

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-onde",
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Voile en haut de page : sans lui, un lettrage ivoire sur une zone
          claire de la photographie deviendrait illisible. */}
      {!scrolled ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background/80 to-transparent"
        />
      ) : null}

      <div className="shell relative flex h-16 items-center justify-between gap-6 md:h-20">
        <Link
          href="/"
          aria-label="Onde Noire, accueil"
          className="shrink-0 transition-opacity duration-300 ease-onde hover:opacity-80"
        >
          {/* Le lettrage dessiné remplace le lettrage composé : le fichier dit
              « ONDE NOIRE », la ligne de texte disait la même chose. Les
              afficher tous les deux aurait écrit le nom deux fois.

              `h-8` / `h-10` règle la boîte, pas les lettres : le fichier
              porte un tiers de marge en haut et en bas, si bien qu'une boîte
              de 32 pixels donne une capitale de 11 — la hauteur du lettrage
              qu'il remplace. Le rapport 2,715:1 est celui du fichier.

              `priority` parce qu'il est en haut de chaque page : chargé
              paresseusement, il apparaîtrait après le reste de la barre. */}
          <Image
            src={LOGO.wordmark.url}
            alt={LOGO.wordmark.alt}
            width={109}
            height={40}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-8 lg:flex"
        >
          <Link href="/" className={linkClass}>
            Accueil
          </Link>

          <div className="relative" ref={collectionsRef}>
            <div className="flex items-center gap-1">
              <Link href="/collections" className={linkClass}>
                Collections
              </Link>
              <button
                type="button"
                onClick={() => setIsCollectionsOpen((open) => !open)}
                aria-expanded={isCollectionsOpen}
                aria-label="Voir les chapitres"
                className="text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground"
              >
                <svg
                  viewBox="0 0 10 6"
                  fill="none"
                  className={clsx(
                    "size-2.5 transition-transform duration-300 ease-onde",
                    isCollectionsOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                >
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
            </div>

            {isCollectionsOpen ? (
              <div className="absolute left-0 top-full mt-4 min-w-52 border border-border bg-background py-2">
                {collections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={`/collections/${collection.handle}`}
                    className="type-nav block px-4 py-3 text-muted-foreground transition-colors duration-300 ease-onde hover:bg-card hover:text-foreground"
                  >
                    {collection.title}
                  </Link>
                ))}
                <Link
                  href="/search"
                  className="type-nav mt-2 block border-t border-border px-4 py-3 pt-4 text-muted-foreground transition-colors duration-300 ease-onde hover:bg-card hover:text-foreground"
                >
                  Toutes les pièces
                </Link>
              </div>
            ) : null}
          </div>

          {NAV.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/search"
            className="hidden text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground md:block"
            aria-label="Rechercher"
          >
            <SearchGlyph />
          </Link>

          {/* Les comptes clients ne sont pas ouverts : l'icône tient sa place
              dans la composition sans prétendre mener quelque part — ni lien,
              ni focus clavier. */}
          <span
            aria-hidden="true"
            title="Bientôt"
            className="hidden text-muted-foreground/50 md:block"
          >
            <AccountGlyph />
          </span>

          <CartModal />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <MenuGlyph />
          </button>
        </div>
      </div>

      {/* Menu plein écran. Même noir, même typographie, mêmes chapitres :
          c'est la page qui se déplie, pas une fenêtre d'un autre site. */}
      {isMenuOpen ? (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
        >
          <div className="shell flex h-16 shrink-0 items-center justify-between">
            {/* Le menu déplié reprend le même lettrage, à la même hauteur que
                la barre qu'il recouvre : c'est la page qui se déplie, la
                marque ne doit pas changer de forme au passage. Sans lien —
                on est déjà dans la navigation. */}
            <Image
              src={LOGO.wordmark.url}
              alt={LOGO.wordmark.alt}
              width={109}
              height={40}
              className="h-8 w-auto"
            />
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fermer le menu"
              className="type-label text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground"
            >
              Fermer
            </button>
          </div>

          <nav
            aria-label="Navigation"
            className="shell flex flex-1 flex-col gap-9 overflow-y-auto py-10"
          >
            <div className="flex flex-col gap-4">
              <span className="type-label text-muted-foreground">
                Collections
              </span>
              {collections.map((collection) => (
                <Link
                  key={collection.handle}
                  href={`/collections/${collection.handle}`}
                  className="type-h3 text-foreground"
                >
                  {collection.title}
                </Link>
              ))}
              <Link href="/search" className="type-label mt-1 text-foreground">
                Toutes les pièces →
              </Link>
            </div>

            <div className="flex flex-col gap-5 border-t border-border pt-9">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="type-h3 text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="type-label mt-auto pt-8 text-muted-foreground">
              Culture in motion
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/* Trois pictogrammes dessinés plutôt qu'une bibliothèque d'icônes chargée
   pour trois traits — le poids importé n'a rien à faire dans une barre qui
   s'affiche sur toutes les pages. */

function SearchGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function AccountGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3.8 17c.7-3.1 3.2-4.8 6.2-4.8s5.5 1.7 6.2 4.8"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d="M2.5 6h15M2.5 14h15" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
