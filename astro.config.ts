// Rehype plugins
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeArticleLinks } from "./src/plugins/rehype-article-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
// Remark plugins
import remarkDirective from "remark-directive"; /* Handle ::: directives as nodes */
import remarkMath from "remark-math";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions"; /* Add admonitions */
import { remarkGithubCard } from "./src/plugins/remark-github-card";
import { remarkYoutubeEmbed } from "./src/plugins/remark-youtube-embed";
import { remarkContentLinks } from "./src/plugins/remark-content-links";
import { rehypeMath } from "./src/plugins/rehype-math";
import { expressiveCodeOptions, siteConfig } from "./src/site.config";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  prerenderConflictBehavior: "error",
  compressHTML: true,
  image: {
    domains: ["arthifact.com"],
  },
  integrations: [
    expressiveCode(expressiveCodeOptions),
    icon(),
    sitemap({
      filter: (page) =>
        !["/posts/markdown-elements/", "/posts/paper-example/"].some((sample) =>
          page.includes(sample),
        ),
    }),
    mdx(),
    robotsTxt(),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeMath,
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          { behavior: "wrap", properties: { className: ["not-prose"] } },
        ],
        rehypeArticleLinks,
        rehypeUnwrapImages,
      ],
      remarkPlugins: [
        remarkMath,
        remarkContentLinks,
        remarkDirective,
        remarkGithubCard,
        remarkYoutubeEmbed,
        remarkAdmonitions,
      ],
      remarkRehype: {
        footnoteLabelProperties: {
          className: [""],
        },
      },
    }),
  },
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: false,
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    plugins: [tailwind()],
  },
});
