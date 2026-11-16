import rehypeExternalLinks from "rehype-external-links";
import type { Root } from "hast";

export function rehypeArticleLinks() {
  const transform = rehypeExternalLinks({
    rel: ["noreferrer", "noopener"],
    target: "_blank",
  });
  return (tree: Root, file: { path: string }) => {
    // Home links stay in the same tab.
    if (file.path.replaceAll("\\", "/").endsWith("/content/home/index.md"))
      return;
    return transform(tree);
  };
}
