import { existsSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import aliases from "../../content/site/asset-aliases.json" with { type: "json" };

export const contentRoot = resolve("content");
export const assetTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".csv": "text/csv",
  ".txt": "text/plain",
  ".bib": "text/plain",
  ".zip": "application/zip",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export function relativeContentPath(file: string) {
  const target = resolve(file);
  const inside = (path: string) => {
    const rel = relative(contentRoot, path);
    return rel !== ".." && !rel.startsWith(`..${sep}`) && !rel.startsWith(sep);
  };
  if (
    !inside(target) ||
    (existsSync(target) && !inside(realpathSync(target)))
  ) {
    throw new Error(`Content files must stay inside content/: ${file}`);
  }
  const path = relative(contentRoot, target).split(sep).join("/");
  if (
    path.split("/").some((part) => part.startsWith(".")) ||
    path.startsWith("templates/")
  ) {
    throw new Error(`This content file is not public: ${file}`);
  }
  return path;
}

export function contentAssetUrl(path: string) {
  const alias = Object.entries(aliases).find(([, target]) => target === path);
  return (
    alias?.[0] ??
    `/content/${path.split("/").map(encodeURIComponent).join("/")}`
  );
}

/** Resolve an attachment beside its Markdown, retaining existing public URLs. */
export function contentFileUrl(filePath: string, href: string) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return href;
  const match = href.match(/^([^?#]+)(.*)$/);
  if (!match) return href;
  const target = resolve(dirname(filePath), decodeURIComponent(match[1]!));
  const path = relativeContentPath(target);
  if (!existsSync(target) || !statSync(target).isFile()) {
    throw new Error(`Missing attachment in ${filePath}: ${href}`);
  }
  if (!assetTypes[extname(target).toLowerCase()]) {
    throw new Error(
      `Unsupported attachment ${href}. Link to an article's public URL instead.`,
    );
  }
  return contentAssetUrl(path) + match[2];
}

/** Only explicit media/download types are published, never Markdown or config. */
export function contentAssets(excludedDirectories: string[] = []) {
  const excluded = excludedDirectories.map((p) => resolve(p));
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const file = resolve(dir, entry.name);
      if (
        entry.name.startsWith(".") ||
        entry.name === "templates" ||
        entry.isSymbolicLink() ||
        excluded.some((p) => file === p || file.startsWith(p + sep))
      )
        return [];
      if (entry.isDirectory()) return walk(file);
      return entry.isFile() && assetTypes[extname(file).toLowerCase()]
        ? [file]
        : [];
    });
  const assets = walk(contentRoot).map((file) => ({
    file,
    url: contentAssetUrl(relativeContentPath(file)),
    type: assetTypes[extname(file).toLowerCase()]!,
  }));
  for (const target of Object.values(aliases)) {
    const file = resolve(contentRoot, target);
    relativeContentPath(file);
    if (!assets.some((asset) => asset.file === file))
      throw new Error(`Missing public asset alias: ${target}`);
  }
  return assets;
}
