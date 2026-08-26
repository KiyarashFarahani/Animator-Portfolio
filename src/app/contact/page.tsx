import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Me — Masoud Azad" };

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="text-4xl font-bold sm:text-5xl">Contact Me</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          Interested in working together or have a project in mind? I&apos;d
          love to hear from you.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-white/70">
          Contact details and social links are coming soon.
        </p>
      </div>
    </main>
  );
}
