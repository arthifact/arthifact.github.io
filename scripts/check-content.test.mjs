import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  contentFileUrl,
  contentAssets,
  relativeContentPath,
} from "../src/utils/content-files.ts";

const article = resolve("content/blog/paper-example/index.mdx");

test("existing CV and figure addresses still resolve from neighboring files", () => {
  assert.equal(
    contentFileUrl(
      resolve("content/cv/index.md"),
      "./Gabriel_Isaac_Alonso_Serrato_CV.pdf#page=2",
    ),
    "/files/Gabriel_Isaac_Alonso_Serrato_CV.pdf#page=2",
  );
  assert.equal(
    contentFileUrl(article, "./reconstruction.svg?download=1"),
    "/images/paper-example/reconstruction.svg?download=1",
  );
  assert.equal(
    contentFileUrl(article, "./sampling-matrix.png"),
    "/content/blog/paper-example/sampling-matrix.png",
  );
});

test("public page URLs, external links, and anchors are unchanged", () => {
  for (const href of [
    "https://example.com/paper.pdf",
    "/projects/graph-explorer/",
    "#method",
    "mailto:example@example.com",
  ]) {
    assert.equal(contentFileUrl(article, href), href);
  }
});

test("invalid downloads fail clearly without exposing source or paths outside content", () => {
  assert.throws(
    () => contentFileUrl(article, "./missing.pdf"),
    /Missing attachment/,
  );
  assert.throws(
    () => contentFileUrl(article, "../../../package.json"),
    /inside content/,
  );
  assert.throws(
    () => contentFileUrl(article, "./results.json"),
    /Unsupported attachment/,
  );
  assert.throws(
    () => relativeContentPath(resolve("content/.private/file.pdf")),
    /not public/,
  );
  assert.throws(
    () => contentFileUrl(article, "../../templates/paper.md"),
    /not public/,
  );
});

test("only media and downloads from published folders are exposed", () => {
  const assets = contentAssets();
  assert.equal(new Set(assets.map(({ url }) => url)).size, assets.length);
  assert(
    assets.some(
      ({ url }) => url === "/files/Gabriel_Isaac_Alonso_Serrato_CV.pdf",
    ),
  );
  assert(assets.every(({ file }) => !/\.(md|mdx|json|ts)$/.test(file)));
  const folder = resolve("content/projects/graph-explorer");
  assert(
    contentAssets([folder]).every(({ file }) => !file.startsWith(folder + "/")),
  );
});

test("legacy downloads and branding remain byte-identical at their original URLs", () => {
  const aliases = JSON.parse(
    readFileSync("content/site/asset-aliases.json", "utf8"),
  );
  for (const [url, target] of Object.entries(aliases)) {
    const file = resolve("content", target);
    assert.deepEqual(
      readFileSync(resolve("dist", decodeURIComponent(url.slice(1)))),
      readFileSync(file),
      url,
    );
  }
});

test("an image and a download can share a Markdown reference without breaking either", async () => {
  const { remarkContentLinks } =
    await import("../src/plugins/remark-content-links.ts");
  const tree = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "imageReference",
            identifier: "plot",
            referenceType: "full",
            alt: "Plot",
          },
          {
            type: "linkReference",
            identifier: "plot",
            referenceType: "full",
            children: [{ type: "text", value: "Full image" }],
          },
        ],
      },
      { type: "definition", identifier: "plot", url: "./sampling-matrix.png" },
    ],
  };
  remarkContentLinks()(tree, { path: article });
  assert.equal(
    tree.children[0].children[1].url,
    "/content/blog/paper-example/sampling-matrix.png",
  );
  assert.equal(tree.children[1].url, "./sampling-matrix.png");
});
