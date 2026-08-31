/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { MediaItemWithMeta } from "@/lib/media-manifest";

const CHUNK_SIZE = 24;
const SIZES = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 264px";

// per-segment encoding: leaves "/" intact, escapes "&" and spaces that
// encodeURI would keep raw and break the optimizer query string with
function srcOf(item: MediaItemWithMeta): string {
  return `/${item.src.split("/").map(encodeURIComponent).join("/")}`;
}

export default function MediaGrid({
  media,
  priorityCount = 0,
}: {
  media: MediaItemWithMeta[];
  priorityCount?: number;
}) {
  const [count, setCount] = useState(() => Math.min(CHUNK_SIZE, media.length));
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = count < media.length;

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
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {media.slice(0, count).map((item, i) => {
          const priority = i < priorityCount && item.kind === "image";
          if (item.kind === "image" && item.meta) {
            return (
              <Image
                key={item.src}
                src={srcOf(item)}
                alt={item.name}
                width={item.meta.w}
                height={item.meta.h}
                sizes={SIZES}
                blurDataURL={item.meta.blur}
                placeholder="blur"
                priority={priority}
                loading={priority ? undefined : "lazy"}
                className="tile h-auto w-full break-inside-avoid rounded-2xl ring-1 ring-white/10"
              />
            );
          }
          if (item.kind === "image") {
            return (
              <img
                key={item.src}
                src={srcOf(item)}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="tile w-full break-inside-avoid rounded-2xl ring-1 ring-white/10"
              />
            );
          }
          return (
            <video
              key={item.src}
              src={srcOf(item)}
              controls
              preload="metadata"
              className="tile aspect-video w-full break-inside-avoid rounded-2xl bg-white/5 ring-1 ring-white/10"
            />
          );
        })}
      </div>
      {hasMore && <div ref={sentinelRef} aria-hidden className="h-px" />}
    </>
  );
}
