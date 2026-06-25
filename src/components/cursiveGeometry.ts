import * as THREE from "three";
import * as opentype from "opentype.js";

// Build an extruded 3D geometry for a word using a real cursive TTF, so we get
// true connected handwriting outlines (Text3D can only use typeface JSON).
// Outlines come from opentype.js; counters (the holes in e/o/l) are resolved by
// three's ShapePath.toShapes — the same path FontLoader uses for glyphs.

async function loadFont(url: string): Promise<opentype.Font> {
  const res = await fetch(url);
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
  word: string,
  reduced: boolean
): Promise<THREE.ExtrudeGeometry> {
  const font = await loadFont(url);
  const unit = 100;
  const path = font.getPath(word, 0, 0, unit);

  const shapePath = new THREE.ShapePath();
  for (const cmd of path.commands) {
    switch (cmd.type) {
      case "M":
        shapePath.moveTo(cmd.x, cmd.y);
        break;
      case "L":
        shapePath.lineTo(cmd.x, cmd.y);
        break;
      case "Q":
        shapePath.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        break;
      case "C":
        shapePath.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        break;
      // 'Z' closes the current sub-path automatically.
    }
  }

  const shapes = shapePath.toShapes(true);

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: unit * 0.16,
    bevelEnabled: true,
    bevelThickness: unit * 0.018,
    bevelSize: unit * 0.012,
    bevelSegments: reduced ? 2 : 5,
    curveSegments: reduced ? 6 : 14
  });

  // Font coords are y-down; flip to upright, then centre and normalise height.
  geo.scale(1, -1, 1);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const height = bb.max.y - bb.min.y || 1;
  const target = 2.4;
  const s = target / height;
  geo.center();
  geo.scale(s, s, s);
  geo.computeVertexNormals();
  return geo;
}
