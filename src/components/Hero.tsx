"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(section, { autoAlpha: 1 });
      return;
    }

    const els = {
      bg: bgRef.current,
      text: textRef.current ? Array.from(textRef.current.children) : [],
      art: artRef.current,
    };

    let played = false;
    let raf = 0;
    const play = () => {
      if (played) return;
      played = true;
      cancelAnimationFrame(raf);
      gsap.set(els.bg, { scale: 1.08, filter: "blur(8px)" });
      gsap.set(els.text, { y: 28, autoAlpha: 0 });
      gsap.set(els.art, { x: 48, scale: 0.97, autoAlpha: 0 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(els.bg, { scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }, 0);
      tl.to(els.text, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0.15);
      tl.to(els.art, { x: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, 0.2);
      tl.eventCallback("onComplete", () => ScrollTrigger.refresh());
      return tl;
    };

    const isVisible = () => {
      const r = section.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(section).visibility !== "hidden";
    };

    const tryPlay = () => {
      if (!isVisible()) {
        raf = requestAnimationFrame(tryPlay);
        return;
      }
      play();
    };

    if (document.visibilityState === "hidden") {
      const onVisible = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVisible);
          tryPlay();
        }
      };
      document.addEventListener("visibilitychange", onVisible);
      return () => document.removeEventListener("visibilitychange", onVisible);
    }

    const splashState = document.documentElement.dataset.maSplash;
    const splashSeen = document.documentElement.classList.contains("ma-splash-seen");
    if (splashState === "done" || splashSeen || splashState === undefined) {
      tryPlay();
      return () => cancelAnimationFrame(raf);
    }

    const onExit = () => tryPlay();
    const onPageDone = () => tryPlay();
    window.addEventListener("ma:splash-exit", onExit, { once: true });
    window.addEventListener("ma:page-transition-done", onPageDone, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("ma:splash-exit", onExit);
      window.removeEventListener("ma:page-transition-done", onPageDone);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/Hero/dusha_02_bg.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover select-none pointer-events-none"
          draggable={false}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col-reverse items-center justify-center gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-2 md:px-8 lg:px-12 md:py-0">
        <div ref={textRef} className="max-w-xl shrink-0 text-center md:text-left">
          <p className="text-white/75 text-lg sm:text-xl">Hi, I&apos;m</p>
          <h1 className="mt-2 text-5xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            Masoud Azad
          </h1>
          <p className="mt-3 text-lg text-white/75 sm:text-xl">
            2D Character Animator & Visual Development Artist
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
            <Link
              href="/projects"
              className="rounded-full bg-white px-7 py-3 text-base font-semibold text-neutral-900 shadow-lg transition hover:bg-white/85 active:scale-95"
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/40 px-7 py-3 text-base font-semibold text-white transition hover:border-white/70 hover:bg-white/10 active:scale-95"
            >
              About Me
            </Link>
          </div>
        </div>

        <img
          ref={artRef}
          src="/Hero/animation.gif"
          alt="Masoud Azad character illustration"
          width={1920}
          height={1920}
          className="h-auto w-[94vw] max-w-[560px] object-contain select-none drop-shadow-2xl sm:max-w-[600px] md:w-auto md:flex-1 md:min-w-0 md:max-h-[92vh] md:max-w-none md:mr-[calc(50%-50vw-2rem)] lg:mr-[calc(50%-50vw-3rem)] will-change-transform"
          draggable={false}
        />
      </div>
    </section>
  );
}
