import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { h } from "../utils/remark";

// Images shown one at a time instead of stacked:
//   :::gallery
//   ![First](./a.jpg)
//   ![Second](./b.jpg)
//   :::
// Without JavaScript it is a strip you swipe or scroll through. On article
// pages a small script adds arrows, dots and a counter.
export const remarkGallery: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;
    if (node.type !== "containerDirective" || node.name !== "gallery") return;
    const track = h("div", { class: "gallery-track", tabindex: "0" }, node.children);
    parent.children.splice(index, 1, h("div", { class: "gallery" }, [track]));
  });
};
