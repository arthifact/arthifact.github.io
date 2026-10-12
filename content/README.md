# Edit the website here

All writing, images, downloads, and personal information live in this folder. The website's design and behavior live in `src/`.

```text
content/
  home/index.md           Name, role, email, and selected work
  home/ponyo/             Homepage stills and their descriptions
  about/index.md          Biography and About introduction
  research/               Research writing and its files
  projects/               Software, games, and interactive work
  art/                    Artwork and animation
  blog/                   Blog posts
  notes/                  Short notes
  tags/                   Optional tag descriptions
  cv/                     CV PDF and link labels
  site/                   Site title, navigation, social links, and branding
  templates/              Copyable paper examples (not published)
```

The `index.md` directly inside `research/`, `projects/`, `art/`, or `blog/` controls that section's introduction. Individual works go in their own subfolders.

## Add a project, research entry, or artwork

1. Copy an existing entry folder into the appropriate section, such as `research/your-study/`.
2. Edit its `index.md`. Replace its pictures and downloads with yours.
3. Run `npm run build` from the repository root to check it.

A minimal entry:

```markdown
---
title: My project
description: A short explanation of the work.
publishDate: "2026-10-12"
coverImage:
  src: ./cover.png
  alt: Describe the cover image.
---

Write about the work here.

![Describe the image.](./figure.png)

[Download the paper](./paper.pdf)
```

Keep each entry's images, PDFs, and other attachments beside `index.md`. The folder chooses the section: there is no `kind` field to maintain. Use lowercase folder names with hyphens; folder names must be unique across Research, Projects, and Art. `featured: true` puts a project first in the Projects list.

Existing article addresses are preserved: all three sections use `/projects/<folder-name>/`. Moving an entry between those sections keeps its URL. An optional `slug: old-folder-name` preserves its address if you rename its folder. Keep the selected-work ID in `home/index.md` consistent with that slug.

Markdown images are optimized automatically. Use Markdown links such as `./paper.pdf` for nearby downloads. Optional `pdf: ./paper.pdf` adds a download button to an article. In MDX, import local figures (for example, `import plot from "./plot.svg?url"`) and pass them to `Figure`; SVGs need explicit width and height. Use public page URLs when linking to another article.

## Write a post or note

Posts go in `blog/my-post/index.md` (or `.mdx`) with `title`, `description`, and `publishDate`. Optional fields include `tags`, `coverImage`, and `draft: true`. Draft posts and their attachment folders are omitted from production. `unlisted: true` keeps a post publicly accessible at its URL, but excludes it from Blog, RSS, and search. Work in Research, Projects, and Art is public as soon as it is added.

Notes go in `notes/my-note/index.md`. Use a full date with a timezone, such as `publishDate: "2026-10-12T12:00:00-06:00"`. Blog and RSS automatically collect posts, research essays, and notes. The existing unlisted paper and Markdown examples remain available.

## Update the homepage, biography, or CV

- `home/index.md`: change the introduction or edit `selected`. Each selected item contains its folder ID plus a short card title and description.
- `about/index.md`: edit the biography using ordinary Markdown.
- `cv/Gabriel_Isaac_Alonso_Serrato_CV.pdf`: replace this file to update your CV. Keeping its filename preserves existing bookmarks. Labels live in `cv/index.md`.
- `site/index.json`: edit the site-wide name, metadata, navigation, and social links.
- Section introductions: edit the `index.md` directly inside each section.

Local files with supported media/download extensions in published folders are public, including unlinked files. Markdown sources, JSON configuration, hidden files, and templates are not copied to the public website. Supported downloads include PDFs, images, PowerPoint, CSV, text, BibTeX, ZIP, audio, and video.

`site/asset-aliases.json` preserves the old CV, logo, social-card, and example-figure URLs. It normally needs no edits. If you intentionally rename one of those files, update its target there too.

For advanced paper layouts, math, figures, and page breaks, see the repository README and `templates/`.
