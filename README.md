# Bingwen He — Personal site, writing & work

A high-end personal site inspired by [haoqi.design](https://haoqi.design/) and
Maxime Heckel's glass/WebGL work: a persistent morphing WebGL backdrop (caustic
light field → warp tunnel), liquid-glass display titles, a blueprint grid
overlay, a live technical readout (clock + weather + cursor coordinates),
light/dark + sound toggles, an in-browser CMS, and separate writing & work
sections. Both themes are calibrated and follow the system preference.

## Motion & interaction

A restrained, haoqi-inspired motion layer — every effect has a static,
WebGL-free fallback for reduced-motion and small / touch screens.

- **Liquid-glass titles** — display type extruded to 3D and rendered as
  transmission glass: the hero `BEFORE / THE LEAP` and closing `AFTER / THE SKY`
  couplet. Lines are justified to aligned edges and lit as luminous light-blue.
- **Warp crescendo** — the manifesto is a tall *pinned* section; scrolling
  through it scrubs a WebGL warp tunnel (streaks + forming rings) from calm to
  full and swaps the pinned statement band by band.
- **Split-text** — manifesto lines rise from behind a clip mask, staggered.
- **Sticker collage** — decorative SVG stickers (googly eyes, melty smiley,
  starface, pixel cursor, brand stamp) frame the hero and closing.
- **Acid category chips** on work rows, magnetic buttons, and smooth
  route-change / sound polish.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — server components, SSG
- **three.js · @react-three/fiber · drei · postprocessing** — glass titles,
  caustic field, warp tunnel + rings, 3D project hover preview
- **opentype.js** — extrudes a real font's outlines into the glass geometry
- **Keystatic** — in-browser CMS (`/keystatic`); content is Markdoc `.mdoc`
- **@markdoc/markdoc** — renders post/case-study bodies to the prose styles
- **Lenis** — smooth inertia scrolling (native + reduced-motion fallbacks)
- **next/font/local** — self-hosted Bricolage Grotesque · Space Grotesk · Space
  Mono (the build never fetches Google Fonts)

## Glass-title font

The glass titles extrude a **rounded display font** through `opentype.js`. The
repo ships only the cursive `public/fonts/DancingScript.ttf`, and
`cursiveGeometry.ts` falls back to it when the configured font is missing — so a
fresh checkout or deploy never breaks. To ship the bold block look, drop an
OFL-licensed rounded font (Fredoka / Baloo / M PLUS Rounded / Quicksand Bold)
into `public/fonts/` and point `FONT` in `src/components/HeroGlass.tsx` at it;
the justified layout, sizing, and material all carry over. (Proprietary system
fonts are intentionally not committed.)

## Develop

```bash
npm install
npm run dev     # http://127.0.0.1:4173   (and /keystatic for the CMS)
npm run build   # type-check + static/SSG
npm run start   # serve the production build
```

## Routes

```
/                      home — hero, work (by category), about, manifesto, closing
/blog, /blog/[slug]    writing — index + posts (SSG)
/work/[slug]           project case-studies (SSG)
/contact               contact page (form + links)
/keystatic             in-browser CMS (no site chrome)
```

## Writing & work content (the CMS)

Two **separate** collections, edited at `/keystatic`:

- **Blog posts** → `src/content/posts/*.mdoc`
- **Work case-studies** → `src/content/work/*.mdoc`

In dev (`storage: { kind: "local" }` in `keystatic.config.ts`) the CMS edits
these files directly — write a post, save, commit, push. The site reads them at
build time via Keystatic's reader, so they're statically generated.

**To edit on the live site** (not just locally), switch `keystatic.config.ts` to
GitHub mode and add the secrets yourself:

```ts
storage: { kind: "github", repo: "yxflc11/wenweb" }
```

then create a Keystatic GitHub app and set `KEYSTATIC_GITHUB_CLIENT_ID`,
`KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` in Vercel. (Account/app
creation and secrets are yours to configure — see keystatic.com/docs.)

## Deploy to Vercel

1. Push to a GitHub repo (e.g. `github.com/yxflc11/wenweb`).
2. [vercel.com/new](https://vercel.com/new) → Import the repo. Next.js is
   auto-detected; no config needed. Deploy.
3. Fonts are self-hosted, so the build is deterministic.

**Before/after launch**
- Update the domain in `src/app/layout.tsx` (`metadataBase`, OG URLs) once known.
- Contact form posts to Formspree (`src/data.ts → formEndpoint`) — swap for your
  own API route later if you build a custom inbox.
- Live `/keystatic` editing needs GitHub mode (above); until then edit in dev.

## Performance & accessibility

- The heavy glass canvases pause (`frameloop`) when scrolled out of view; the
  warp tunnel and caustic field skip drawing when inactive; the background WebGL
  is disabled on touch / small screens.
- `prefers-reduced-motion` disables Lenis, the loader animation, scroll reveals,
  and the warp pin (statements fall back to a static stack). Visible focus rings
  and a skip-to-content link are included.
