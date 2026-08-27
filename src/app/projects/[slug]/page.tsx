/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { collectMedia } from "@/lib/projects-server";
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

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const media = await collectMedia(project.dir);

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

        {media.length > 0 ? (
          <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {media.map((item) =>
              item.kind === "image" ? (
                <img
                  key={item.src}
                  src={encodeURI(`/${item.src}`)}
                  alt={item.name}
                  loading="lazy"
                  className="w-full break-inside-avoid rounded-2xl ring-1 ring-white/10"
                />
              ) : (
                <video
                  key={item.src}
                  src={encodeURI(`/${item.src}`)}
                  controls
                  preload="metadata"
                  className="w-full break-inside-avoid rounded-2xl ring-1 ring-white/10"
                />
              )
            )}
          </div>
        ) : (
          <p className="mt-12 text-white/50">Work coming soon.</p>
        )}
      </div>
    </main>
  );
}
