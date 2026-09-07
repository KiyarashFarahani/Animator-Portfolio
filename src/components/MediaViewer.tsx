/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap } from "gsap";
import type { MediaItemWithMeta } from "@/lib/media-manifest";

export interface OriginRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// per-segment encoding: leaves "/" intact, escapes "&" and spaces that
// encodeURI would keep raw and break the optimizer query string with
function srcOf(item: MediaItemWithMeta): string {
  return `/${item.src.split("/").map(encodeURIComponent).join("/")}`;
}

const isGif = (src: string) => /\.gif$/i.test(src);

// centered rect fitting the item's aspect into 90vw x 80vh
function targetFor(item: MediaItemWithMeta, vw: number, vh: number, origin: OriginRect) {
  const aspect =
    item.meta && item.meta.w > 0 && item.meta.h > 0
      ? item.meta.w / item.meta.h
      : origin.width > 0 && origin.height > 0
        ? origin.width / origin.height
        : 4 / 3;
  let width = vw * 0.9;
  let height = width / aspect;
  const maxH = vh * 0.8;
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }
  return { left: (vw - width) / 2, top: (vh - height) / 2, width, height };
}

export default function MediaViewer({
  items,
  index,
  origin,
  getOrigin,
  onClose,
}: {
  /** full navigable list (gallery, beat images, …) */
  items: MediaItemWithMeta[];
  /** index of the initially opened item */
  index: number;
  origin: OriginRect;
  /** live thumbnail rect of an item — used so closing minimizes into the
   * currently shown image, not the first one opened. Return null when the
   * thumbnail isn't in the DOM (e.g. not yet loaded). */
  getOrigin?: (item: MediaItemWithMeta) => OriginRect | null;
  onClose: () => void;
}) {
  // portal target exists only on the client — avoids SSR mismatch and
  // escapes any transformed/filtered ancestor that would break `fixed`
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [current, setCurrent] = useState(index);
  const currentRef = useRef(index);
  const dirRef = useRef<1 | -1>(1);
  const busyRef = useRef(false);
  const openedRef = useRef(false);
  const enteredRef = useRef(false);
  const closingRef = useRef(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);

  const count = items.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (count < 2 || busyRef.current || closingRef.current || !openedRef.current) return;
      busyRef.current = true;
      dirRef.current = dir;
      const el = contentRef.current;
      if (!el) {
        busyRef.current = false;
        return;
      }
      // slide current content out, then swap (enter runs via effect below)
      gsap.to(el, {
        x: -90 * dir,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          const next = (currentRef.current + dir + count) % count;
          currentRef.current = next;
          setCurrent(next);
        },
      });
    },
    [count]
  );

  const close = useCallback(() => {
    if (closingRef.current) return;
    if (!tileRef.current || !backdropRef.current) {
      onClose();
      return;
    }
    closingRef.current = true;
    gsap.killTweensOf(contentRef.current);
    gsap.to(chromeRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
    // minimize into the currently shown image's thumbnail; if that
    // thumbnail isn't mounted, fade out in place instead of flying to a
    // stale rect
    const live = getOrigin?.(items[currentRef.current]);
    if (live) {
      gsap.to(tileRef.current, {
        left: live.left,
        top: live.top,
        width: live.width,
        height: live.height,
        borderRadius: 16,
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: onClose,
      });
    } else {
      gsap.to(tileRef.current, {
        opacity: 0,
        scale: 0.97,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    }
  }, [getOrigin, items, onClose]);

  // keys: Escape closes, arrows navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close, go]);

  // FLIP open animation: tile starts exactly over the thumbnail,
  // then maximizes to a centered rect fitted to the viewport
  useLayoutEffect(() => {
    const tile = tileRef.current;
    const backdrop = backdropRef.current;
    const chrome = chromeRef.current;
    if (!tile || !backdrop) return;

    gsap.set(tile, {
      left: origin.left,
      top: origin.top,
      width: origin.width,
      height: origin.height,
    });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(chrome, { opacity: 0 });

    const open = gsap.to(tile, {
      ...targetFor(items[index], window.innerWidth, window.innerHeight, origin),
      duration: 0.4,
      ease: "power3.out",
      onComplete: () => {
        openedRef.current = true;
      },
    });
    gsap.to(backdrop, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(chrome, { opacity: 1, duration: 0.3, delay: 0.25 });

    return () => {
      open.kill();
    };
    // run once on mount — item/origin are fixed for this viewer instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // enter animation after navigating: resize tile to the new aspect
  // while the new content slides in from the travel direction
  useLayoutEffect(() => {
    if (!enteredRef.current) {
      enteredRef.current = true;
      return;
    }
    const tile = tileRef.current;
    const content = contentRef.current;
    if (!tile || !content) {
      busyRef.current = false;
      return;
    }
    gsap.set(content, { x: 90 * dirRef.current, opacity: 0 });
    gsap.to(tile, {
      ...targetFor(items[current], window.innerWidth, window.innerHeight, origin),
      duration: 0.3,
      ease: "power3.out",
    });
    gsap.to(content, {
      x: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power3.out",
      onComplete: () => {
        busyRef.current = false;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // touch swipe (mobile) to slide between items — desktop wheel
  // intentionally does nothing so scrolling never flips images
  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const s = touchRef.current;
    touchRef.current = null;
    if (!s || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  if (!mounted) return null;

  const item = items[current] ?? items[index];
  // Same image pipeline as the grid (optimizer + inline blur placeholder),
  // so first open reuses cached variants instead of flashing in a fresh
  // full-size download. GIFs stay on plain <img> to preserve animation.
  const useOptimized = item.kind === "image" && item.meta && !isGif(item.src);

  const navBtn =
    "pointer-events-auto absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95";

  return createPortal(
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-[100]"
    >
      <div
        ref={backdropRef}
        onClick={close}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        aria-hidden
      />
      {/* floating tile: morphs from thumbnail rect to centered viewer */}
      <div
        ref={tileRef}
        className="absolute overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/15"
      >
        <div ref={contentRef} className="h-full w-full">
          {item.kind === "video" ? (
            <video
              key={item.src}
              src={srcOf(item)}
              controls
              autoPlay
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            />
          ) : useOptimized ? (
            <Image
              key={item.src}
              src={srcOf(item)}
              alt={item.name}
              fill
              sizes="90vw"
              priority
              placeholder="blur"
              blurDataURL={item.meta!.blur}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              key={item.src}
              src={srcOf(item)}
              alt={item.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
        </div>
      </div>
      {/* chrome fades in after the maximize lands */}
      <div ref={chromeRef} className="pointer-events-none absolute inset-0">
        <button
          onClick={close}
          aria-label="Close viewer"
          className="pointer-events-auto absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95 sm:right-6 sm:top-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className={`${navBtn} left-3 sm:left-5`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className={`${navBtn} right-3 sm:right-5`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.21 5.23a.75.75 0 01.02 1.06L11.168 10l-3.938 3.71a.75.75 0 111.04 1.08l4.5-4.25a.75.75 0 010-1.08l-4.5-4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}
        {/* filename caption hidden for now — restore when needed
        <p className="absolute inset-x-0 bottom-5 mx-auto w-fit max-w-[90vw] truncate rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70 ring-1 ring-white/15">
          {item.name}
        </p>
        */}
      </div>
    </div>,
    document.body
  );
}
