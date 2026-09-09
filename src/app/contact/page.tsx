import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — Masoud Azad" };

export default function ContactPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-[480px] w-[480px] rounded-full opacity-100"
          style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -left-32 h-[360px] w-[360px] rounded-full opacity-100"
          style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.035) 0%, transparent 70%)" }}
        />

        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.28em] text-white/30">CONTACT</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">Contact Me</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/55">
            For commissions, collaborations, or inquiries. I&apos;d love to hear from you.
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <a
              href="mailto:masoudazad2002@gmail.com"
              className="group relative overflow-hidden rounded-[28px] bg-white/[0.04] p-8 ring-1 ring-white/10 transition hover:bg-white/[0.06] hover:ring-white/15"
            >
              <div
                aria-hidden
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 transition group-hover:opacity-80"
                style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 7 9-7" />
                  </svg>
                </div>
                <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-white/30">EMAIL</p>
                <p className="mt-2 text-[17px] font-medium tracking-tight text-white break-all">masoudazad2002@gmail.com</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition group-hover:gap-3 group-hover:text-white">
                  Send an email <span aria-hidden>→</span>
                </span>
              </div>
            </a>

            <a
              href="https://instagram.com/mda_animation"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-[28px] bg-white/[0.04] p-8 ring-1 ring-white/10 transition hover:bg-white/[0.06] hover:ring-white/15"
            >
              <div
                aria-hidden
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 transition group-hover:opacity-80"
                style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-white/30">INSTAGRAM</p>
                <p className="mt-2 text-[17px] font-medium tracking-tight text-white">@mda_animation</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition group-hover:gap-3 group-hover:text-white">
                  Visit profile <span aria-hidden>→</span>
                </span>
              </div>
            </a>
          </div>


        </div>
      </div>
    </main>
  );
}
