"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutData } from "@/lib/about";
import SoftwareLogo from "./SoftwareLogo";

export default function AboutSection({ 
  centered = false, 
  compact = false 
}: { centered?: boolean; compact?: boolean }) {
  const containerClass = centered ? "max-w-4xl mx-auto" : "max-w-7xl mx-auto";
  const paddingClass = compact ? "py-12 lg:py-16" : "py-24 lg:px-16";

  return (
    <section className={`relative ${containerClass} px-6 ${paddingClass}`}>
      <div className="max-w-4xl space-y-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className={centered ? "text-3xl font-bold text-white text-center" : "text-3xl font-bold text-white"}>About</h2>
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
          <h3 className={`text-2xl font-bold text-white ${centered ? "text-center" : ""}`}>What I Do</h3>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {aboutData.whatIDo.map((item, i) => (
              <div key={i} className="space-y-3">
                <h4 className="font-semibold text-white">{item.title}</h4>
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
          <h3 className={`text-2xl font-bold text-white ${centered ? "text-center" : ""}`}>Professional Strengths</h3>
          <div className={`mt-10 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>
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
          <h3 className={`text-2xl font-bold text-white ${centered ? "text-center" : ""}`}>Software</h3>
          <div className={`mt-10 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>
            {aboutData.software.map((software) => (
              <SoftwareLogo key={software} name={software} />
            ))}
          </div>
        </div>

        <div className={`border-t border-white/10 pt-16 ${centered ? "text-center" : ""}`}>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition"
          >
            View full profile →
          </Link>
        </div>
      </div>
    </section>
  );
}