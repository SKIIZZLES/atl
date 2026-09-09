import { inflateSync } from "node:zlib";

/**
 * OUTIL DE DIAGNOSTIC TEMPORAIRE — À SUPPRIMER APRÈS USAGE.
 *
 * L'environnement qui écrit ce code n'a aucun accès sortant vers
 * `cdn.shopify.com` : aucune image du catalogue n'a jamais pu y être ouverte.
 * Poser un logo dans un header noir sans savoir si le tracé est clair ou
 * sombre reproduirait exactement la panne qui revient depuis le début du
 * projet — un élément bien présent dans le HTML, et invisible à l'œil.
 *
 * Le déploiement, lui, atteint le CDN. Cette route lit donc UNE vignette du
 * fichier logo, et une seule : l'adresse est écrite ici, elle ne vient pas de
 * la requête. Une route qui relaierait une URL fournie par l'appelant serait
 * un proxy ouvert, fût-elle temporaire.
 *
 * Elle renvoie des nombres, pas l'image : la mesure se fait ici, du côté qui
 * a les octets. Renvoyer l'image en base64 aurait obligé à la recopier à la
 * main dans l'analyse locale, et une recopie de huit kilo-octets est une
 * source d'erreur, pas une preuve.
 */

const LOGO =
  "https://cdn.shopify.com/s/files/1/1088/9438/8549/files/Image_Codex_9_sept._2026_11_13_22.png?v=1788945306&width=96";

export const dynamic = "force-dynamic";

/** Luminance relative WCAG. */
function relLum(r: number, g: number, b: number) {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function paeth(a: number, b: number, c: number) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/**
 * Décodeur PNG minimal : 8 bits par canal, non entrelacé. Suffisant pour la
 * vignette que sert le CDN, et ça évite d'embarquer une dépendance pour une
 * route qui ne vivra qu'une heure.
 */
function decodePng(file: Buffer) {
  let pos = 8; // signature
  let width = 0;
  let height = 0;
  let depth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat: Buffer[] = [];
  let palette: Buffer | null = null;
  let trns: Buffer | null = null;

  while (pos < file.length) {
    const length = file.readUInt32BE(pos);
    const type = file.toString("ascii", pos + 4, pos + 8);
    const body = file.subarray(pos + 8, pos + 8 + length);
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      depth = body[8]!;
      colorType = body[9]!;
      interlace = body[12]!;
    } else if (type === "PLTE") palette = Buffer.from(body);
    else if (type === "tRNS") trns = Buffer.from(body);
    else if (type === "IDAT") idat.push(Buffer.from(body));
    else if (type === "IEND") break;
    pos += 12 + length;
  }

  if (depth !== 8 || interlace !== 0) {
    throw new Error(`png non géré : depth=${depth} interlace=${interlace}`);
  }

  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`png non géré : colorType=${colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]!;
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[y * stride + x - channels]! : 0;
      const b = y > 0 ? out[(y - 1) * stride + x]! : 0;
      const c =
        x >= channels && y > 0 ? out[(y - 1) * stride + x - channels]! : 0;
      const value = line[x]!;
      let restored: number;
      if (filter === 0) restored = value;
      else if (filter === 1) restored = value + a;
      else if (filter === 2) restored = value + b;
      else if (filter === 3) restored = value + ((a + b) >> 1);
      else restored = value + paeth(a, b, c);
      out[y * stride + x] = restored & 0xff;
    }
  }

  // Ramène tout en RGBA, quel que soit le type de couleur d'origine.
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * channels;
    let r: number, g: number, b: number, alpha: number;
    if (colorType === 0) {
      r = g = b = out[s]!;
      alpha = 255;
    } else if (colorType === 4) {
      r = g = b = out[s]!;
      alpha = out[s + 1]!;
    } else if (colorType === 2) {
      r = out[s]!;
      g = out[s + 1]!;
      b = out[s + 2]!;
      alpha = 255;
    } else if (colorType === 6) {
      r = out[s]!;
      g = out[s + 1]!;
      b = out[s + 2]!;
      alpha = out[s + 3]!;
    } else {
      const index = out[s]!;
      r = palette![index * 3]!;
      g = palette![index * 3 + 1]!;
      b = palette![index * 3 + 2]!;
      alpha = trns && index < trns.length ? trns[index]! : 255;
    }
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = alpha;
  }

  return { width, height, colorType, rgba };
}

export async function GET() {
  const upstream = await fetch(LOGO, { cache: "no-store" });
  if (!upstream.ok) {
    return Response.json(
      { error: "upstream", status: upstream.status },
      { status: 502 },
    );
  }

  const file = Buffer.from(await upstream.arrayBuffer());

  let png;
  try {
    png = decodePng(file);
  } catch (error) {
    return Response.json(
      {
        error: String(error),
        contentType: upstream.headers.get("content-type"),
        bytes: file.byteLength,
      },
      { status: 500 },
    );
  }

  const { width, height, colorType, rgba } = png;
  const buckets = new Map<string, number>();
  let transparent = 0;
  let semi = 0;
  let visible = 0;
  let dark = 0;
  let light = 0;
  let lumSum = 0;

  for (let i = 0; i < rgba.length; i += 4) {
    const a = rgba[i + 3]!;
    if (a === 0) {
      transparent++;
      continue;
    }
    if (a < 250) semi++;
    const r = rgba[i]!;
    const g = rgba[i + 1]!;
    const b = rgba[i + 2]!;
    buckets.set(
      `${r >> 4},${g >> 4},${b >> 4}`,
      (buckets.get(`${r >> 4},${g >> 4},${b >> 4}`) || 0) + 1,
    );
    const l = relLum(r, g, b);
    lumSum += l;
    visible++;
    if (l < 0.05) dark++;
    else if (l > 0.5) light++;
  }

  const pixel = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    return [rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]];
  };

  const dominants = [...buckets.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6)
    .map(([key, count]) => {
      const [r, g, b] = key.split(",").map((v) => (Number(v) << 4) + 8) as [
        number,
        number,
        number,
      ];
      const l = relLum(r, g, b);
      return {
        hex: `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`,
        part: `${((count / visible) * 100).toFixed(1)} %`,
        contrasteSurNoir: `${((l + 0.05) / 0.05).toFixed(2)}:1`,
      };
    });

  return Response.json({
    contentType: upstream.headers.get("content-type"),
    bytes: file.byteLength,
    taille: [width, height],
    ratio: (width / height).toFixed(3),
    colorType,
    pixels: width * height,
    transparents: transparent,
    semiTransparents: semi,
    partSombre: `${((dark / visible) * 100).toFixed(1)} %`,
    partClaire: `${((light / visible) * 100).toFixed(1)} %`,
    luminanceMoyenne: (lumSum / visible).toFixed(4),
    coins: {
      hg: pixel(0, 0),
      hd: pixel(width - 1, 0),
      bg: pixel(0, height - 1),
      bd: pixel(width - 1, height - 1),
    },
    centre: pixel(width >> 1, height >> 1),
    dominants,
  });
}
