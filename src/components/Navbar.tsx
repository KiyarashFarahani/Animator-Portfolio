'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
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

export default function Navbar() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<SVGSVGElement | null>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);

  const isProjectsActive =
    pathname === '/projects' || pathname.startsWith('/projects/');

  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { y: -14, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.08 }
      );
      if (listRef.current) {
        const items = Array.from(listRef.current.querySelectorAll(':scope > li'));
        gsap.fromTo(
          items,
          { y: 6, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
        );
      }
      if (dropdownRef.current) gsap.set(dropdownRef.current, { autoAlpha: 0, y: -6, scale: 0.98 });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const activeIndex = navItems.findIndex((item) =>
      item.children ? isProjectsActive : pathname === item.href
    );
    if (activeIndex === -1) {
      gsap.to(indicator, { autoAlpha: 0, duration: 0.2, overwrite: true });
      return;
    }
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const left = el.offsetLeft;
    const width = el.offsetWidth;
    if (reduce) {
      gsap.set(indicator, { x: left, width, autoAlpha: 1 });
      return;
    }
    const isFirst = indicator.dataset.ready !== '1';
    if (isFirst) {
      gsap.set(indicator, { x: left, width, autoAlpha: 1, scale: 0.96 });
      gsap.to(indicator, {
        scale: 1,
        duration: 0.42,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => {
          if (indicator) indicator.dataset.ready = '1';
        },
      });
    } else {
      gsap.to(indicator, { x: left, width, autoAlpha: 1, duration: 0.42, ease: 'power3.out', overwrite: true });
    }
    const onResize = () => {
      const l = el.offsetLeft;
      const w = el.offsetWidth;
      gsap.set(indicator, { x: l, width: w });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [pathname, isProjectsActive]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        rotate: projectsOpen ? 180 : 0,
        duration: 0.32,
        ease: 'power3.out',
        overwrite: true,
      });
    }
    const el = dropdownRef.current;
    if (!el) return;
    if (projectsOpen) {
      gsap.set(el, { display: 'block' });
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.32,
        ease: 'power3.out',
        overwrite: true,
      });
      const items = el.querySelectorAll('li');
      gsap.fromTo(
        items,
        { y: 5, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.28, stagger: 0.04, delay: 0.08, ease: 'power2.out', overwrite: true }
      );
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        y: -6,
        scale: 0.98,
        duration: 0.22,
        ease: 'power2.in',
        overwrite: true,
        onComplete: () => gsap.set(el, { display: 'none' }),
      });
    }
  }, [projectsOpen]);

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
    `relative z-10 flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-semibold transition-colors duration-200 sm:gap-1.5 sm:px-4 sm:text-sm ${
      active ? 'text-white' : 'text-neutral-900'
    }`;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        ref={rootRef}
        aria-label="Main navigation"
        className="relative flex items-center rounded-full bg-white p-1.5 shadow-lg shadow-black/20 ring-1 ring-black/5 will-change-transform"
      >
        <ul ref={listRef} className="relative flex items-center gap-0.5 sm:gap-1">
          <div
            ref={indicatorRef}
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-neutral-900 opacity-0 will-change-transform"
            style={{ width: 0 }}
          />
          {navItems.map((item, idx) =>
            item.children ? (
              <li
                key={item.href}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setProjectsOpen((open) => !open)}
                  aria-expanded={projectsOpen}
                  aria-haspopup="true"
                  className={linkCls(isProjectsActive)}
                >
                  {item.label}
                  <svg
                    ref={chevronRef}
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  ref={dropdownRef}
                  style={{ display: 'none' }}
                  className="absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 rounded-2xl bg-white p-2 shadow-xl shadow-black/20 ring-1 ring-black/5 sm:w-56 will-change-transform"
                >
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
              </li>
            ) : (
              <li
                key={item.href}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
              >
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
