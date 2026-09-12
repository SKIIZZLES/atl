"use client";

import { useConsentement } from "components/analytics/consentement";
import { useEffect } from "react";

declare global {
  interface Window {
    /** Posée par le fragment GA4 du gabarit, en balise brute. */
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Le mode consentement de Google, côté « mise à jour ».
 *
 * Le côté « défaut » est écrit dans le `<head>` du gabarit, et il refuse
 * tout. Il doit y être parce qu'il doit précéder le `config` de GA4 : posé
 * après, il arriverait trop tard pour empêcher le premier dépôt de cookie,
 * ce qui est exactement ce qu'il sert à empêcher.
 *
 * Ce composant ne fait que l'autre moitié : lever le refus quand le visiteur
 * accepte. Le refus, lui, n'a rien à lever — il est déjà l'état par défaut.
 *
 * `window.gtag` est appelée plutôt que redéfinie. La fonction du gabarit
 * empile l'objet `arguments` tel quel dans `dataLayer`, et Google le relit
 * sous cette forme précise ; une réécriture qui empilerait un tableau
 * passerait sans la moindre erreur et ne serait jamais interprétée.
 *
 * À noter : GA4 continue de mesurer sans cookie quand le consentement est
 * refusé — pas de visiteur unique, pas de parcours, mais un volume. C'est la
 * raison de passer par le mode consentement plutôt que de retenir le script
 * entier comme on le fait pour le pixel Meta, lequel n'a pas d'équivalent
 * sans cookie.
 */
export function GoogleConsentement() {
  const consentement = useConsentement();

  useEffect(() => {
    if (consentement !== "accepte") return;

    window.gtag?.("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  }, [consentement]);

  return null;
}
