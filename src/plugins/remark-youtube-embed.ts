import type { Link, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { h } from "../utils/remark";

const youtubeId = (url: string): string | undefined => {
  const match = url.match(
    /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1];
};

// A YouTube link on its own line becomes an embedded player. It loads lazily: the
// browser fetches the player only when the reader scrolls near it, on that post alone.
export const remarkYoutubeEmbed: Plugin<[], Root> = () => (tree) => {
  visit(tree, "paragraph", (node, index, parent) => {
    if (!parent || index === undefined) return;
    const content = node.children.filter(
      (child) => !(child.type === "text" && !child.value.trim()),
    );
    if (content.length !== 1 || content[0]?.type !== "link") return;
    const link = content[0] as Link;
    const id = youtubeId(link.url);
    if (!id) return;
    const label = link.children
      .map((child) => ("value" in child ? child.value : ""))
      .join("")
      .replace(/↗/g, "")
      .trim();
    const title = label || "YouTube video";
    const player = `https://www.youtube-nocookie.com/embed/${id}`;
    parent.children.splice(
      index,
      1,
      h("div", { class: "video-embed" }, [
        h("iframe", {
          src: player,
          title,
          loading: "lazy",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          referrerpolicy: "strict-origin-when-cross-origin",
          allowfullscreen: true,
        }),
      ]),
    );
  });
};
