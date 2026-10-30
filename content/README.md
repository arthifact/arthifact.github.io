# Edit the website here

All writing, images, downloads, and personal information live in this folder. The website's design and behavior live in `src/`.

```text
content/
  home/index.md           Name and selected work
  about/                  Biography and portrait
  research/               Research writing and its files
  projects/               Software, games, and interactive work
  art/                    Artwork and animation
  blog/                   Blog posts
  cv/                     CV PDF and link labels
  site/index.json         Site title, navigation, social links, and section introductions
```

## Add a project, research entry, or artwork

Make a folder such as `research/your-study/` with an `index.md` and its pictures beside it:

```markdown
---
title: My project
publishDate: "2026-10-12"
summary: One short line for the card and link previews.
cover: ./cover.png
---

Write about the work here.

![Describe the image.](./figure.png)
```

Optional fields:

- `authors`, `affiliation`: shown under the title. Authors default to Gabriel I. Alonso.
- `type`: the label on its card, such as `Research poster`. Defaults to Research essay, Project, or Art & animation.
- `abstract`: shows an abstract under the title and numbers the sections.
- `pdf: ./paper.pdf`: adds a download link.
- `featured: true`: puts the work first in its list.

The folder chooses the section. Use lowercase folder names with hyphens, unique across Research, Projects, and Art. Every work lives at `/projects/<folder-name>/`, so moving it between sections keeps its URL; `slug: old-folder-name` keeps the address if you rename the folder.

Images open full screen with zoom when clicked. Use `./paper.pdf`-style links for nearby downloads. A YouTube link on its own line becomes a player. `::github{repo="owner/name"}` and `::link{url="https://…" label="Playable example"}` on their own lines become link cards.

## Write a blog post

Posts go in `blog/my-post/index.md` with `title`, `description`, and `publishDate`, plus any optional field above. `draft: true` hides a post in production; `unlisted: true` keeps it reachable by URL but out of Blog and RSS.

## Update the homepage, biography, or CV

- `home/index.md`: the introduction and the `selected` work, each with its folder ID and a short card title and description.
- `about/index.md`: the biography, in ordinary Markdown.
- `cv/Gabriel_Isaac_Alonso_Serrato_CV.pdf`: replace this file to update your CV. Labels live in `cv/index.md`.
- `site/index.json`: site name, metadata, navigation, social links, and the Research, Projects, Art, and Blog introductions under `sections`.

Media and downloads in published folders are public, including unlinked files. Markdown sources, JSON configuration, and hidden files are not. `site/asset-aliases.json` keeps old CV, logo, and social-card URLs working; it normally needs no edits.
