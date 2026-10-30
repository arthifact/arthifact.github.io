import type { Root, RootContent } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { h, isNodeDirective } from "../utils/remark";

const card = (label: string, href: string, text: string): RootContent =>
  h("div", { class: "static-repo-link" }, [
    h("span", { class: "static-repo-label" }, [{ type: "text", value: label }]),
    h("a", { href }, [{ type: "text", value: text }]),
  ]);

// Render repository references and other links as static cards: no API requests,
// placeholder stats, client-side scripts, or dependency on another site to read the page.
//   ::github{repo="owner/name"}  ::github{user="name"}
//   ::link{url="https://example.com/page" label="Playable example"}
export const remarkGithubCard: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node, index, parent) => {
    if (
      !parent ||
      index === undefined ||
      !isNodeDirective(node) ||
      node.type !== "leafDirective"
    )
      return;

    if (node.name === "link") {
      const url = node.attributes?.url;
      if (!url || !/^https:\/\//.test(url)) return;
      const text = url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");
      parent.children.splice(index, 1, card(node.attributes?.label || "Link", url, text));
      return;
    }

    if (node.name !== "github") return;
    const raw = node.attributes?.repo ?? node.attributes?.user;
    if (!raw) return;
    const name = raw.replace(/^https:\/\/github\.com\//, "").replace(/\/$/, "");
    if (!/^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)?$/.test(name)) return;
    const label = node.attributes?.repo ? "GitHub repository" : "GitHub profile";
    parent.children.splice(index, 1, card(label, `https://github.com/${name}`, name));
  });
};
