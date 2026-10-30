import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { workLoader } from "./data/work-loader";
import content from "../content/site/index.json";

const date = z
  .string()
  .or(z.date())
  .transform((val) => new Date(val));

// Shared by posts and work. An `abstract` turns the page into a paper with
// numbered sections; `columns: 2` gives the two-column paper flow.
const baseSchema = z.object({
  title: z.string().max(180),
  authors: z.array(z.string()).min(1).default([content.site.author]),
  affiliation: z.string().optional(),
  abstract: z.string().optional(),
  columns: z.union([z.literal(1), z.literal(2)]).default(1),
  pdf: z
    .string()
    .regex(
      /^(\.\/|\/(?!\/)|https:\/\/)/,
      "Use ./paper.pdf, a site path, or an HTTPS URL.",
    )
    .optional(),
  publishDate: date,
  updatedDate: date.optional(),
});

const post = defineCollection({
  loader: glob({ base: "./content/blog", pattern: "*/**/index.{md,mdx}" }),
  schema: ({ image }) =>
    baseSchema.extend({
      description: z.string(),
      cover: image().optional(),
      draft: z.boolean().default(false),
      unlisted: z.boolean().default(false),
      ogImage: z.string().optional(),
    }),
});

const project = defineCollection({
  loader: workLoader(),
  schema: ({ image }) =>
    baseSchema
      .extend({
        /** One short line for cards, search results and link previews. */
        summary: z.string(),
        /** The label on cards, such as "Research poster". Defaults by section. */
        type: z.string().optional(),
        kind: z.enum(["research", "project", "art"]).default("project"),
        featured: z.boolean().default(false),
        cover: image().optional(),
      })
      .transform((data) => ({
        ...data,
        description: data.summary,
      })),
});

const page = defineCollection({
  loader: glob({ base: "./content", pattern: "{home,about,cv}/index.md" }),
  schema: z.object({
    title: z.string().max(180),
    description: z.string().default(content.site.description),
    name: z.string().optional(),
    role: z.string().optional(),
    email: z.string().optional(),
    selectedTitle: z.string().optional(),
    selected: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
    cvTitle: z.string().optional(),
    socialTitle: z.string().optional(),
    download: z.string().optional(),
    label: z.string().optional(),
    navLabel: z.string().optional(),
    format: z.string().optional(),
  }),
});

export const collections = { post, project, page };
