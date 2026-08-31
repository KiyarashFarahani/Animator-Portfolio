/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { collectMedia, orderMedia } from "@/lib/projects-server";
import { attachMeta, type MediaItemWithMeta } from "@/lib/media-manifest";
import { projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} — Masoud Azad` : "Project — Masoud Azad" };
}

const SIZES = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 264px";

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const galleries = project.galleries
    ? await Promise.all(
        project.galleries.map(async (gallery) => ({
          ...gallery,
          media: await attachMeta(
            orderMedia(await collectMedia(gallery.dir), gallery.pinned)
          ),
        }))
      )
    : null;
  const media = galleries
    ? []
    : await attachMeta(orderMedia(await collectMedia(project.dir), project.pinned));

  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <Link
          href="/projects"
          className="text-sm font-semibold text-white/50 transition hover:text-white"
        >
          ← All projects
        </Link>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{project.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">{project.description}</p>

        {galleries ? (
          galleries.map((gallery, i) => (
            <section key={gallery.title} className="mt-14">
              <h2 className="text-2xl font-semibold sm:text-3xl">{gallery.title}</h2>
              <div className="mt-6">
                {gallery.media.length > 0 ? (
                  <MediaGrid media={gallery.media} priorityCount={i === 0 ? 3 : 0} />
                ) : (
                  <p className="text-white/50">Work coming soon.</p>
                )}
              </div>
            </section>
          ))
        ) : media.length > 0 ? (
          <div className="mt-12">
            <MediaGrid media={media} priorityCount={3} />
          </div>
        ) : (
          <p className="mt-12 text-white/50">Work coming soon.</p>
        )}
      </div>
    </main>
  );
}

function MediaGrid({
  media,
  priorityCount = 0,
}: {
  media: MediaItemWithMeta[];
  priorityCount?: number;
}) {
  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
      {media.map((item, i) => {
        const priority = i < priorityCount && item.kind === "image";
        if (item.kind === "image" && item.meta) {
          return (
            <Image
              key={item.src}
              src={encodeURI(`/${item.src}`)}
              alt={item.name}
              width={item.meta.w}
              height={item.meta.h}
              sizes={SIZES}
              blurDataURL={item.meta.blur}
              placeholder="blur"
              priority={priority}
              loading={priority ? undefined : "lazy"}
              className="h-auto w-full break-inside-avoid rounded-2xl ring-1 ring-white/10"
            />
          );
        }
        if (item.kind === "image") {
          return (
            <img
              key={item.src}
              src={encodeURI(`/${item.src}`)}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className="w-full break-inside-avoid rounded-2xl ring-1 ring-white/10"
            />
          );
        }
        return (
          <video
            key={item.src}
            src={encodeURI(`/${item.src}`)}
            controls
            preload="metadata"
            className="aspect-video w-full break-inside-avoid rounded-2xl bg-white/5 ring-1 ring-white/10"
          />
        );
      })}
    </div>
  );
}
