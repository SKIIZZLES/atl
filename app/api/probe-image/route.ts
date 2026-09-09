/**
 * OUTIL DE DIAGNOSTIC TEMPORAIRE — À SUPPRIMER APRÈS USAGE.
 *
 * L'environnement qui écrit ce code n'a aucun accès sortant vers
 * `cdn.shopify.com` : aucune image du catalogue n'a jamais pu y être ouverte.
 * Poser un logo dans un header noir sans savoir si le tracé est clair ou
 * sombre reproduirait exactement la panne qui revient depuis le début du
 * projet — un élément bien présent dans le HTML, et invisible à l'œil.
 *
 * Le déploiement, lui, atteint le CDN. Cette route relaie donc UNE vignette
 * du fichier logo, et une seule — l'adresse est écrite ici, elle ne vient
 * pas de la requête : une route qui relaierait une URL fournie par l'appelant
 * serait un proxy ouvert, fût-elle temporaire.
 *
 * La vignette repart en base64, c'est-à-dire en texte : c'est le seul format
 * qui traverse le proxy sans être abîmé. L'analyse des pixels se fait ensuite
 * en local.
 */

const LOGO =
  "https://cdn.shopify.com/s/files/1/1088/9438/8549/files/Image_Codex_9_sept._2026_11_13_22.png?v=1788945306&width=96";

export const dynamic = "force-dynamic";

export async function GET() {
  const upstream = await fetch(LOGO, { cache: "no-store" });
  if (!upstream.ok) {
    return Response.json(
      { error: "upstream", status: upstream.status },
      { status: 502 },
    );
  }

  const bytes = Buffer.from(await upstream.arrayBuffer());
  return Response.json({
    contentType: upstream.headers.get("content-type"),
    bytes: bytes.byteLength,
    base64: bytes.toString("base64"),
  });
}
