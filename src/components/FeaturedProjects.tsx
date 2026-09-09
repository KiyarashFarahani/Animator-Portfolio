"use client";

import Link from "next/link";
import { FEATURED_ASSETS } from "@/lib/featured-assets";
import { DRIFT_WALL_META } from "@/lib/drift-wall-manifest";
import DriftWall from "./DriftWall";

export default function FeaturedProjects() {
  const items = FEATURED_ASSETS.map((src) => {
    const meta = (DRIFT_WALL_META as Record<string, { blur: string; w: number; h: number }>)[src];
    return { image: `/${src}`, title: src.split("/").pop() ?? src, blurDataURL: meta?.blur, width: meta?.w, height: meta?.h };
  });

  return (
    <section className="w-screen relative left-1/2 -ml-[50vw] h-screen bg-[#05080c] overflow-hidden isolate">
      <div className="absolute inset-0">
        <DriftWall
          items={items}
          columns={5}
          tileWidth={280}
          tileHeight={186}
          gap={20}
          tilt={10}
          turn={-8}
          perspective={1200}
          depth={70}
          speed={12}
          variance={0.25}
          parallax={0.25}
          fade={0.45}
          dim={0.65}
          overlayColor="#05080c"
        />
      </div>
      <div className="absolute inset-0 bg-[#05080c]/55" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-white/50 uppercase">Selected Work</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
          Chatacters, Concepts & Animations
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          Explore the full projects for films, concepts and animation.
        </p>
        <Link
          href="/projects"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold tracking-wide text-[#05080c] shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          Explore projects <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
