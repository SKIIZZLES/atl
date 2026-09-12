"use client";

import { Consent, ecrireConsentement, lireConsentement } from "lib/consent";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const ConsentementContext = createContext<Consent>("inconnu");

/**
 * L'état du consentement, pour qui doit en dépendre.
 *
 * Vaut « inconnu » tant que le stockage n'a pas été relu — c'est-à-dire
 * pendant le rendu serveur et le premier rendu client. Les traceurs lisent
 * cette valeur : tant qu'elle n'est pas « accepte », rien ne part.
 */
export function useConsentement() {
  return useContext(ConsentementContext);
}

/**
 * Le fournisseur, et le bandeau qu'il porte.
 *
 * Les deux sont dans le même composant parce qu'ils partagent exactement un
 * état et que les séparer imposerait un second contexte pour la seule
 * fonction « répondre ». Le bandeau est le seul endroit d'où cette fonction
 * est appelée.
 */
export function FournisseurConsentement({ children }: { children: ReactNode }) {
  const [consentement, setConsentement] = useState<Consent>("inconnu");
  // Le stockage n'existe pas au rendu serveur. Tant qu'on ne l'a pas relu,
  // on ne sait pas s'il faut afficher le bandeau — et afficher un bandeau
  // que le serveur n'a pas rendu produirait une discordance d'hydratation.
  const [relu, setRelu] = useState(false);

  useEffect(() => {
    setConsentement(lireConsentement());
    setRelu(true);
  }, []);

  const repondre = useCallback((choix: "accepte" | "refuse") => {
    ecrireConsentement(choix);
    setConsentement(choix);
  }, []);

  return (
    <ConsentementContext.Provider value={consentement}>
      {children}
      {relu && consentement === "inconnu" ? (
        <Bandeau onRepondre={repondre} />
      ) : null}
    </ConsentementContext.Provider>
  );
}

/**
 * Le bandeau.
 *
 * Deux règles le gouvernent, et elles viennent de la CNIL, pas du goût :
 *
 * 1. **Refuser doit être aussi simple qu'accepter.** Pas de « accepter » en
 *    aplat blanc face à un « paramétrer » en lien gris : les deux boutons
 *    ont la même forme, la même taille et le même poids typographique. Un
 *    refus se fait en un clic, comme une acceptation.
 * 2. **Rien ne se déclenche avant la réponse.** C'est le
 *    `FournisseurConsentement` qui le garantit, pas ce composant : les
 *    traceurs lisent l'état et restent inertes tant qu'il vaut « inconnu ».
 *
 * Il ne bloque pas la page. Un mur de consentement n'est pas exigé, et il
 * coûterait à un site dont la première impression est une photographie
 * plein écran. Le contenu reste lisible, le bandeau attend en bas.
 */
function Bandeau({
  onRepondre,
}: {
  onRepondre: (choix: "accepte" | "refuse") => void;
}) {
  const BOUTON =
    "type-button flex h-12 flex-1 items-center justify-center border transition-colors duration-300 ease-onde md:h-11 md:flex-none md:px-8";

  return (
    <div
      role="region"
      aria-label="Consentement aux cookies de mesure"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm"
      /* Le fond en style en ligne pour la même raison qu'ailleurs dans ce
         site : une classe de fond n'existe que si la feuille de style est
         arrivée, et un bandeau translucide sur rien serait illisible. */
      style={{ backgroundColor: "var(--background, #000000)" }}
    >
      <div className="shell flex flex-col gap-5 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:py-6">
        <p className="type-caption max-w-2xl text-muted-foreground">
          Nous utilisons des cookies de mesure d&apos;audience pour comprendre
          comment le site est parcouru. Rien n&apos;est déposé sans votre
          accord, et votre choix se modifie à tout moment depuis la{" "}
          <Link
            href="/politiques/confidentialite"
            className="text-foreground underline underline-offset-4 transition-opacity duration-300 ease-onde hover:opacity-70"
          >
            politique de confidentialité
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => onRepondre("refuse")}
            className={`${BOUTON} border-border-control text-foreground hover:bg-hover`}
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => onRepondre("accepte")}
            className={`${BOUTON} border-foreground bg-foreground text-background hover:opacity-90`}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
