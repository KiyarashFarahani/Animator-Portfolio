import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-white/[0.03]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold tracking-tight text-white">Masoud Azad</p>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-white/45">
              2D Character Animator &amp; Visual Development Artist
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex text-sm font-medium text-white/70 transition hover:text-white"
            >
              Get in touch →
            </Link>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex gap-5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/50 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Masoud Azad. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://kiyarashfarahani.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/40 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/25"
            >
              Kiyarash Farahani
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
