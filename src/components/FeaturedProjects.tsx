"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { motion, useScroll, useTransform } from "motion/react";
import { MediaItem } from "@/lib/projects-server";

interface FeaturedProjectsProps {
  covers: Array<MediaItem | null>;
}

export default function FeaturedProjects({ covers }: FeaturedProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    const sticky = stickyRef.current;
    if (!gallery || !sticky) return;
    const update = () => setDistance(Math.max(0, gallery.scrollWidth - sticky.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(gallery);
    ro.observe(sticky);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [covers]);

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-16 pt-24 pb-10">
      <div ref={containerRef} className="scroll-container relative h-[220vh]">
        <div ref={stickyRef} className="sticky-wrapper sticky top-0 flex h-[100vh] flex-col justify-center gap-8 overflow-hidden py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
            <Link href="/projects" className="text-sm font-semibold text-white/60 hover:text-white transition">
              View all →
            </Link>
          </div>

          <motion.div ref={galleryRef} className="gallery flex gap-6 will-change-transform" style={{ x }}>
            {projects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group relative flex-shrink-0 aspect-[16/10] w-[360px] sm:w-[520px] lg:w-[640px] rounded-2xl bg-neutral-900/50 ring-1 ring-white/10 overflow-hidden transition hover:ring-white/30 hover:bg-neutral-900"
              >
                {covers[i] ? (
                  covers[i]!.kind === "video" ? (
                    <video
                      src={encodeURI(`/${covers[i]!.src}`)}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : /\.gif$/i.test(covers[i]!.src) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={encodeURI(`/${covers[i]!.src}`)}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <Image
                      src={`/${covers[i]!.src}`}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 360px, (max-width: 1024px) 520px, 640px"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  )
                ) : (
                  <div className="h-full w-full bg-neutral-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white group-hover:text-white/90">{project.title}</h3>
                  <p className="mt-2 text-sm text-white/50 line-clamp-2">{project.description}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
