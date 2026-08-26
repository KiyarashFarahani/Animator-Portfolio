'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { projects } from '@/lib/projects';

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href: string;
  label: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  {
    href: '/projects',
    label: 'Projects',
    children: projects.map((p) => ({ href: `/projects/${p.slug}`, label: p.title })),
  },
  { href: '/about', label: 'About Me' },
  { href: '/contact', label: 'Contact Me' },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);

  const isProjectsActive =
    pathname === '/projects' || pathname.startsWith('/projects/');

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setProjectsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProjectsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const linkCls = (active: boolean) =>
    `flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-semibold transition sm:gap-1.5 sm:px-4 sm:text-sm ${
      active ? 'bg-neutral-900 text-white' : 'text-neutral-900 hover:bg-neutral-100'
    }`;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        ref={rootRef}
        aria-label="Main navigation"
        className="relative flex items-center rounded-full bg-white p-1.5 shadow-lg shadow-black/20 ring-1 ring-black/5"
      >
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) =>
            item.children ? (
              <li key={item.href} className="relative">
                <button
                  type="button"
                  onClick={() => setProjectsOpen((open) => !open)}
                  aria-expanded={projectsOpen}
                  aria-haspopup="true"
                  className={linkCls(isProjectsActive)}
                >
                  {item.label}
                  <ChevronIcon open={projectsOpen} />
                </button>
                {projectsOpen && (
                  <div className="absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 rounded-2xl bg-white p-2 shadow-xl shadow-black/20 ring-1 ring-black/5 sm:w-56">
                    <ul className="flex flex-col gap-0.5">
                      {item.children.map((child) => {
                        const active = pathname === child.href;
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={active ? 'page' : undefined}
                              onClick={() => setProjectsOpen(false)}
                              className={`block rounded-xl px-4 py-2.5 text-sm transition ${
                                active
                                  ? 'bg-neutral-900 font-semibold text-white'
                                  : 'font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={linkCls(pathname === item.href)}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}
