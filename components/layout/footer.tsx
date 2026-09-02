import { WaveDivider } from "components/wave-divider";
import Link from "next/link";

type NavCollection = { handle: string; title: string };

export default function Footer({
  collections,
}: {
  collections: NavCollection[];
}) {
  return (
    <footer>
      <WaveDivider color="var(--brass)" />
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg tracking-tight">
              ONDE NOIRE®
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              We don&apos;t wear history. We continue it.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
            <nav aria-label="Shop" className="flex flex-col gap-4">
              <span className="label-xs text-muted-foreground/60">Shop</span>
              {collections.map((collection) => (
                <Link
                  key={collection.handle}
                  href={`/search/${collection.handle}`}
                  className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {collection.title}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-4">
              <span className="label-xs text-muted-foreground/60">
                Informations
              </span>
              <Link
                href="/#manifeste"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Contact
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="label-xs text-muted-foreground/60">
                Réseaux
              </span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Onde Noire
          </p>
          <p className="label-xs text-muted-foreground/60">
            Culture doesn&apos;t disappear. It moves.
          </p>
        </div>
      </div>
    </footer>
  );
}
