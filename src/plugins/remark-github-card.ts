import type { Root, RootContent } from "mdast";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";
import { h, isNodeDirective } from "../utils/remark";

// Repository and link cards, written as directives on their own lines:
//   ::github{repo="owner/name"}  ::github{user="name"}
//   ::link{url="https://example.com/page" label="Play it in the browser"}
// Cards in a row sit side by side. They are plain links: no API requests,
// no scripts, nothing fetched from another site.

const GITHUB =
  "M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z";
const ARROW = "M5 3.5h7.5V11M12.25 3.75 3.5 12.5";

const icon = (path: string, filled: boolean): RootContent =>
  h(
    "svg",
    {
      class: "link-card-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      ...(filled
        ? { fill: "currentColor" }
        : { fill: "none", stroke: "currentColor", "stroke-width": "1.4" }),
    },
    [h("path", { d: path })],
  );

const text = (value: string) => ({ type: "text" as const, value });

const card = (
  kind: "repo" | "link",
  href: string,
  caption: string,
  title: string,
): RootContent =>
  h("a", { class: `link-card link-card-${kind}`, href }, [
    icon(kind === "repo" ? GITHUB : ARROW, kind === "repo"),
    h("span", { class: "link-card-text" }, [
      h("span", { class: "link-card-caption" }, [text(caption)]),
      h("span", { class: "link-card-title" }, [text(title)]),
    ]),
  ]);

const classes = (node: RootContent) =>
  String(node.data?.hProperties?.className ?? "").split(/[ ,]/);
const isCard = (node: RootContent) => classes(node).includes("link-card");
const isRow = (node: RootContent) => classes(node).includes("link-cards");

export const remarkGithubCard: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;
    if (!isNodeDirective(node) || node.type !== "leafDirective") return;

    if (node.name === "link") {
      const url = node.attributes?.url;
      if (!url || !/^https:\/\//.test(url)) return;
      const address = url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");
      const label = node.attributes?.label || address;
      parent.children.splice(index, 1, card("link", url, address, label));
      return;
    }

    if (node.name !== "github") return;
    const raw = node.attributes?.repo ?? node.attributes?.user;
    if (!raw) return;
    const name = raw.replace(/^https:\/\/github\.com\//, "").replace(/\/$/, "");
    if (!/^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)?$/.test(name)) return;
    const caption = node.attributes?.repo ? "GitHub repository" : "GitHub profile";
    parent.children.splice(index, 1, card("repo", `https://github.com/${name}`, caption, name));
  });

  // gather cards that follow each other into one row
  visit(tree, (node) => {
    if (!("children" in node)) return;
    if (isRow(node as RootContent)) return SKIP;
    const children = node.children as RootContent[];
    for (let i = 0; i < children.length; i++) {
      if (!isCard(children[i]!)) continue;
      let j = i;
      while (j < children.length && isCard(children[j]!)) j++;
      const row = h("div", { class: "link-cards" }, children.slice(i, j));
      children.splice(i, j - i, row);
    }
    return undefined;
  });
};
