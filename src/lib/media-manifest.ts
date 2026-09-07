import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { MediaItem } from "./projects-server";

export interface MediaMeta {
  w: number;
  h: number;
  blur: string;
  poster?: string;
}

export type MediaItemWithMeta = MediaItem & { meta?: MediaMeta };

interface ManifestEntry {
  mtime: number;
  w: number;
  h: number;
  blur: string;
  poster?: string;
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

const VIDEO_EXTS = new Set(["mp4", "mov", "webm"]);

function run(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    import("node:child_process").then(({ spawn }) => {
      const p = spawn(cmd, args);
      let out = "";
      let err = "";
      p.stdout.on("data", (d) => (out += d));
      p.stderr.on("data", (d) => (err += d));
      p.on("error", reject);
      p.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(err || `${cmd} ${code}`))));
    });
  });
}

async function probeVideoDimensions(absPath: string): Promise<{ w: number; h: number }> {
  const out = await run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", absPath]);
  const [w, h] = out.trim().split(",").map(Number);
  if (!w || !h) throw new Error(`no dimensions for ${absPath}`);
  return { w, h };
}

async function probeDuration(absPath: string): Promise<number> {
  try {
    const out = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", absPath]);
    const d = parseFloat(out.trim());
    return Number.isFinite(d) && d > 0 ? d : 1;
  } catch {
    return 1;
  }
}

function posterRelFor(src: string): string {
  const withoutExt = src.replace(/\.[^.]+$/, "");
  return `video-posters/${withoutExt}.jpg`;
}

async function ensureVideoPoster(src: string, absVideoPath: string): Promise<{ w: number; h: number; blur: string; poster: string }> {
  const { w, h } = await probeVideoDimensions(absVideoPath);
  const posterRel = posterRelFor(src);
  const absPoster = join(process.cwd(), "public", posterRel);
  await mkdir(join(absPoster, ".."), { recursive: true });
  const posterStat = await stat(absPoster).catch(() => null);
  const videoStat = await stat(absVideoPath).catch(() => null);
  const posterIsFresh = !!posterStat && !!videoStat && posterStat.mtimeMs >= videoStat.mtimeMs;
  if (!posterIsFresh) {
    const duration = await probeDuration(absVideoPath);
    const mid = Math.max(0.1, duration / 2);
    await run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-ss", String(mid), "-i", absVideoPath, "-frames:v", "1", "-q:v", "3", "-vf", "scale=640:-2", absPoster]);
  }
  const sharp = (await import("sharp")).default;
  const buf = await readFile(absPoster);
  const meta = await sharp(buf).metadata();
  const blurBuf = await sharp(buf).resize(8, 8, { fit: "inside" }).jpeg({ quality: 40 }).toBuffer();
  return {
    w: meta.width ?? w,
    h: meta.height ?? h,
    blur: `data:image/jpeg;base64,${blurBuf.toString("base64")}`,
    poster: posterRel,
  };
}

async function generateEntry(absPath: string, src: string): Promise<Omit<ManifestEntry, "mtime">> {
  const ext = absPath.split(".").pop()?.toLowerCase() ?? "";
  if (VIDEO_EXTS.has(ext)) {
    try {
      const p = await ensureVideoPoster(src, absPath);
      return { w: p.w, h: p.h, blur: p.blur, poster: p.poster };
    } catch {
      const { w, h } = await probeVideoDimensions(absPath);
      return { w, h, blur: "" };
    }
  }
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
        const generated = await generateEntry(join(process.cwd(), "public", item.src), item.src);
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
