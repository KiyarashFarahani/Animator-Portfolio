import Image from "next/image";
import Link from "next/link";
import { aboutData } from "@/lib/about";
import SoftwareLogo from "./SoftwareLogo";

const chipClass =
  "rounded-full bg-neutral-900/50 px-4 py-1.5 text-sm text-white/70 ring-1 ring-white/10";

const ctaLinkClass =
  "text-sm font-semibold text-white/60 transition hover:text-white";

function Portrait({ priority = false }: { priority?: boolean }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-neutral-900/50 ring-1 ring-white/10">
      <Image
        src="/About/profile.webp"
        alt="Masoud Azad portrait"
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    </div>
  );
}

export default function AboutSection({
  variant = "preview",
}: {
  variant?: "preview" | "full";
}) {
  const full = variant === "full";
  const bio = full ? aboutData.bio : aboutData.bio.slice(0, 2);

  return (
    <section
      className={`relative mx-auto max-w-7xl px-6 lg:px-16 ${
        full ? "pt-32 pb-24" : "pb-24"
      }`}
    >
      {!full && (
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">About Me</h2>
          <Link href="/about" className={ctaLinkClass}>
            More about me →
          </Link>
        </div>
      )}

      <div className="space-y-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {full && (
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                About Me
              </h1>
            )}
            <div
              className={`space-y-6 text-lg leading-relaxed text-white/70 ${
                full ? "mt-8" : ""
              }`}
            >
              {bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Portrait priority={full} />
          </div>
        </div>

        <div className="border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold text-white">What I Do</h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {aboutData.whatIDo.map((item) => (
              <div key={item.title} className="space-y-3">
                <h3 className="font-semibold text-white">{item.title}</h3>
                {item.description ? (
                  <p
                    className={`text-sm leading-relaxed text-white/50${
                      full ? "" : " line-clamp-2"
                    }`}
                  >
                    {item.description}
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm text-white/50">
                    {item.items?.map((subItem) => (
                      <li key={subItem}>{subItem}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {full && (
          <div className="border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white">
              Professional Strengths
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              {aboutData.strengths.map((strength) => (
                <span key={strength} className={chipClass}>
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold text-white">Software</h2>
          <div className="mt-10 grid grid-cols-3 justify-items-center gap-x-2 gap-y-6 sm:flex sm:flex-wrap sm:justify-start sm:gap-4 sm:gap-y-8">
            {aboutData.software.map((software) => (
              <SoftwareLogo
                key={software}
                name={software}
                showLabel={full}
              />
            ))}
          </div>
        </div>

        {full && (
          <div className="border-t border-white/10 pt-16">
            <p className="text-lg text-white/70">
              Interested in working together?
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-base font-semibold text-neutral-900 shadow-lg transition hover:bg-white/85 active:scale-95"
            >
              Get in Touch
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
