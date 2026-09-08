"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EASE_COVER = "power3.inOut";
const EASE_REVEAL = "power3.out";
const EASE_EXIT = "cubic-bezier(0.76,0,0.24,1)";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef(true);
  const readyRef = useRef(false);
  const coveringRef = useRef(false);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    const splashEl = document.querySelector("[data-ma-splash]");
    const done =
      document.documentElement.dataset.maSplash === "done" ||
      document.documentElement.classList.contains("ma-splash-seen");
    if (splashEl && !done) {
      const onDone = () => {
        readyRef.current = true;
      };
      window.addEventListener("ma:splash-done", onDone, { once: true });
      return () => window.removeEventListener("ma:splash-done", onDone);
    }
    readyRef.current = true;
  }, []);

  useEffect(() => {
    const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (!readyRef.current || coveringRef.current) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) return;
      if (!href.startsWith("/")) return;
      if (a.target === "_blank") return;
      if (a.hasAttribute("download")) return;
      if (a.getAttribute("rel")?.includes("external")) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathnameRef.current && url.search === window.location.search && url.hash === window.location.hash) return;
      if (url.pathname === pathnameRef.current && url.hash) return;
      if (reduce()) return;

      const overlay = overlayRef.current;
      if (!overlay) return;
      e.preventDefault();
      coveringRef.current = true;
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { yPercent: -101 });
      gsap.to(overlay, {
        yPercent: 0,
        duration: 0.45,
        ease: EASE_COVER,
        overwrite: true,
        onComplete: () => router.push(href),
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!readyRef.current) return;
    const overlay = overlayRef.current;
    const root = contentRef.current;
    if (!overlay || !root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(overlay, { yPercent: -101 });
      gsap.set(root, { autoAlpha: 1, y: 0 });
      if (coveringRef.current) coveringRef.current = false;
      firstRef.current = false;
      return;
    }

    const isFirst = firstRef.current;
    firstRef.current = false;

    const isHomeWithSplash = pathname === "/" && !!document.querySelector("[data-ma-splash]");
    if (isFirst) {
      if (isHomeWithSplash) {
        gsap.set(root, { autoAlpha: 1, y: 0 });
        gsap.set(overlay, { yPercent: -101 });
        return;
      }
      const kids = Array.from(root.querySelectorAll(":scope > *")) as HTMLElement[];
      gsap.set(root, { autoAlpha: 1 });
      gsap.set(overlay, { yPercent: -101 });
      if (kids.length) {
        gsap.fromTo(kids, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.07, ease: EASE_REVEAL, overwrite: true });
      }
      return;
    }

    const kids = Array.from(root.querySelectorAll(":scope > *")) as HTMLElement[];
    const wasCovering = coveringRef.current;

    const ctx = gsap.context(() => {
      const finish = () => {
        gsap.set([root, ...kids], { clearProps: "transform,opacity,visibility" });
        gsap.set(root, { autoAlpha: 1 });
        if (kids.length) gsap.set(kids, { autoAlpha: 1 });
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent("ma:page-transition-done"));
          ScrollTrigger.refresh();
        });
      };
      if (wasCovering) {
        gsap.set(root, { autoAlpha: 1, y: 0 });
        if (kids.length) gsap.set(kids, { y: 18, autoAlpha: 0 });
        else gsap.set(root, { y: 18, autoAlpha: 0 });
        window.scrollTo(0, 0);
        const tl = gsap.timeline({
          defaults: { overwrite: true },
          onComplete: () => {
            coveringRef.current = false;
            finish();
          },
        });
        if (kids.length) tl.to(kids, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: EASE_REVEAL }, 0.08);
        else tl.to(root, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE_REVEAL }, 0.08);
        tl.to(overlay, { yPercent: -101, duration: 0.62, ease: EASE_EXIT as unknown as string }, "<0.12");
        return;
      }

      gsap.set(overlay, { yPercent: -101, borderRadius: "0 0 48px 48px" });
      gsap.set(root, { autoAlpha: 1, y: 0 });
      if (kids.length) gsap.set(kids, { y: 18, autoAlpha: 0 });
      else gsap.set(root, { y: 18, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { overwrite: true }, onComplete: finish });
      tl.to(overlay, { yPercent: 0, duration: 0.45, ease: EASE_COVER });
      tl.add(() => window.scrollTo(0, 0));
      if (kids.length) tl.to(kids, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: EASE_REVEAL }, "<0.08");
      else tl.to(root, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE_REVEAL }, "<0.08");
      tl.to(overlay, { yPercent: -101, duration: 0.62, ease: EASE_EXIT as unknown as string }, "<0.12");
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 bg-background will-change-transform"
        style={{ transform: "translateY(-101%)", borderRadius: "0 0 48px 48px" }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[80px]" />
          <div className="absolute -bottom-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[70px]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>
      <div ref={contentRef} className="flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
