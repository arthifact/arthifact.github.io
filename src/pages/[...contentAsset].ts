import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { contentAssets } from "@/utils/content-files";

export const getStaticPaths = (async () => {
  const drafts = await getCollection(
    "post",
    ({ data }) => import.meta.env.PROD && data.draft,
  );
  const excluded = drafts.flatMap((post) =>
    post.filePath ? [dirname(post.filePath)] : [],
  );
  return contentAssets(excluded).map((asset) => ({
    params: { contentAsset: decodeURIComponent(asset.url.slice(1)) },
    props: asset,
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { file, type } = props as InferGetStaticPropsType<
    typeof getStaticPaths
  >;
  return new Response(new Uint8Array(await readFile(file)), {
    headers: { "Content-Type": type },
  });
};
