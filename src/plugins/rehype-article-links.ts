import rehypeExternalLinks from "rehype-external-links";
import type { Root } from "hast";

export function rehypeArticleLinks() {
  const transform = rehypeExternalLinks({
    rel: ["noreferrer", "noopener"],
    target: "_blank",
  });
  return (tree: Root, file: { path: string }) => {
    // About previously used same-tab links; keep that behavior after moving its copy.
    if (file.path.replaceAll("\\", "/").endsWith("/content/about/index.md"))
      return;
    return transform(tree);
  };
}
