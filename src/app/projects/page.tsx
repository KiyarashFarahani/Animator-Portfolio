/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { collectMedia } from "@/lib/projects-server";
import { projects } from "@/lib/projects";

export const metadata = { title: "Projects — Masoud Azad" };

export default async function ProjectsPage() {
  const covers = await Promise.all(
    projects.map(async (project) => {
      const media = await collectMedia(project.dir);
      return media.find((item) => item.kind === "image");
    })
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <h1 className="text-4xl font-bold sm:text-5xl">Projects</h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          Selected work across animation, design and film.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group overflow-hidden rounded-3xl bg-neutral-900 ring-1 ring-white/10 transition hover:ring-white/30"
            >
              {covers[i] ? (
                <img
                  src={encodeURI(`/${covers[i]!.src}`)}
                  alt={project.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="aspect-[16/10] w-full bg-neutral-800" />
              )}
              <div className="p-6">
                <h2 className="flex items-center justify-between text-xl font-bold">
                  {project.title}
                  <span
                    aria-hidden
                    className="text-white/40 transition group-hover:translate-x-1 group-hover:text-white"
                  >
                    →
                  </span>
                </h2>
                <p className="mt-1.5 text-sm text-white/60">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
