import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { relative } from "node:path";
import { contentRoot } from "../utils/content-files";

export function workId(entry: string, slug?: unknown) {
  const id =
    typeof slug === "string"
      ? slug
      : entry.replace(/^[^/]+\//, "").replace(/\/index\.mdx?$/, "");
  if (!/^[a-z0-9]+(?:[-_/][a-z0-9]+)*$/.test(id)) {
    throw new Error(
      `Use lowercase words separated by hyphens for the work folder or slug: ${entry}`,
    );
  }
  return id;
}

export function workLoader(): Loader {
  const loader = glob({
    base: "./content",
    pattern: "{projects,research,art}/*/**/index.{md,mdx}",
    generateId: ({ entry, data }) => workId(entry, data.slug),
  });
  // The folder selects the section, so authors don't repeat it in frontmatter.
  return {
    ...loader,
    name: "work-folders",
    load: (context) =>
      loader.load({
        ...context,
        parseData: (entry) => {
          const section = relative(contentRoot, entry.filePath!).split(
            /[\\/]/,
          )[0];
          const kind = section === "projects" ? "project" : section;
          return context.parseData({ ...entry, data: { ...entry.data, kind } });
        },
      }),
  };
}
