/**
 * Le consentement aux traceurs, et rien d'autre.
 *
 * Ce fichier ne contient ni composant ni effet : seulement la forme de la
 * décision et la façon de la relire. Le pixel Meta, Google Analytics et le
 * bandeau s'appuient tous les trois dessus, et aucun des trois n'a à savoir
 * comment les deux autres s'en servent.
 *
 * Trois états, pas deux. « Pas encore répondu » n'est pas « refusé » : le
 * premier laisse le bandeau ouvert, le second le referme pour de bon. Les
 * confondre ferait réapparaître la question à chaque page à quelqu'un qui a
 * déjà dit non.
 */
export type Consent = "inconnu" | "accepte" | "refuse";

/**
 * La clé de stockage porte un numéro de version.
 *
 * Le consentement couvre une liste de traceurs donnée. Le jour où cette
 * liste s'allonge — une régie de plus, un outil de mesure de plus — la
 * décision prise sur l'ancienne liste ne vaut plus pour la nouvelle, et la
 * CNIL demande alors de reposer la question. Incrémenter ce numéro suffit :
 * les anciennes réponses ne sont plus lues, le bandeau revient.
 */
export const CLE_CONSENTEMENT = "onde-noire.consentement.v1";

/**
 * La durée de validité, en jours.
 *
 * La CNIL recommande de ne pas conserver le choix au-delà de six mois et de
 * redemander ensuite. C'est une recommandation, pas une obligation, mais
 * elle est gratuite à respecter.
 */
export const VALIDITE_JOURS = 182;

type Enregistrement = {
  choix: Exclude<Consent, "inconnu">;
  /** Date ISO du choix, qui sert à le faire expirer. */
  date: string;
};

/**
 * Relit le choix stocké.
 *
 * Tout est enveloppé : `localStorage` lève en navigation privée sur certains
 * navigateurs et quand les données de site sont bloquées. Un traceur qui
 * fait tomber la page pour cette raison serait un défaut bien plus grave
 * que le traceur lui-même. En cas de doute, on répond « inconnu » — c'est
 * l'état qui ne déclenche rien.
 */
export function lireConsentement(): Consent {
  if (typeof window === "undefined") return "inconnu";

  try {
    const brut = window.localStorage.getItem(CLE_CONSENTEMENT);
    if (!brut) return "inconnu";

    const enregistrement = JSON.parse(brut) as Partial<Enregistrement>;
    if (enregistrement.choix !== "accepte" && enregistrement.choix !== "refuse")
      return "inconnu";

    const pose = Date.parse(enregistrement.date ?? "");
    if (Number.isNaN(pose)) return "inconnu";

    const age = (Date.now() - pose) / 86_400_000;
    if (age > VALIDITE_JOURS) return "inconnu";

    return enregistrement.choix;
  } catch {
    return "inconnu";
  }
}

/** Écrit le choix. Un échec d'écriture ne doit pas casser la page non plus. */
export function ecrireConsentement(choix: Exclude<Consent, "inconnu">) {
  try {
    const enregistrement: Enregistrement = {
      choix,
      date: new Date().toISOString(),
    };
    window.localStorage.setItem(
      CLE_CONSENTEMENT,
      JSON.stringify(enregistrement),
    );
  } catch {
    // Le choix vaudra pour cette visite seulement. C'est dégradé, pas cassé.
  }
}
