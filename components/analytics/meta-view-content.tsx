"use client";

import { useConsentement } from "components/analytics/consentement";
import { contenuMeta, suivreMeta } from "lib/meta-pixel";
import { useEffect, useRef } from "react";

/**
 * `ViewContent` : une fiche produit a été consultée.
 *
 * Rendu depuis la fiche, qui est un composant serveur — d'où ce passage par
 * des propriétés simples plutôt qu'un objet `Product` entier : il n'y a
 * aucune raison de sérialiser une description et vingt images vers le
 * navigateur pour envoyer cinq champs.
 *
 * La variante retenue est la première du produit. Au chargement de la page
 * aucune taille n'est encore choisie, et il faut pourtant un identifiant qui
 * corresponde à un article du catalogue Meta — lequel est indexé par
 * variante. `AddToCart`, lui, enverra la variante réellement choisie.
 *
 * L'attente du consentement est explicite, et pas déléguée au silence de
 * `suivreMeta`. La différence se voit chez un visiteur qui parcourt cinq
 * fiches avant d'accepter : envoyer sans condition remplirait la file
 * d'attente de cinq vues périmées, qui partiraient toutes d'un coup au
 * moment du clic sur « Accepter ». Cinq pièces vues à la même seconde, dont
 * quatre qu'il a quittées depuis longtemps.
 *
 * Le garde sur `envoye` couvre le reste : le double montage du mode strict
 * en développement, et un éventuel nouveau rendu du contexte.
 */
export function MetaViewContent(contenu: Parameters<typeof contenuMeta>[0]) {
  const consentement = useConsentement();
  const envoye = useRef(false);

  useEffect(() => {
    if (consentement !== "accepte" || envoye.current) return;
    envoye.current = true;
    suivreMeta("ViewContent", contenuMeta(contenu));
    // `contenu` décrit la page : il ne change pas sans qu'elle change, et
    // une navigation vers une autre fiche monte un composant neuf.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consentement]);

  return null;
}
