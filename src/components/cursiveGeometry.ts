import * as THREE from "three";
import * as opentype from "opentype.js";

// Build an extruded 3D geometry for a word using a real cursive TTF, so we get
// true connected handwriting outlines (Text3D can only use typeface JSON).
// Outlines come from opentype.js; counters (the holes in e/o/l) are resolved by
// three's ShapePath.toShapes — the same path FontLoader uses for glyphs.

// Shipped fallback if the requested font 404s (e.g. the local rounded test font
// isn't committed) — keeps the glass from breaking on a fresh checkout / deploy.
const FALLBACK_FONT = "/fonts/DancingScript.ttf";

async function loadFont(url: string): Promise<opentype.Font> {
  let res = await fetch(url);
  if (!res.ok && url !== FALLBACK_FONT) res = await fetch(FALLBACK_FONT);
  const buffer = await res.arrayBuffer();
  // opentype 2.x: `parse` is the supported API, but the export name varies
  // between the CJS/ESM builds bundlers pick (`parse` vs `_parse`). Resolve it
  // defensively and never call the deprecated `load`.
  const ot = opentype as unknown as Record<string, unknown> & { default?: Record<string, unknown> };
  const parse = (ot.parse ?? ot._parse ?? ot.default?.parse ?? ot.default?._parse) as
    | ((b: ArrayBuffer) => opentype.Font)
    | undefined;
  if (typeof parse !== "function") throw new Error("opentype parse unavailable");
  return parse(buffer);
}

export async function buildCursiveGeometry(
  url: string,
  // May contain "\n" for stacked lines; each line is centred horizontally.
  word: string,
  reduced: boolean
): Promise<THREE.ExtrudeGeometry> {
  const font = await loadFont(url);
  const unit = 100;
  const lines = word.split("\n");
  // Tight line stacking so the lines crowd/overlap a little (haoqi-style).
  const lineHeight = unit * 1.06;

  // Justify every line to the widest one so the block's left and right edges line
  // up (两边对齐); narrower lines stretch wider, reading as more connected.
  const measured = lines.map((line) => ({ line, width: font.getAdvanceWidth(line, unit) || 1 }));
  const W = Math.max(...measured.map((m) => m.width));

  const shapePath = new THREE.ShapePath();
  measured.forEach(({ line, width }, i) => {
    const xs = W / width; // horizontal justify scale for this line
    const fx = (x: number) => x * xs - W / 2;
    // Stack downward (font coords are y-down; flipped upright afterwards).
    const path = font.getPath(line, 0, i * lineHeight, unit);
    for (const cmd of path.commands) {
      switch (cmd.type) {
        case "M":
          shapePath.moveTo(fx(cmd.x), cmd.y);
          break;
        case "L":
          shapePath.lineTo(fx(cmd.x), cmd.y);
          break;
        case "Q":
          shapePath.quadraticCurveTo(fx(cmd.x1), cmd.y1, fx(cmd.x), cmd.y);
          break;
        case "C":
          shapePath.bezierCurveTo(fx(cmd.x1), cmd.y1, fx(cmd.x2), cmd.y2, fx(cmd.x), cmd.y);
          break;
        // 'Z' closes the current sub-path automatically.
      }
    }
  });

  const shapes = shapePath.toShapes(true);

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: unit * 0.2,
    bevelEnabled: true,
    // Fatter bevel rounds the thin strokes into inflated, liquid-looking tubes.
    bevelThickness: unit * 0.03,
    bevelSize: unit * 0.02,
    bevelSegments: reduced ? 2 : 4,
    curveSegments: reduced ? 6 : 11
  });

  // Font coords are y-down; flip to upright, then centre and normalise height.
  geo.scale(1, -1, 1);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const height = bb.max.y - bb.min.y || 1;
  const target = 2.3;
  const s = target / height;
  geo.center();
  geo.scale(s, s, s);
  geo.computeVertexNormals();
  return geo;
}
