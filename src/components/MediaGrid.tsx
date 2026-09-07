/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import type { MediaItemWithMeta } from "@/lib/media-manifest";
import MediaViewer, { type OriginRect } from "@/components/MediaViewer";

const CHUNK_SIZE = 24;
const SIZES = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 264px";

// per-segment encoding: leaves "/" intact, escapes "&" and spaces that
// encodeURI would keep raw and break the optimizer query string with
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

// shortest-column-first placement: deterministic and append-only, so tiles
// already on screen keep their position when a new chunk is added
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

export default function MediaGrid({
  media,
  priorityCount = 0,
  maxCols,
}: {
  media: MediaItemWithMeta[];
  priorityCount?: number;
  /** cap column count — used when the grid sits in a narrow (e.g. split) column */
  maxCols?: number;
}) {
  const [count, setCount] = useState(() => Math.min(CHUNK_SIZE, media.length));
  const [selected, setSelected] = useState<{
    item: MediaItemWithMeta;
    origin: OriginRect;
  } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const colCount = useColumnCount();
  const cols = Math.min(colCount, maxCols ?? 4);
  // tile width follows the breakpoint's standard column count, so sparse
  // galleries keep standard-size tiles and center instead of stretching
  const basis = maxCols ?? colCount;
  const hasMore = count < media.length;

  const columns = useMemo(
    () => distribute(media.slice(0, count), cols),
    [media, count, cols]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;

    let raf = 0;
    const maybeLoad = () => {
      // geometric check (covers scroll-restoration jumps the observer can miss)
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
              // GIFs stay on plain <img>: preserves animation and shares the
              // exact cached URL with the viewer, so first open never flashes
              const animated = /\.gif$/i.test(item.src);
              const open = (e: ReactMouseEvent<HTMLButtonElement>) => {
                const r = e.currentTarget.getBoundingClientRect();
                setSelected({
                  item,
                  origin: { left: r.left, top: r.top, width: r.width, height: r.height },
                });
              };
              return (
                <button
                  key={item.src}
                  type="button"
                  onClick={open}
                  aria-label={`View ${item.name}`}
                  className="tile block w-full cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-white/10 transition hover:ring-white/30 focus-visible:outline-2 focus-visible:outline-white/60"
                >
                  {item.kind === "image" && item.meta && !animated ? (
                    <Image
                      src={srcOf(item)}
                      alt={item.name}
                      width={item.meta.w}
                      height={item.meta.h}
                      sizes={SIZES}
                      blurDataURL={item.meta.blur}
                      placeholder="blur"
                      priority={priority}
                      loading={priority ? undefined : "lazy"}
                      className="pointer-events-none w-full"
                    />
                  ) : item.kind === "image" ? (
                    <img
                      src={srcOf(item)}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none w-full"
                    />
                  ) : (
                    <span className="relative block aspect-video w-full bg-white/5">
                      <video
                        src={srcOf(item)}
                        muted
                        playsInline
                        preload="metadata"
                        className="pointer-events-none h-full w-full object-cover"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/25"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
                          <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
                        </svg>
                      </span>
                    </span>
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
          item={selected.item}
          origin={selected.origin}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
