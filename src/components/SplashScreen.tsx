"use client";

import { useEffect, useRef, useState } from "react";

function preloadImages(sources: string[], onProgress: (loaded: number) => void): Promise<void> {
  if (sources.length === 0) return Promise.resolve();
  let loaded = 0;
  return Promise.all(
    sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          const done = () => {
            loaded += 1;
            onProgress(loaded);
            resolve();
          };
          img.onload = done;
          img.onerror = done;
          img.src = src;
        })
    )
  ).then(() => undefined);
}

export default function SplashScreen({
  assets,
  maxDuration = 2500,
  minDuration = 500,
  oncePerSession = true,
}: {
  assets: string[];
  maxDuration?: number;
  minDuration?: number;
  oncePerSession?: boolean;
}) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const total = assets.length;
  const assetsRef = useRef(assets);
  assetsRef.current = assets;

  useEffect(() => {
    try {
      if (document.documentElement.classList.contains("ma-splash-seen")) {
        setVisible(false);
        document.documentElement.dataset.maSplash = "done";
        return;
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!visible) return;

    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.maSplash = "loading";
    const t0 = Date.now();

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        if (oncePerSession) {
          sessionStorage.setItem("ma_splash_seen", "1");
          document.documentElement.classList.add("ma-splash-seen");
        }
      } catch {}
      document.documentElement.dataset.maSplash = "exiting";
      window.dispatchEvent(new CustomEvent("ma:splash-exit"));
      setExiting(true);
      window.setTimeout(() => {
        setVisible(false);
        document.documentElement.dataset.maSplash = "done";
        window.dispatchEvent(new CustomEvent("ma:splash-done"));
        document.documentElement.style.overflow = originalOverflow;
      }, 850);
    };

    const scheduleFinish = (extraDelay = 0) => {
      const elapsed = Date.now() - t0;
      const delay = Math.max(extraDelay, minDuration - elapsed);
      if (delay <= 0) finish();
      else window.setTimeout(finish, delay);
    };

    const tMax = window.setTimeout(finish, maxDuration);

    if (total === 0) {
      window.clearTimeout(tMax);
      scheduleFinish(0);
    } else {
      preloadImages(assetsRef.current, (loaded) => {
        setProgress(Math.round((loaded / total) * 100));
        if (loaded === total) {
          window.clearTimeout(tMax);
          scheduleFinish(220);
        }
      }).catch(() => {
        window.clearTimeout(tMax);
        scheduleFinish(0);
      });
    }

    return () => {
      window.clearTimeout(tMax);
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [maxDuration, minDuration, oncePerSession, total, visible]);

  if (!visible) return null;

  const pct = total === 0 ? 100 : progress;

  return (
    <div
      data-ma-splash
      aria-label="Loading"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background px-6 will-change-transform ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        transition: exiting
          ? "transform 850ms cubic-bezier(0.76,0,0.24,1), border-radius 850ms cubic-bezier(0.76,0,0.24,1)"
          : undefined,
        borderRadius: exiting ? "0 0 48px 48px" : "0",
      }}
    >
      <div
        className={`absolute inset-0 bg-background transition-transform duration-700 ease-out ${
          exiting ? "scale-[0.98]" : "scale-100"
        }`}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[80px]" />
        <div className="absolute -bottom-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[70px]" />
      </div>

      <div
        className={`relative flex flex-col items-center text-center will-change-transform ${
          exiting ? "opacity-0 scale-[0.96] blur-[6px]" : "opacity-100 scale-100 blur-0"
        }`}
        style={{ transition: "all 600ms cubic-bezier(0.22,1,0.36,1)" }}
      >
        <p className="text-[11px] font-semibold tracking-[0.28em] text-white/35 uppercase">Portfolio</p>

        <h1 className="mt-3 text-[28px] font-bold tracking-tight text-white sm:text-[32px]">
          Masoud Azad
          <span className="mt-1 block text-sm font-normal tracking-wide text-white/45">
            2D Character Animator &amp; Visual Development Artist
          </span>
        </h1>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="relative h-px w-[180px] overflow-hidden rounded-full bg-white/10 sm:w-[220px]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/40 blur-[6px] transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] tracking-widest text-white/40 tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 animate-pulse rounded-full bg-white/60" />
              {pct}%
            </span>
            <span className="text-white/15">·</span>
            <span className="text-white/30">Loading</span>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? "scaleX(0.5)" : "scaleX(1)",
          transition: "all 600ms ease",
        }}
      />
    </div>
  );
}
