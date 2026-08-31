import { readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { MediaItem } from "./projects-server";

export interface MediaMeta {
  w: number;
  h: number;
  blur: string;
}

export type MediaItemWithMeta = MediaItem & { meta?: MediaMeta };

interface ManifestEntry {
  mtime: number;
  w: number;
  h: number;
  blur: string;
}

type ManifestData = Record<string, ManifestEntry>;

const MANIFEST_PATH = join(process.cwd(), "media-manifest.json");
let cache: ManifestData | null = null;

async function loadManifest(): Promise<ManifestData> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await readFile(MANIFEST_PATH, "utf8")) as ManifestData;
  } catch {
    cache = {};
  }
  return cache;
}

async function generateEntry(absPath: string): Promise<Omit<ManifestEntry, "mtime">> {
  const sharp = (await import("sharp")).default;
  const buffer = await readFile(absPath);
  const metadata = await sharp(buffer).metadata();
  const blur = await sharp(buffer)
    .resize(8, 8, { fit: "inside" })
    .jpeg({ quality: 40 })
    .toBuffer();
  if (!metadata.width || !metadata.height) {
    throw new Error(`no dimensions for ${absPath}`);
  }
  return {
    w: metadata.width,
    h: metadata.height,
    blur: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
}

export async function attachMeta(items: MediaItem[]): Promise<MediaItemWithMeta[]> {
  const manifest = await loadManifest();
  let dirty = false;

  await Promise.all(
    items.map(async (item) => {
      const st = await stat(join(process.cwd(), "public", item.src)).catch(() => null);
      if (!st) return;
      const mtime = Math.floor(st.mtimeMs);
      const entry = manifest[item.src];
      if (entry && entry.mtime === mtime) return;
      try {
        const generated = await generateEntry(join(process.cwd(), "public", item.src));
        manifest[item.src] = { mtime, ...generated };
        dirty = true;
      } catch {
        // unreadable file — render without meta
      }
    })
  );

  if (dirty) {
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest)).catch(() => {});
  }

  return items.map((item) => ({ ...item, meta: manifest[item.src] }));
}
