"use client";

import { useConsentement } from "components/analytics/consentement";
import { PIXEL_META, suivreMeta, viderAttenteMeta } from "lib/meta-pixel";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** L'adresse du script de Meta. Une constante, pour qu'elle se cherche. */
const SCRIPT_META = "https://connect.facebook.net/en_US/fbevents.js";

/**
 * Installe la file d'attente `fbq` avant que le script n'arrive.
 *
 * C'est l'amorce officielle de Meta, réécrite lisiblement. Son intérêt
 * n'est pas cosmétique : `fbevents.js` met plusieurs centaines de
 * millisecondes à se charger, et les appels passés entre-temps seraient
 * perdus sans cette file. `fbq` est donc d'abord une fonction qui empile,
 * puis le script la remplace par celle qui envoie et rejoue la pile.
 */
function amorcerFbq() {
  if (window.fbq) return;

  const file: unknown[] = [];
  const fbq = function (...args: unknown[]) {
    const methode = (fbq as unknown as { callMethod?: Function }).callMethod;
    if (methode) methode.apply(fbq, args);
    else file.push(args);
  } as unknown as Window["fbq"] & Record<string, unknown>;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = file;

  window.fbq = fbq as Window["fbq"];
  if (!window._fbq) window._fbq = window.fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = SCRIPT_META;
  document.head.appendChild(script);
}

/**
 * Le pixel Meta.
 *
 * Deux conditions, et les deux sont bloquantes :
 *
 * - **le consentement.** Tant qu'il ne vaut pas « accepte », ce composant ne
 *   charge rien et n'envoie rien. Pas de script tenu en réserve, pas
 *   d'événement mis de côté en attendant : le script de Meta n'est même pas
 *   demandé. C'est ce que veut dire « consentement préalable ».
 * - **l'identifiant.** Absent, il n'y a pas de pixel à alimenter.
 *
 * La vue de page est suivie au changement de chemin, et pas au changement de
 * paramètres d'URL. La distinction compte ici : choisir une taille ou une
 * couleur sur une fiche produit réécrit la requête (`?color=…&size=…`) sans
 * changer de page. Compter ces réécritures gonflerait les vues de deux à
 * trois fois sur les fiches, c'est-à-dire exactement là où la mesure sert.
 */
export function MetaPixel() {
  const consentement = useConsentement();
  const chemin = usePathname();

  const charge = useRef(false);
  const dernierChemin = useRef<string | null>(null);

  // Premier chargement, une fois le consentement donné.
  useEffect(() => {
    if (consentement !== "accepte" || !PIXEL_META || charge.current) return;

    charge.current = true;
    amorcerFbq();
    window.fbq?.("init", PIXEL_META);
    suivreMeta("PageView");
    // Puis ce qui attendait : la vue de la fiche depuis laquelle le
    // visiteur vient d'accepter, le plus souvent. `PageView` passe en
    // premier, comme Meta l'attend.
    viderAttenteMeta();
    dernierChemin.current = chemin;
  }, [consentement, chemin]);

  // Navigations suivantes. Le garde sur `dernierChemin` évite de compter
  // deux fois la page sur laquelle le consentement vient d'être donné.
  useEffect(() => {
    if (!charge.current || dernierChemin.current === chemin) return;
    dernierChemin.current = chemin;
    suivreMeta("PageView");
  }, [chemin]);

  return null;
}
