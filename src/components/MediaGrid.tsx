/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import type { MediaItemWithMeta } from "@/lib/media-manifest";
import MediaViewer, { type OriginRect } from "@/components/MediaViewer";

const CHUNK_SIZE = 24;
const SIZES = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 264px";

function srcOf(item: MediaItemWithMeta): string {
  return `/${item.src.split("/").map(encodeURIComponent).join("/")}`;
}

function useColumnCount(): number {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const queries = [
      { mq: window.matchMedia("(min-width: 1024px)"), cols: 4 },
      { mq: window.matchMedia("(min-width: 768px)"), cols: 3 },
    ];
    const compute = () => {
      setCols(queries.find(({ mq }) => mq.matches)?.cols ?? 2);
    };
    compute();
    queries.forEach(({ mq }) => mq.addEventListener("change", compute));
    return () => queries.forEach(({ mq }) => mq.removeEventListener("change", compute));
  }, []);
  return cols;
}

function distribute(
  items: MediaItemWithMeta[],
  cols: number
): { item: MediaItemWithMeta; index: number }[][] {
  const columns: { item: MediaItemWithMeta; index: number }[][] = Array.from(
    { length: cols },
    () => []
  );
  const heights = new Array(cols).fill(0);
  items.forEach((item, index) => {
    const aspect = item.meta ? item.meta.h / item.meta.w : 3 / 4;
    const i = heights.indexOf(Math.min(...heights));
    columns[i].push({ item, index });
    heights[i] += aspect;
  });
  return columns;
}

function TileImage({
  src,
  alt,
  width,
  height,
  aspect,
  sizes,
  blur,
  priority,
  fitSquare,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspect?: string;
  sizes: string;
  blur: string;
  priority: boolean;
  fitSquare?: boolean;
}) {
  const [loaded, setLoaded] = useState(priority);
  return (
    <span
      className={`relative block w-full overflow-hidden ${fitSquare ? "bg-white" : ""}`}
      style={{ aspectRatio: fitSquare ? "1/1" : aspect }}
    >
      {!loaded && <span aria-hidden className="skeleton skeleton-shimmer absolute inset-0" />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        blurDataURL={blur}
        placeholder="blur"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`pointer-events-none transition-opacity duration-500 ${fitSquare ? "h-full w-full object-contain" : "w-full"} ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}

function TileImg({
  src,
  alt,
  aspect,
  meta,
  fitSquare,
}: {
  src: string;
  alt: string;
  aspect?: string;
  meta: { w: number; h: number };
  fitSquare?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span
      className={`relative block w-full overflow-hidden ${fitSquare ? "bg-white" : ""}`}
      style={{ aspectRatio: fitSquare ? "1/1" : aspect }}
    >
      {!loaded && <span aria-hidden className="skeleton skeleton-shimmer absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        width={meta.w}
        height={meta.h}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`pointer-events-none transition-opacity duration-500 ${fitSquare ? "h-full w-full object-contain" : "w-full"} ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}

function TileVideo({
  src,
  poster,
  alt,
  aspect,
  meta,
  fitSquare,
}: {
  src: string;
  poster?: string;
  alt: string;
  aspect?: string;
  meta?: { w: number; h: number; blur: string };
  fitSquare?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  if (poster && meta) {
    return (
      <span
        className={`relative block w-full overflow-hidden ${fitSquare ? "bg-white" : "bg-white/5"}`}
        style={{ aspectRatio: fitSquare ? "1/1" : aspect }}
      >
        {!loaded && <span aria-hidden className="skeleton skeleton-shimmer absolute inset-0" />}
        <Image
          src={srcOf({ src: poster, name: alt, kind: "image", meta } as MediaItemWithMeta)}
          alt={alt}
          width={meta.w}
          height={meta.h}
          sizes={SIZES}
          blurDataURL={meta.blur}
          placeholder={meta.blur ? "blur" : "empty"}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`pointer-events-none transition-opacity duration-500 ${fitSquare ? "h-full w-full object-contain" : "w-full"} ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/25">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
            <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
          </svg>
        </span>
      </span>
    );
  }
  return (
    <span
      className={`relative block w-full overflow-hidden ${fitSquare ? "bg-white" : "bg-white/5"} ${!aspect && !fitSquare ? "aspect-[4/3]" : ""}`}
      style={{ aspectRatio: fitSquare ? "1/1" : aspect }}
    >
      {!loaded && <span aria-hidden className="skeleton skeleton-shimmer absolute inset-0" />}
      <video
        src={src}
        muted
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        onCanPlay={() => setLoaded(true)}
        className={`pointer-events-none h-full w-full transition-opacity duration-500 ${fitSquare ? "object-contain" : "object-cover"} ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/25">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
          <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
        </svg>
      </span>
    </span>
  );
}

export default function MediaGrid({
  media,
  priorityCount = 0,
  maxCols,
  fitSquare,
}: {
  media: MediaItemWithMeta[];
  priorityCount?: number;
  maxCols?: number;
  fitSquare?: boolean;
}) {
  const [count, setCount] = useState(() => Math.min(CHUNK_SIZE, media.length));
  const [selected, setSelected] = useState<{
    index: number;
    origin: OriginRect;
  } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const colCount = useColumnCount();
  const cols = Math.min(colCount, maxCols ?? 4);
  const basis = maxCols ?? colCount;
  const hasMore = count < media.length;

  const columns = useMemo(() => {
    if (fitSquare) {
      const n = media.slice(0, count).map((item, index) => ({ item, index }));
      const out: { item: MediaItemWithMeta; index: number }[][] = Array.from({ length: cols }, () => []);
      n.forEach((entry, i) => out[i % cols].push(entry));
      return out;
    }
    return distribute(media.slice(0, count), cols);
  }, [media, count, cols, fitSquare]);

  const getOrigin = useCallback((item: MediaItemWithMeta): OriginRect | null => {
    const el = document.querySelector<HTMLElement>(
      `button[data-viewer-src="${CSS.escape(item.src)}"]`
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;

    let raf = 0;
    const maybeLoad = () => {
      if (sentinel.getBoundingClientRect().top < window.innerHeight + 2000) {
        setCount((c) => Math.min(c + CHUNK_SIZE, media.length));
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setCount((c) => Math.min(c + CHUNK_SIZE, media.length));
        }
      },
      { rootMargin: "2000px 0px" }
    );
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(maybeLoad);
    };
    observer.observe(sentinel);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count, hasMore, media.length]);

  return (
    <>
      <div className="flex justify-center gap-4">
        {columns
          .filter((column) => column.length > 0)
          .map((column, ci) => (
            <div
              key={ci}
              style={{ width: `calc((100% - ${basis - 1}rem) / ${basis})` }}
              className="flex min-w-0 flex-col gap-4"
            >
            {column.map(({ item, index }) => {
              const priority = index < priorityCount && item.kind === "image";
              const animated = /\.gif$/i.test(item.src);
              const aspect = item.meta ? `${item.meta.w}/${item.meta.h}` : undefined;
              const open = (e: ReactMouseEvent<HTMLButtonElement>) => {
                const r = e.currentTarget.getBoundingClientRect();
                setSelected({
                  index,
                  origin: { left: r.left, top: r.top, width: r.width, height: r.height },
                });
              };
              return (
                <button
                  key={item.src}
                  type="button"
                  onClick={open}
                  aria-label={`View ${item.name}`}
                  data-viewer-src={item.src}
                  className="tile block w-full cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-white/10 transition hover:ring-white/30 focus-visible:outline-2 focus-visible:outline-white/60"
                >
                  {item.kind === "image" && item.meta && !animated ? (
                    <TileImage
                      src={srcOf(item)}
                      alt={item.name}
                      width={item.meta.w}
                      height={item.meta.h}
                      aspect={aspect}
                      sizes={SIZES}
                      blur={item.meta.blur}
                      priority={priority}
                      fitSquare={fitSquare}
                    />
                  ) : item.kind === "image" && item.meta ? (
                    <TileImg src={srcOf(item)} alt={item.name} aspect={aspect} meta={item.meta} fitSquare={fitSquare} />
                  ) : item.kind === "image" ? (
                    <span
                      aria-hidden
                      className={`block w-full ${fitSquare ? "aspect-square bg-white" : "skeleton skeleton-shimmer aspect-[4/3]"}`}
                    />
                  ) : (
                    <TileVideo src={srcOf(item)} poster={item.meta?.poster} alt={item.name} aspect={aspect} meta={item.meta} fitSquare={fitSquare} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} aria-hidden className="h-px" />}
      {selected && (
        <MediaViewer
          items={media}
          index={selected.index}
          origin={selected.origin}
          getOrigin={getOrigin}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
