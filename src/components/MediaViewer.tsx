/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
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

export default function MediaViewer({
  item,
  origin,
  onClose,
}: {
  item: MediaItemWithMeta;
  origin: OriginRect;
  onClose: () => void;
}) {
  // portal target exists only on the client — avoids SSR mismatch and
  // escapes any transformed/filtered ancestor that would break `fixed`
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const backdropRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const close = useCallback(() => {
    if (closingRef.current) return;
    if (!tileRef.current || !backdropRef.current) {
      onClose();
      return;
    }
    closingRef.current = true;
    gsap.to(chromeRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
    gsap.to(tileRef.current, {
      left: origin.left,
      top: origin.top,
      width: origin.width,
      height: origin.height,
      borderRadius: 16,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: onClose,
    });
  }, [origin, onClose]);

  // Escape to close + scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  // FLIP open animation: tile starts exactly over the thumbnail,
  // then maximizes to a centered rect fitted to the viewport
  useLayoutEffect(() => {
    const tile = tileRef.current;
    const backdrop = backdropRef.current;
    const chrome = chromeRef.current;
    if (!tile || !backdrop) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspect =
      item.meta && item.meta.w > 0 && item.meta.h > 0
        ? item.meta.w / item.meta.h
        : origin.width > 0 && origin.height > 0
          ? origin.width / origin.height
          : 4 / 3;

    // max viewer footprint: 90vw wide, 80vh tall (room for caption/close)
    let targetW = vw * 0.9;
    let targetH = targetW / aspect;
    const maxH = vh * 0.8;
    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * aspect;
    }

    gsap.set(tile, {
      left: origin.left,
      top: origin.top,
      width: origin.width,
      height: origin.height,
    });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(chrome, { opacity: 0 });

    const open = gsap.to(tile, {
      left: (vw - targetW) / 2,
      top: (vh - targetH) / 2,
      width: targetW,
      height: targetH,
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(backdrop, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(chrome, { opacity: 1, duration: 0.3, delay: 0.25 });

    return () => {
      open.kill();
    };
    // run once on mount — item/origin are fixed for this viewer instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  // Same image pipeline as the grid (optimizer + inline blur placeholder),
  // so first open reuses cached variants instead of flashing in a fresh
  // full-size download. GIFs stay on plain <img> to preserve animation.
  const useOptimized = item.kind === "image" && item.meta && !isGif(item.src);

  return createPortal(
    <>
      <div
        ref={backdropRef}
        onClick={close}
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
        aria-hidden
      />
      {/* floating tile: morphs from thumbnail rect to centered viewer */}
      <div
        ref={tileRef}
        className="fixed z-[100] overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/15"
      >
        {item.kind === "video" ? (
          <video
            src={srcOf(item)}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : useOptimized ? (
          <Image
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
            src={srcOf(item)}
            alt={item.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}
      </div>
      {/* chrome fades in after the maximize lands */}
      <div ref={chromeRef} className="pointer-events-none fixed inset-0 z-[100]">
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
        {/* filename caption hidden for now — restore when needed
        <p className="absolute inset-x-0 bottom-5 mx-auto w-fit max-w-[90vw] truncate rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70 ring-1 ring-white/15">
          {item.name}
        </p>
        */}
      </div>
    </>,
    document.body
  );
}
