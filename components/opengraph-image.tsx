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
 * Les couleurs sont écrites en clair plutôt qu'en classes utilitaires : le
 * moteur de rendu des vignettes ne connaît que la palette par défaut de
 * Tailwind, pas nos jetons. C'est le seul endroit du site où une valeur se
 * recopie à la main — et elle avait dérivé : la vignette est restée à
 * l'ivoire, la terre et l'or de la charte précédente pendant que le reste
 * passait au neutre. Elle est la surface qu'on ne voit jamais en naviguant,
 * donc jamais pendant une relecture. À resynchroniser avec le bloc `:root`
 * de `globals.css` à chaque changement de palette.
 */
const FOND = "#050505";
const TEXTE = "#f5f5f5";
const SECONDAIRE = "#a0a0a0";
const FILET = "rgba(255, 255, 255, 0.35)";

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
          backgroundColor: FOND,
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
              border: `1px solid ${FILET}`,
            }}
          >
            <LogoIcon width="48" height="44" fill={TEXTE} />
          </div>
          <p
            style={{
              fontSize: "26px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: TEXTE,
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
              color: TEXTE,
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
              backgroundColor: FILET,
            }}
          />
          <p
            style={{
              marginTop: "28px",
              fontSize: "24px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: SECONDAIRE,
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
