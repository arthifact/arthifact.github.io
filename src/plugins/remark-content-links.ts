import type { Definition, Root } from "mdast";
import { visit } from "unist-util-visit";
import { contentFileUrl, contentRoot } from "../utils/content-files.ts";
import { resolve, sep } from "node:path";

export function remarkContentLinks() {
  return (tree: Root, file: { path: string }) => {
    if (!resolve(file.path).startsWith(contentRoot.replace(/\/$/, "") + sep))
      return;
    const definitions = new Map<string, Definition>();
    visit(tree, "definition", (node) => {
      definitions.set(node.identifier, node);
    });
    visit(tree, (node, index, parent) => {
      // ::video{src="./clip.mp4"} on its own line: a short, silent, looping clip
      if (
        node.type === "leafDirective" &&
        node.name === "video" &&
        parent &&
        index !== undefined
      ) {
        const src = node.attributes?.src;
        if (!src) return;
        const url = contentFileUrl(file.path, src);
        parent.children[index] = {
          type: "html",
          value: `<video class="article-video" src="${url}" autoplay muted loop playsinline preload="metadata"></video>`,
        };
        return;
      }
      // Keep image definitions relative for Astro's responsive image pipeline.
      // Resolve reference links separately, even when they share an image definition.
      if (node.type === "link") {
        node.url = contentFileUrl(file.path, node.url);
      } else if (
        node.type === "linkReference" &&
        parent &&
        index !== undefined
      ) {
        const definition = definitions.get(node.identifier);
        if (definition)
          parent.children[index] = {
            type: "link",
            url: contentFileUrl(file.path, definition.url),
            title: definition.title,
            children: node.children,
          };
      }
    });
  };
}
