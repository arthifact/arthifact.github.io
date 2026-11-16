import rehypeExternalLinks from "rehype-external-links";
import type { Root } from "hast";

// Outside links (absolute URLs) open in a new tab; links within the site stay in the same tab.
export function rehypeArticleLinks() {
  const transform = rehypeExternalLinks({
    rel: ["noreferrer", "noopener"],
    target: "_blank",
  });
  return (tree: Root) => transform(tree);
}
