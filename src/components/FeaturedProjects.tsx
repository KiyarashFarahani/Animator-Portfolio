"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { MediaItem } from "@/lib/projects-server";

interface FeaturedProjectsProps {
  covers: Array<MediaItem | null>;
}

export default function FeaturedProjects({ covers }: FeaturedProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const scrollWidth = wrapper.scrollWidth - container.clientWidth;

    const tl = gsap.to(wrapper, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        start: "center center",
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [covers]);

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-24 lg:px-16" ref={containerRef}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
        <Link
          href="/projects"
          className="text-sm font-semibold text-white/60 hover:text-white transition"
        >
          View all →
        </Link>
      </div>

      <div className="relative h-[320px] lg:h-[380px]" ref={wrapperRef}>
        <div
          className="flex gap-6 h-full pb-6"
          style={{ width: "max-content" }}
        >
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative flex-shrink-0 w-[320px] sm:w-[400px] lg:w-[480px] rounded-2xl bg-neutral-900/50 ring-1 ring-white/10 overflow-hidden transition hover:ring-white/30 hover:bg-neutral-900"
            >
              {covers[i] ? (
                <Image
                  src={encodeURI(`/${covers[i]!.src}`)}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 80vw, 20vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="aspect-[21/9] w-full bg-neutral-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <h3 className="text-lg font-bold text-white group-hover:text-white/90">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}