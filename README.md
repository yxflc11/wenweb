# Bingwen He — Portfolio

A bold, type-led personal portfolio (AI automation & prompt engineering),
inspired by the editorial layout of nathansmith.design.

Static site — plain HTML, CSS, and vanilla JS (no build step).

## Run locally

```bash
npm start
# serves http://127.0.0.1:4173
```

(Requires Node. Any static file server works too.)

## Stack notes

- Display type: Bricolage Grotesque · UI/body: Space Grotesk (Google Fonts)
- Smooth scrolling: Lenis (loaded from CDN, with a native-scroll fallback)
- Contact form: Formspree (`src/main.js` → `formEndpoint`)

## Easy tweaks

In `src/styles.css` `:root`:

- `--card-ratio` — project card image ratio (`1` square, `.75` for 3:4, `1.333` for 4:3)
- `--panel-max` — max content width inside the Archive / Information / Contact panels

## Deploy (GitHub Pages)

1. Push this folder to `github.com/yxflc11/wenweb` (see chat instructions).
2. Repo → **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
3. Live at `https://yxflc11.github.io/wenweb/`.
