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
