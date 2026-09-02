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
      <WaveDivider color="var(--indigo)" />
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg uppercase tracking-tight">
              Onde Noire
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Ils ont transformé les vêtements en produits. Nous les voyons
              comme des archives.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
            <nav aria-label="Collections" className="flex flex-col gap-4">
              <span className="label-xs text-muted-foreground/60">
                Collections
              </span>
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
                Maison
              </span>
              <Link
                href="/#manifeste"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Manifeste
              </Link>
              <Link
                href="/#archive"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Archive
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Onde Noire
          </p>
          <p className="label-xs text-muted-foreground/60">
            Culture × Design × Transmission
          </p>
        </div>
      </div>
    </footer>
  );
}
