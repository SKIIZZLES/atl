import { WaveDivider } from "components/wave-divider";
import { POLICY_LABELS } from "lib/policies";
import { getShopPolicies } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

type NavCollection = { handle: string; title: string };

export default async function Footer({
  collections,
}: {
  collections: NavCollection[];
}) {
  // Only the policies the merchant has actually written are linked — a dead
  // "Livraison" link is worse than no link on a shop taking real orders.
  const policies = await getShopPolicies();

  return (
    <footer>
      <WaveDivider color="var(--brass)" />
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
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
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
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

            <nav
              aria-label="Informations légales"
              className="flex flex-col gap-4"
            >
              <span className="label-xs text-muted-foreground/60">Légal</span>
              {Object.entries(policies).map(([handle, policy]) =>
                policy ? (
                  <Link
                    key={handle}
                    href={`/politiques/${handle}`}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {POLICY_LABELS[handle as keyof typeof POLICY_LABELS]}
                  </Link>
                ) : null,
              )}
            </nav>

            <div className="flex flex-col gap-4">
              <span className="label-xs text-muted-foreground/60">Réseaux</span>
              <a
                href="https://instagram.com/onde.noire"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@le88emeecho"
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
