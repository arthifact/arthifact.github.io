import { type CollectionEntry, getCollection } from "astro:content";

/** Published blog posts: drafts show only in development. */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
  return await getCollection("post", ({ data }) => {
    return !data.unlisted && (import.meta.env.PROD ? !data.draft : true);
  });
}
