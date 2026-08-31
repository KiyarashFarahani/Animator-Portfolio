import { readdir } from "node:fs/promises";
import { join } from "node:path";

export interface MediaItem {
  src: string;
  name: string;
  kind: "image" | "video";
}

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);
const VIDEO_EXTS = new Set(["mp4", "mov", "webm"]);

export async function collectMedia(dir: string): Promise<MediaItem[]> {
  const out: MediaItem[] = [];

  async function walk(rel: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(join(process.cwd(), "public", rel), {
        withFileTypes: true,
      });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const child = `${rel}/${entry.name}`;
      if (entry.isDirectory()) {
        await walk(child);
      } else {
        const ext = entry.name.split(".").pop()?.toLowerCase() ?? "";
        if (IMAGE_EXTS.has(ext)) {
          out.push({ src: child, name: entry.name, kind: "image" });
        } else if (VIDEO_EXTS.has(ext)) {
          out.push({ src: child, name: entry.name, kind: "video" });
        }
      }
    }
  }

  await walk(dir);
  return out.sort((a, b) =>
    a.src.localeCompare(b.src, undefined, { numeric: true, sensitivity: "base" })
  );
}

export function orderMedia(items: MediaItem[], pinned?: string[]): MediaItem[] {
  if (!pinned?.length) return items;
  const rank = (item: MediaItem) => {
    const lower = item.src.toLowerCase();
    const idx = pinned.findIndex((p) => lower.endsWith(p.toLowerCase()));
    return idx === -1 ? pinned.length : idx;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}
