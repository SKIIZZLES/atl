import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "components/contact/contact-form";
import { EditorialTitle } from "components/ui/editorial-title";
import { SectionLabel } from "components/ui/section-label";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à Onde Noire : commandes, presse, collaborations. Maison de création indépendante basée à Bourg-en-Bresse.",
};

export default function ContactPage() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  return (
    <div className="below-header mx-auto max-w-3xl px-5 pb-24 md:px-10 md:pb-32">
      <SectionLabel tone="muted">Contact</SectionLabel>
      <EditorialTitle level="h1" as="h1" className="mt-6">
        Écrire à la maison
      </EditorialTitle>
      <p className="type-body mt-8 max-w-xl text-muted-foreground">
        Une question sur une commande, un projet presse, une collaboration :
        laissez un message. On lit tout, et on répond depuis l&apos;atelier à
        Bourg-en-Bresse.
      </p>

      <div className="mt-12">
        {domain ? (
          <ContactForm domain={domain} />
        ) : (
          <p className="type-body text-muted-foreground">
            Le formulaire est temporairement indisponible. Écrivez-nous sur{" "}
            <a
              href="https://instagram.com/onde.noire"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              Instagram
            </a>
            .
          </p>
        )}
      </div>

      <div className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-2">
        <div>
          <p className="type-label text-foreground">Atelier</p>
          <p className="type-body mt-3 text-muted-foreground">
            Bourg-en-Bresse, Ain
            <br />
            France
          </p>
        </div>
        <div>
          <p className="type-label text-foreground">Réseaux</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href="https://instagram.com/onde.noire"
                target="_blank"
                rel="noopener noreferrer"
                className="type-body text-muted-foreground transition-colors hover:text-foreground"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@le88emeecho"
                target="_blank"
                rel="noopener noreferrer"
                className="type-body text-muted-foreground transition-colors hover:text-foreground"
              >
                TikTok
              </a>
            </li>
            <li>
              <Link
                href="/a-propos"
                className="type-body text-muted-foreground transition-colors hover:text-foreground"
              >
                À propos de la maison
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
