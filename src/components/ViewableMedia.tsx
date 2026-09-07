"use client";

import { useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import MediaViewer, { type OriginRect } from "@/components/MediaViewer";
import type { MediaItemWithMeta } from "@/lib/media-manifest";

/**
 * Wraps any story-page image markup so clicking it opens the shared
 * media viewer. `siblings` makes the viewer navigable across the whole
 * set (e.g. every image of a beat); defaults to the single item.
 */
export default function ViewableMedia({
  item,
  siblings,
  children,
  className = "w-fit max-w-full cursor-zoom-in",
}: {
  item: MediaItemWithMeta;
  siblings?: MediaItemWithMeta[];
  children: ReactNode;
  className?: string;
}) {
  const [origin, setOrigin] = useState<OriginRect | null>(null);

  const list = siblings && siblings.length > 0 ? siblings : [item];
  const start = Math.max(
    0,
    list.findIndex((m) => m.src === item.src)
  );

  const open = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ left: r.left, top: r.top, width: r.width, height: r.height });
  };
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const r = e.currentTarget.getBoundingClientRect();
      setOrigin({ left: r.left, top: r.top, width: r.width, height: r.height });
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${item.name}`}
        onClick={open}
        onKeyDown={onKey}
        className={`${className} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60`}
      >
        {children}
      </div>
      {origin && (
        <MediaViewer
          items={list}
          index={start}
          origin={origin}
          onClose={() => setOrigin(null)}
        />
      )}
    </>
  );
}
