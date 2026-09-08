import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import LogoIcon from "./icons/logo";

export type Props = {
  title?: string;
};

/**
 * La vignette qui accompagne un lien partagé — donc, très souvent, la
 * première image que quelqu'un voit du site.
 *
 * Elle était restée au gabarit d'origine : noir pur, contour gris neutre,
 * angles arrondis, texte blanc, Inter. Cinq écarts avec la charte, sur la
 * seule surface qu'on ne voit jamais en naviguant — donc jamais pendant une
 * relecture.
 *
 * Les couleurs sont écrites en clair plutôt qu'en classes utilitaires :
 * le moteur de rendu des vignettes ne connaît que la palette par défaut de
 * Tailwind, pas nos jetons. Ce sont les mêmes valeurs, à tenir à jour avec
 * la feuille de style.
 */
const NOIR = "#0a0a0a";
const IVOIRE = "#e8e2d6";
const TERRE = "#755c45";
const OR = "#c8942e";

export default async function OpengraphImage(
  props?: Props,
): Promise<ImageResponse> {
  // `SITE_NAME` vient de l'environnement ; s'il manque, la vignette
  // n'affiche plus qu'un aplat noir. Le nom de la maison est le repli, pas
  // le vide.
  const title = props?.title || process.env.SITE_NAME || "Onde Noire";

  const file = await readFile(
    join(process.cwd(), "./fonts/Fraunces-SemiBold.ttf"),
  );
  const font = Uint8Array.from(file).buffer;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: NOIR,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {/* Un carré, pas un cercle aux angles arrondis : la marque n'a
              pas de rayon. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "104px",
              width: "104px",
              border: `1px solid ${TERRE}`,
            }}
          >
            <LogoIcon width="48" height="44" fill={IVOIRE} />
          </div>
          <p
            style={{
              fontSize: "26px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: IVOIRE,
            }}
          >
            Onde Noire®
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: "68px",
              lineHeight: 1.05,
              color: IVOIRE,
              margin: 0,
            }}
          >
            {title}
          </p>
          <div
            style={{
              display: "flex",
              marginTop: "36px",
              height: "1px",
              width: "180px",
              backgroundColor: OR,
            }}
          />
          <p
            style={{
              marginTop: "28px",
              fontSize: "24px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: OR,
            }}
          >
            Culture in motion
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Fraunces",
          data: font,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
