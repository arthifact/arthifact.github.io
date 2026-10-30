import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { workLoader } from "./data/work-loader";
import content from "../content/site/index.json";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

const titleSchema = z.string().max(180);

const baseSchema = z.object({
  title: titleSchema,
  authors: z.array(z.string()).min(1).default([content.site.author]),
  format: z.enum(["article", "paper"]).default("article"),
  columns: z.union([z.literal(1), z.literal(2)]).default(1),
  abstract: z.string().optional(),
  affiliation: z.string().optional(),
  numberedSections: z.boolean().default(false),
  pdf: z
    .string()
    .regex(
      /^(\.\/|\/(?!\/)|https:\/\/)/,
      "Use ./paper.pdf, a site path, or an HTTPS URL.",
    )
    .optional(),
});

const post = defineCollection({
  loader: glob({ base: "./content/blog", pattern: "*/**/index.{md,mdx}" }),
  schema: ({ image }) =>
    baseSchema.extend({
      description: z.string(),
      coverImage: z
        .object({
          alt: z.string(),
          src: image(),
        })
        .optional(),
      draft: z.boolean().default(false),
      unlisted: z.boolean().default(false),
      ogImage: z.string().optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
    }),
});

const note = defineCollection({
  loader: glob({ base: "./content/notes", pattern: "**/*.{md,mdx}" }),
  schema: baseSchema.extend({
    description: z.string().optional(),
    publishDate: z.iso
      .datetime({ offset: true }) // Ensures ISO 8601 format with offsets allowed (e.g. "2024-01-01T00:00:00Z" and "2024-01-01T00:00:00+02:00")
      .transform((val) => new Date(val)),
  }),
});

const tag = defineCollection({
  loader: glob({ base: "./content/tags", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: titleSchema.optional(),
    description: z.string().optional(),
  }),
});

const project = defineCollection({
  loader: workLoader(),
  schema: ({ image }) =>
    baseSchema.extend({
      description: z.string(),
      /** One short line for cards; the full description stays on the page itself. */
      summary: z.string().optional(),
      kind: z.enum(["research", "project", "art"]).default("project"),
      featured: z.boolean().default(false),
      coverImage: z
        .object({
          alt: z.string(),
          src: image(),
        })
        .optional(),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
    }),
});

const page = defineCollection({
  loader: glob({
    base: "./content",
    pattern: "{home,about,projects,research,art,blog,cv}/index.md",
  }),
  schema: z.object({
    title: titleSchema,
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

export const collections = { post, note, tag, project, page };
