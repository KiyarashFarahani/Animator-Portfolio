import type { Metadata } from "next";
import Image from "next/image";
import { aboutData } from "@/lib/about";
import SoftwareLogo from "@/components/SoftwareLogo";

export const metadata: Metadata = { title: "About Me — Masoud Azad" };

export default function AboutPage() {
  return (
    <main className="min-h-screen text-white">
      <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-16">
        <div className="max-w-4xl space-y-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold sm:text-5xl">About Me</h1>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-white/70">
                {aboutData.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-white/10 bg-neutral-900/50">
                <Image
                  src="/About/profile.jpeg"
                  alt="Masoud Azad portrait"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white text-center">What I Do</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto">
              {aboutData.whatIDo.map((item, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  {item.description ? (
                    <p className="text-sm text-white/50">{item.description}</p>
                  ) : (
                    <ul className="text-sm text-white/50 space-y-1">
                      {item.items?.map((subItem, j) => (
                        <li key={j}>{subItem}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white text-center">Professional Strengths</h2>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              {aboutData.strengths.map((strength) => (
                <span
                  key={strength}
                  className="rounded-full bg-neutral-900/50 px-4 py-1.5 text-sm text-white/70 ring-1 ring-white/10"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white text-center">Software</h2>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              {aboutData.software.map((software) => (
                <SoftwareLogo key={software} name={software} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}