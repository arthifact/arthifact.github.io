# Gabriel I. Alonso — portfolio

A static research and creative portfolio at [arthifact.com](https://arthifact.com/), built with Astro: a paper-like background, serif type, and a homepage of six selected works.

## Run and verify

Use Node 22.18 or newer and npm.

```sh
npm ci
npm run dev       # local preview while editing
npm run check     # type checks
npm run build     # build, then check links, images, RSS, the CV and page budgets
npm run preview   # serve the built site
```

The index pages (Home, Research, Projects, Art, Blog, About) ship no JavaScript. Article pages carry one small inline script for the full-screen image viewer. Fonts are local; there are no third-party requests on load.

## Edit

Everything you write lives in [`content/`](content/). The [editing guide](content/README.md) covers adding work, blog posts, the homepage, the biography and the CV. Design lives in `src/styles/global.css` (site) and `src/styles/paper.css` (articles).

Articles render as white paper sheets in STIX Two Text. Beyond plain Markdown they support:

- **Math:** `$x^2$` inline or `$$` display blocks, rendered to HTML and MathML at build time; `\tag{1}` numbers an equation.
- **Figures and tables (MDX):** import `Figure`, `FigureGrid`, `Table` and `Block` from `@/components/paper/`; add `wide` to span the sheet.
- **Page breaks:** `<PageBreak />` in MDX or `<div data-paper-break></div>` in Markdown.
- **Two columns:** `columns: 2` in the frontmatter.
- **Images:** clicking any image or figure opens it full screen; click again or press Zoom to zoom at that point, then scroll or drag.
- **Embeds and cards:** a YouTube link on its own line becomes a click-to-play player; `::github{repo="owner/name"}` and `::link{url="https://…" label="…"}` become link cards.

## Deploy

Pushes to `main` deploy to GitHub Pages through `.github/workflows/deploy.yml`; the custom domain is set in `CNAME`. The logo and icons can be regenerated with `node scripts/generate-logo.mjs`.

Built from the Astro Cactus foundation. See [LICENSE](LICENSE). The locally hosted [STIX Two Text](https://fontsource.org/fonts/stix-two-text) font is by the STIX Fonts Project Authors under the SIL Open Font License 1.1.
