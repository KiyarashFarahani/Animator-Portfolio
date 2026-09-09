"use client";

import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export interface DriftWallItem {
  image: string;
  title?: string;
  href?: string;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
}

interface ColumnMeta {
  copyHeight: number;
  copies: number;
}

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Tile ${i + 1}`,
  };
});

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function DriftTileImg({ src, reduced }: { src: string; reduced: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={cx(
        "block h-full w-full select-none object-cover",
        reduced
          ? loaded
            ? "opacity-100"
            : "opacity-0"
          : loaded
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-[1.06] blur-[6px]"
      )}
      style={{
        transition: reduced
          ? "opacity 220ms ease-out"
          : "opacity 700ms ease-out, transform 700ms ease-out, filter 700ms ease-out",
        willChange: loaded ? "auto" : "opacity, transform, filter",
      }}
    />
  );
}

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 10,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  fade = 1.0,
  dim = 0.55,
  overlayColor = "#05080c",
  className = "",
  style,
}: DriftWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(3, Math.ceil((containerHeight * 2.6) / copyHeight) + 2);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => {
      const base = meta.copyHeight * ((c * 0.37) % 1);
      return ((base % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
    });
    velocitiesRef.current = columnItems.map(() => 0);
    for (let c = 0; c < trackRefs.current.length; c++) {
      const el = trackRefs.current[c];
      const meta = columnMeta[c];
      if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
    }
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const target = baseVelocities[c];
          const ease = 1 - Math.exp(-dt / 0.28);
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;
          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, parallax, reduced, applyPlaneTransform]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || parallax === 0 || reduced) return;
      pointerRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
    },
    [parallax, reduced]
  );

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = { x: 0, y: 0 };
  }, []);

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        "--dw-tile-w": `${tileWidth}px`,
        "--dw-tile-h": `${tileHeight}px`,
        "--dw-gap": `${gap}px`,
        "--dw-radius": `${radius}px`,
        "--dw-dim": dim,
        "--dw-overlay": overlayColor,
        perspective: `${perspective}px`,
        perspectiveOrigin: "50% 50%",
        ...style,
      }) as CSSProperties,
    [tileWidth, tileHeight, gap, radius, dim, overlayColor, perspective, style]
  );

  return (
    <div
      ref={containerRef}
      className={cx("relative h-full w-full overflow-hidden pointer-events-none", className)}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform [backface-visibility:hidden]"
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]" key={`col-${c}`}>
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform [backface-visibility:hidden]"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => (
                    <div
                      key={`${c}-${copyIndex}-${itemIndex}`}
                      className="relative block flex-none w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]"
                    >
                      <span className="absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#0a1218] rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]">
                        <DriftTileImg src={item.image} reduced={reduced} />
                        <span className="pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.28]" aria-hidden="true" />
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #05080c 0%, transparent 16%, transparent 84%, #05080c 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default DriftWall;
