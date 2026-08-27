import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Me — Masoud Azad" };

export default function AboutPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="text-4xl font-bold sm:text-5xl">About Me</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          Hi, I&apos;m Masoud Azad — a 2D character animator and visual
          development artist. I bring characters to life through movement,
          acting and design, from initial concept sketches to fully animated
          shots.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-white/70">
          More about my journey, experience and process is coming soon.
        </p>
      </div>
    </main>
  );
}
