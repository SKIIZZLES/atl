import { redirect } from "next/navigation";

/**
 * Le manifeste vivait à /stories avant d'avoir son nom. L'adresse a circulé —
 * en-tête, pied de page, liens partagés — donc elle redirige au lieu de
 * rendre un 404. Redirection permanente : c'est un changement d'adresse
 * définitif, pas un aiguillage temporaire.
 */
export default function StoriesRedirect() {
  redirect("/manifeste");
}
