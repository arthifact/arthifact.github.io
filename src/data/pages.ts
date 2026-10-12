import { getEntry } from "astro:content";
import { contentFileUrl } from "@/utils/content-files";

export async function pageContent(id: string) {
  const page = await getEntry("page", id);
  if (!page) throw new Error(`Missing content/${id}/index.md`);
  if (!page.rendered)
    throw new Error(
      `Could not render content/${id}/index.md. Check its Markdown and local links.`,
    );
  return page;
}

export async function cvContent() {
  const cv = await pageContent("cv");
  if (!cv.filePath || !cv.data.download)
    throw new Error("The CV needs a download in content/cv/index.md");
  return { ...cv.data, href: contentFileUrl(cv.filePath, cv.data.download) };
}
