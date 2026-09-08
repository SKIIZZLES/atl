import { WaveDivider } from "components/wave-divider";
import { POLICY_LABELS } from "lib/policies";
import { getShopPolicies } from "lib/shopify";
import type { PolicySlug } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

type NavCollection = { handle: string; title: string };

/**
 * Les politiques sont réparties en deux colonnes plutôt qu'en une seule :
 * livraison et retours répondent à une question avant l'achat, les mentions
 * légales à une obligation. Elles n'ont rien à faire au même endroit.
 */
const HELP_SLUGS: PolicySlug[] = ["livraison", "remboursement"];
const LEGAL_SLUGS: PolicySlug[] = [
  "mentions-legales",
  "conditions-generales",
  "confidentialite",
];

const LINK_CLASS =
  "type-body text-sm text-muted-foreground transition-colors duration-300 ease-onde hover:text-foreground";

export default async function Footer({
  collections,
}: {
  collections: NavCollection[];
}) {
  // Only the policies the merchant has actually written are linked — a dead
  // "Livraison" link is worse than no link on a shop taking real orders.
  const policies = await getShopPolicies();
  const help = HELP_SLUGS.filter((slug) => policies[slug]);
  const legal = LEGAL_SLUGS.filter((slug) => policies[slug]);

  return (
    <footer>
      <WaveDivider color="var(--brass)" />
      <div className="shell py-16 md:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            {/* Le lockup complet — monogramme, lettrage, signature — a la place
                de respirer ici. Son fond noir se confond avec le bloc brun. */}
            <Image
              src="https://cdn.shopify.com/s/files/1/1088/9438/8549/files/Image_Codex_5_sept._2026_14_56_18.png?v=1788613997"
              alt="Onde Noire — mémoire, culture, avenir"
              width={224}
              height={224}
              sizes="(min-width: 768px) 224px, 176px"
              className="h-auto w-44 md:w-56"
            />
            <p className="type-label mt-6 text-muted-foreground">
              Culture in motion
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
            <nav aria-label="Shop" className="flex flex-col gap-4">
              <span className="type-label text-muted-foreground/60">Shop</span>
              {collections.map((collection) => (
                <Link
                  key={collection.handle}
                  href={`/collections/${collection.handle}`}
                  className={LINK_CLASS}
                >
                  {collection.title}
                </Link>
              ))}
              <Link href="/collections" className={LINK_CLASS}>
                Toutes les collections
              </Link>
              <Link href="/search" className={LINK_CLASS}>
                Toutes les pièces
              </Link>
            </nav>

            <nav aria-label="Aide" className="flex flex-col gap-4">
              <span className="type-label text-muted-foreground/60">Aide</span>
              {help.map((slug) => (
                <Link
                  key={slug}
                  href={`/politiques/${slug}`}
                  className={LINK_CLASS}
                >
                  {POLICY_LABELS[slug]}
                </Link>
              ))}
              <Link href="/contact" className={LINK_CLASS}>
                Contact
              </Link>
            </nav>

            <div className="flex flex-col gap-4">
              <span className="type-label text-muted-foreground/60">
                Maison
              </span>
              <Link href="/manifeste" className={LINK_CLASS}>
                Manifeste
              </Link>
              <Link href="/journal" className={LINK_CLASS}>
                Journal
              </Link>
              <Link href="/a-propos" className={LINK_CLASS}>
                À propos
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="type-label text-muted-foreground/60">
                Réseaux
              </span>
              <a
                href="https://instagram.com/onde.noire"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@le88emeecho"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-label text-muted-foreground/60">
            © {new Date().getFullYear()} Onde Noire
          </p>
          {legal.length > 0 ? (
            <nav
              aria-label="Informations légales"
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {legal.map((slug) => (
                <Link
                  key={slug}
                  href={`/politiques/${slug}`}
                  className="type-label text-muted-foreground/60 transition-colors duration-300 ease-onde hover:text-foreground"
                >
                  {POLICY_LABELS[slug]}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
