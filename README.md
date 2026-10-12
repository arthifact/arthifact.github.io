# Gabriel I. Alonso — portfolio

A static research and creative portfolio at [arthifact.com](https://arthifact.com/), built with Astro. The design uses a paper-like background, serif typography, and a compact homepage with six selected works and a Ponyo still selected randomly on each homepage load. Navigation stays at the top. Selected work keeps the same card layout and 16:9 image frames at every size: three columns above 600px and two on smaller screens.

## Run and verify

Use Node 22.18 or newer and npm. The committed lockfile is the source of truth.

```sh
npm ci
npm run dev
npm run check
npm run test:paper
npm run build
npm run verify:site
npm run preview
```

`npm run build` refreshes the content cache and verifies the generated site. The homepage uses one small inline script to choose a Ponyo still; navigation and content also work with JavaScript disabled. The other core pages ship no client JavaScript. Index pages use system fonts; articles use locally hosted STIX Two Text. There are no external font requests or video players on initial load. The interactive Earth model loads its third-party viewer only after the reader requests it.

The verification command checks every built page for broken local links and anchors, image dimensions, a main heading, the CV, RSS content, and a 24 KiB gzipped HTML budget for the core pages. Gallery checks also exercise all 50 choices, repeat avoidance, unavailable session storage, and fallback behavior. GitHub Actions runs type checks, the production build, and verification on pull requests.

## Everyday editing

All editable content lives in the root [`content/`](content/) folder. Start with the [editing guide](content/README.md).

- `content/projects/`, `content/research/`, `content/art/`: one folder per work, with its Markdown, images, and attachments together. The folder determines the section automatically.
- `content/blog/`, `content/notes/`: posts and notes, also with nearby files.
- `content/home/index.md`: introduction, contact information, and selected work.
- `content/about/index.md`: biography.
- `content/cv/`: CV and its link labels.
- `content/site/`: metadata, navigation, social links, branding, and compatibility URLs.

Each section's own `index.md` contains its introduction. Existing website addresses, including `/projects/<slug>/` for research and art, remain unchanged. Design and rendering stay in `src/`; ordinary content updates need no code changes.

## Write

Add Markdown posts in `content/blog/` with `title`, `description`, and `publishDate`; optional fields include `tags`, `coverImage`, and `draft`. Notes live in `content/notes/`. The Blog and main RSS feed collect published posts, research essays, and notes. A post marked `unlisted: true` keeps its URL but stays out of the blog and feed and receives `noindex` metadata. The original Markdown demo is preserved this way.

See the live [paper example](https://arthifact.com/posts/paper-example/), also linked at the top of Blog. It uses synthetic data to demonstrate the layout; it is unlisted, marked noindex and excluded from RSS, and is not a research entry. The optional figure generation script uses Python, NumPy, and Matplotlib; these are not site build dependencies.

Research writeups, projects, art, posts, and notes use white paper sheets with STIX Two Text, a centered title and author line, an abstract, numbered sections, and fine rules. Each page reads down the left column, then continues from the top of the right. Headings, paragraphs, equations, tables, code, and footnotes share that continuous flow; headings never restart column pairs. A quiet gutter separates the columns. Wide figures can span the sheet above or below its text. Type, margins, and spacing scale smoothly with the sheet width using CSS container units and rem limits, with no layout JavaScript. Phones use one reading column. Covers remain thumbnails on index pages; insert article figures where they belong. Print styles remove navigation, shadows, and borders and respect authored page breaks.

Start from `content/templates/paper.md` for plain text, math, and tables, or `content/templates/paper.mdx` for captioned figures and paired panels. Copy it into `content/blog/<slug>/index.md` (or `.mdx`), set the title, summary, and date, and write the body. Remove `unlisted: true` when you want it in the blog and RSS. For a project, use `content/projects/<slug>/index.mdx` (or use `content/research/` or `content/art/`). Authors default to Gabriel I. Alonso; add an `authors` array for coauthors.

Optional frontmatter:

```yaml
format: paper
abstract: "The question, method, and main result in one paragraph."
numberedSections: true
columns: 2 # The default paper layout; use 1 for a single reading column.
authors: ["Gabriel I. Alonso", "Coauthor"]
affiliation: "Your institution"
pdf: "./your-paper.pdf"
```

`abstract` replaces the description with a manuscript abstract below the title. `columns` defaults to 2 for a continuous paper flow, down the left column and back to the top of the right; 1 remains available for a single reading column. `numberedSections` numbers level-two headings while preserving their anchors; footnotes are not numbered as a section. `pdf` adds a download link: place a PDF beside the article and use `./your-paper.pdf` or use an HTTPS URL. Existing PDF papers can accompany the readable HTML article.

Short pieces use one sheet by default. To start another sheet in MDX, import `PageBreak` from `@/components/paper/PageBreak.astro` and insert `<PageBreak />` on its own line between sections. Plain Markdown uses `<div data-paper-break></div>` on its own line. Page numbers are automatic, and section numbers, equation anchors, and footnotes continue through the document. Each sheet ends naturally after its content and bottom margin, so short articles have no forced empty page area. Content is never clipped or shrunk to fit. Breaks are chosen by the author rather than measured by browser JavaScript.

In MDX, import `Figure`, `FigureGrid`, `Table`, and `Block` from `@/components/paper/`. Figures, tables, and ordinary Markdown images use one column by default. Add `wide` to a component to span both columns, like a LaTeX `figure*` or `table*`. A wide block floats to the top of its authored sheet, or to the bottom with `placement="bottom"`; it never inserts another column pair in the middle of the text. Float placement stays within the author’s page breaks. The HTML reading and keyboard order follows that displayed placement.

For a local raster image, import it from the article folder and pass it as `src`; Astro generates responsive WebP variants. Import SVG plots with `?url` from the article folder and supply explicit `width` and `height`. Always supply meaningful `alt` text. `Figure` takes `id`, `number`, and either `caption` or a rich Markdown caption in its body. Images retain their proportions and stay together with their captions. Clicking a figure opens the original at full size. Two figures inside `<FigureGrid>` form equal-width panels aligned with the text columns. Image groups stack on phones. Use `maxWidth={640}` to center a smaller wide figure. The optional `sizes` prop refines responsive raster selection for custom placements.

Use `<Block>` around a short heading, introduction, and code listing to keep them together in one column. `<Block wide>` gives a long listing or equation both columns; `placement="bottom"` puts it below the text. Code lines wrap by default while preserving indentation and copyable source; use `wrap=false` in a fence’s metadata when line structure requires scrolling. Use LaTeX `aligned` or `split` for long equations, as in a typeset paper. Equation numbers reserve their own space. An unusually long unbroken formula or table scrolls within its own labelled region rather than covering the adjacent column. Native HTML layout does not reproduce TeX’s full automatic pagination: authors still choose page breaks, wide blocks, and mathematical line breaks.

`Table` takes `id`, `number`, and `caption`, with a Markdown or HTML table inside. Tables retain native headers and fine horizontal rules; oversized tables scroll in a labelled region that readers can focus with the keyboard. Code fences are highlighted during the build. Headings, links, lists, citations as links, and Markdown footnotes work normally.

LaTeX equations work in both `.md` and `.mdx`: use `$x^2$` inline or `$$` on separate lines around a display equation. Add `\tag{1}` inside an equation for a number. Put `<div id="eq-energy" />` before an MDX equation and link to it with `[Equation (1)](#eq-energy)` for a cross-reference. KaTeX renders HTML and MathML during the build, so the reader needs no math JavaScript. Math styles and fonts are local and linked only on articles containing equations, with font swapping enabled. Wide display equations scroll within the reading column and can be focused with the keyboard. Unsupported or invalid equations fail the build; use [KaTeX’s supported commands](https://katex.org/docs/supported). Write web articles in Markdown/MDX with LaTeX math; attach complete `.tex` manuscripts as compiled PDFs.

## Update identity and design

- Site name, metadata, navigation, and social links: `content/site/index.json`.
- Homepage introduction and selected work: `content/home/index.md`.
- Biography: `content/about/index.md`.
- CV: replace `content/cv/Gabriel_Isaac_Alonso_Serrato_CV.pdf`.
- Site design: `src/styles/global.css`. Article typography and print styles: `src/styles/paper.css`.
- Homepage stills: `content/home/ponyo/`; descriptions: `content/home/ponyo/descriptions.json`; credit: `content/home/index.md`. The existing random selection, repeat avoidance, and fallback behavior remain in `src/components/OceanStill.astro`.
- Logo and icons: `content/site/logo.svg` and `content/site/icons/`. Regenerate them with `node scripts/generate-logo.mjs`.
- Social preview: `content/site/social-card.png`.
- Legacy public URLs: `content/site/asset-aliases.json`. Files are served from their new content locations at the original addresses.

## Artwork credit

The 50 homepage stills are from [Ponyo (2008), Studio Ghibli’s official gallery](https://www.ghibli.jp/works/ponyo/). © 2008 Hayao Miyazaki/Studio Ghibli, NDHDMT. The gallery provides stills for use within the bounds of common sense. This third-party artwork remains under its original copyright and is not covered by the repository’s software license.

## Deployment

GitHub Pages deploys pushes to `main` through `.github/workflows/deploy.yml`. The custom domain and `CNAME` remain configured. Review a redesign pull request before merging; merging publishes the changes through the existing workflow.

Built from the Astro Cactus foundation. See [LICENSE](LICENSE).

The locally hosted [STIX Two Text](https://fontsource.org/fonts/stix-two-text) font is by the STIX Fonts Project Authors and is distributed under the SIL Open Font License 1.1, included in the installed `@fontsource/stix-two-text` package.
