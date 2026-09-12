"use client";

import { useConsentement } from "components/analytics/consentement";
import { ecrireConsentement } from "lib/consent";

/**
 * Le réglage du consentement, dans la politique de confidentialité.
 *
 * Il existe parce que le bandeau le promet — « votre choix se modifie à
 * tout moment » — et qu'une promesse d'interface qui n'est tenue nulle part
 * est un mensonge, avant d'être un manquement. La CNIL demande d'ailleurs
 * qu'un consentement soit retirable aussi simplement qu'il a été donné.
 *
 * Le rechargement après un changement n'est pas un raccourci. Le pixel Meta
 * est un script tiers : une fois `fbevents.js` chargé, rien dans cette page
 * ne peut le décharger, et se contenter de changer l'état laisserait tourner
 * ce qu'on vient de refuser. Recharger est la seule façon honnête de
 * repartir d'un document où il n'a jamais été demandé.
 */
export function ChoixCookies() {
  const consentement = useConsentement();

  const changer = (choix: "accepte" | "refuse") => {
    ecrireConsentement(choix);
    window.location.reload();
  };

  const etat =
    consentement === "accepte"
      ? "Vous avez accepté les cookies de mesure d'audience."
      : consentement === "refuse"
        ? "Vous avez refusé les cookies de mesure d'audience."
        : "Vous n'avez pas encore fait de choix. Aucun cookie de mesure n'est déposé.";

  const BOUTON =
    "type-button flex h-12 items-center justify-center border px-8 transition-colors duration-300 ease-onde";

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="type-h3">Vos préférences de mesure</h2>
      <p className="type-body mt-4 text-muted-foreground">{etat}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => changer("refuse")}
          disabled={consentement === "refuse"}
          className={`${BOUTON} border-border-control text-foreground hover:bg-hover disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent`}
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => changer("accepte")}
          disabled={consentement === "accepte"}
          className={`${BOUTON} border-foreground bg-foreground text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40`}
        >
          Accepter
        </button>
      </div>
    </section>
  );
}
