import Image from "next/image";
import Link from "next/link";
import MediaGrid from "@/components/MediaGrid";
import { attachMeta } from "@/lib/media-manifest";
import type { MediaItemWithMeta, MediaMeta } from "@/lib/media-manifest";
import type { Project, StoryBeat, StoryChapter } from "@/lib/projects";

function srcOf(item: MediaItemWithMeta): string {
  return `/${item.src.split("/").map(encodeURIComponent).join("/")}`;
}

// unified scale: showcase images are sized by a shared target height, so a
// portrait and a landscape shot carry the same visual weight on the page
function scaledDims(meta: MediaMeta | undefined, targetH: number) {
  if (!meta) return null;
  return { w: Math.round((targetH * meta.w) / meta.h), h: targetH };
}

const SHOWCASE_CLS = "h-auto w-auto max-w-full rounded-2xl ring-1 ring-white/10";

function Feature({ item, caption }: { item: MediaItemWithMeta; caption?: string }) {
  const dims = scaledDims(item.meta, 460);
  if (!item.meta || !dims) {
    return (
      <figure className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={srcOf(item)} alt={item.name} className="w-full rounded-3xl ring-1 ring-white/10" />
      </figure>
    );
  }
  return (
    <figure className="flex flex-col items-center">
      <Image
        src={srcOf(item)}
        alt={caption ?? item.name}
        width={dims.w}
        height={dims.h}
        blurDataURL={item.meta.blur}
        placeholder="blur"
        sizes={`${dims.w}px`}
        className={`${SHOWCASE_CLS} rounded-3xl`}
      />
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-white/50">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Duo({ items }: { items: MediaItemWithMeta[] }) {
  return (
    <div className="grid items-center justify-items-center gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const dims = scaledDims(item.meta, 400);
        if (!item.meta || !dims) {
          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={item.src}
              src={srcOf(item)}
              alt={item.name}
              loading="lazy"
              className={SHOWCASE_CLS}
            />
          );
        }
        return (
          <Image
            key={item.src}
            src={srcOf(item)}
            alt={item.name}
            width={dims.w}
            height={dims.h}
            blurDataURL={item.meta.blur}
            placeholder="blur"
            sizes={`${dims.w}px`}
            className={SHOWCASE_CLS}
          />
        );
      })}
    </div>
  );
}

function SplitImage({ item }: { item: MediaItemWithMeta }) {
  const dims = scaledDims(item.meta, 400);
  if (!item.meta || !dims) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={srcOf(item)} alt={item.name} className="w-full rounded-2xl ring-1 ring-white/10" />
    );
  }
  return (
    <Image
      src={srcOf(item)}
      alt={item.name}
      width={dims.w}
      height={dims.h}
      blurDataURL={item.meta.blur}
      placeholder="blur"
      sizes={`${dims.w}px`}
      style={{ height: dims.h }}
      className="w-auto max-w-full rounded-2xl ring-1 ring-white/10"
    />
  );
}

// typographic tiers: short copy opens as a lead line, long as plain body —
// so text columns can hold their own next to heavy imagery
function textTier(chars: number): "lead" | "body" {
  if (chars <= 430) return "lead";
  return "body";
}

const LEAD_CLS = "text-xl font-semibold leading-snug text-white/90 sm:text-2xl";
const BODY_CLS = "leading-relaxed text-white/70";

function ParagraphBlock({
  subheading,
  paragraphs,
  align = "center",
}: {
  subheading?: string;
  paragraphs?: string[];
  align?: "center" | "left";
}) {
  if (!paragraphs?.length && !subheading) return null;
  const chars = (paragraphs ?? []).join(" ").length + (subheading?.length ?? 0);
  const tier = textTier(chars);
  const wrap = align === "center" ? "mx-auto max-w-3xl text-center" : "";

  return (
    <div className={`${wrap} space-y-4`}>
      {subheading ? <p className={LEAD_CLS}>{subheading}</p> : null}
      {paragraphs?.map((p, i) => (
        <p key={i} className={!subheading && tier === "lead" && i === 0 ? LEAD_CLS : BODY_CLS}>
          {p}
        </p>
      ))}
    </div>
  );
}

function Split({ beat, get }: { beat: StoryBeat; get: (names: string[]) => MediaItemWithMeta[] }) {
  const items = get(beat.images ?? []);
  const cols = beat.cols ?? (items.length > 2 ? 2 : 1);
  const side = beat.side ?? "right";

  const text = (
    <ParagraphBlock subheading={beat.subheading} paragraphs={beat.paragraphs} align="left" />
  );

  const images =
    items.length > 2 ? (
      <MediaGrid media={items} maxCols={cols} />
    ) : (
      <div>
        <div
          className={
            cols === 2
              ? "grid items-center justify-items-center gap-4 sm:grid-cols-2"
              : "flex flex-col items-center gap-4"
          }
        >
          {items.map((item) => (
            <SplitImage key={item.src} item={item} />
          ))}
        </div>
        {beat.caption ? (
          <p className="mt-3 text-center text-sm text-white/50">{beat.caption}</p>
        ) : null}
      </div>
    );

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
      {side === "left" ? (
        <>
          {images}
          {text}
        </>
      ) : (
        <>
          {text}
          {images}
        </>
      )}
    </div>
  );
}

function Beat({
  beat,
  get,
  priority,
}: {
  beat: StoryBeat;
  get: (names: string[]) => MediaItemWithMeta[];
  priority: boolean;
}) {
  const items = beat.images ? get(beat.images) : [];
  const layout =
    beat.layout ?? (items.length === 1 ? "feature" : items.length === 2 ? "duo" : "masonry");

  if (layout === "split") {
    return <Split beat={beat} get={get} />;
  }

  return (
    <div className="space-y-12">
      <ParagraphBlock subheading={beat.subheading} paragraphs={beat.paragraphs} />
      {items.length > 0 && layout === "feature" && (
        <Feature item={items[0]} caption={beat.caption} />
      )}
      {items.length > 0 && layout === "duo" && <Duo items={items} />}
      {items.length > 0 && layout === "trio" && (
        <div className="grid items-center justify-items-center gap-4 sm:grid-cols-3">
          {items.map((item) => {
            const dims = scaledDims(item.meta, 340);
            if (!item.meta || !dims) {
              return (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={item.src}
                  src={srcOf(item)}
                  alt={item.name}
                  loading="lazy"
                  className={SHOWCASE_CLS}
                />
              );
            }
            return (
              <Image
                key={item.src}
                src={srcOf(item)}
                alt={item.name}
                width={dims.w}
                height={dims.h}
                blurDataURL={item.meta.blur}
                placeholder="blur"
                sizes={`${dims.w}px`}
                className={SHOWCASE_CLS}
              />
            );
          })}
        </div>
      )}
      {items.length > 0 && layout === "masonry" && (
        <MediaGrid media={items} priorityCount={priority ? 2 : 0} />
      )}
    </div>
  );
}

function Chapter({ chapter, get, isFirst }: { chapter: StoryChapter; get: (names: string[]) => MediaItemWithMeta[]; isFirst: boolean }) {
  return (
    <section id={chapter.id} className="scroll-mt-28">
      <div className="mb-20 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <header className="mx-auto max-w-3xl text-center">
        {chapter.eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
            {chapter.eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight sm:text-5xl">
          {chapter.heading}
        </h2>
        {chapter.subheading ? (
          <p className="mt-4 text-xl italic text-white/80 sm:text-2xl">{chapter.subheading}</p>
        ) : null}
      </header>
      {chapter.paragraphs?.length ? (
        <div className="mt-12">
          <ParagraphBlock paragraphs={chapter.paragraphs} />
        </div>
      ) : null}
      <div className="mt-12 space-y-14">
        {chapter.beats?.map((beat, i) => (
          <Beat key={i} beat={beat} get={get} priority={isFirst && i === 0} />
        ))}
      </div>
      {chapter.note ? (
        <aside className="mx-auto mt-12 max-w-2xl border-l-2 border-emerald-300/40 pl-5 text-sm leading-relaxed text-white/55">
          <span className="font-semibold not-italic text-emerald-200/80">*Note — </span>
          {chapter.note}
        </aside>
      ) : null}
    </section>
  );
}

function TitleBlock({
  project,
  intro,
  align,
}: {
  project: Project;
  intro?: Project["intro"];
  align: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : "text-left"}>
      {intro?.subtitle ? (
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80 sm:text-sm">
          {intro.subtitle}
        </p>
      ) : null}
      <h1
        className={`mt-4 text-5xl font-black uppercase tracking-tight sm:text-7xl ${
          center ? "" : "sm:text-6xl"
        }`}
      >
        {project.title}
      </h1>
      {intro?.disciplines ? (
        <div className={`mt-4 flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}>
          {intro.disciplines.split("·").map((discipline) => (
            <span
              key={discipline}
              className="rounded-full bg-neutral-900/50 px-4 py-1.5 text-sm text-white/70 ring-1 ring-white/10"
            >
              {discipline.trim()}
            </span>
          ))}
        </div>
      ) : null}
      {intro?.logline ? (
        <p
          className={`mt-4 text-lg italic leading-snug text-white/80 sm:text-xl ${
            center ? "mx-auto max-w-2xl" : ""
          }`}
        >
          {intro.logline}
        </p>
      ) : null}
    </div>
  );
}

function HeroImage({ item, alt }: { item: MediaItemWithMeta; alt: string }) {
  const dims = scaledDims(item.meta, 560);
  if (!item.meta || !dims) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={srcOf(item)} alt={alt} className="w-full rounded-3xl ring-1 ring-white/10" />
    );
  }
  return (
    <Image
      src={srcOf(item)}
      alt={alt}
      width={dims.w}
      height={dims.h}
      blurDataURL={item.meta.blur}
      placeholder="blur"
      priority
      sizes="(min-width: 768px) 50vw, 100vw"
      className={`${SHOWCASE_CLS} rounded-3xl`}
    />
  );
}

function FullWidthImage({
  item,
  alt,
  priority,
}: {
  item: MediaItemWithMeta;
  alt: string;
  priority?: boolean;
}) {
  if (!item.meta) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={srcOf(item)} alt={alt} className="w-full rounded-3xl ring-1 ring-white/10" />
    );
  }
  return (
    <Image
      src={srcOf(item)}
      alt={alt}
      width={item.meta.w}
      height={item.meta.h}
      blurDataURL={item.meta.blur}
      placeholder="blur"
      priority={priority}
      sizes="(min-width: 1152px) 1152px, 100vw"
      className="h-auto w-full rounded-3xl ring-1 ring-white/10"
    />
  );
}

export default async function StoryView({ project }: { project: Project }) {
  const story = project.story ?? [];
  const intro = project.intro;

  const names = new Set<string>(intro?.heroImages ?? []);
  for (const chapter of story) {
    for (const beat of chapter.beats ?? []) {
      for (const name of beat.images ?? []) names.add(name);
    }
  }
  const metas = await attachMeta(
    [...names].map((name) => ({ src: `${project.dir}/${name}`, name, kind: "image" as const }))
  );
  const bySrc = new Map(metas.map((m) => [m.src, m]));
  const get = (list: string[]) =>
    list
      .map((name) => bySrc.get(`${project.dir}/${name}`))
      .filter((m): m is MediaItemWithMeta => Boolean(m))
      .map((m) => ({ ...m }));

  const heroItems = intro?.heroImages ? get(intro.heroImages) : [];

  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:pt-32">
        <Link
          href="/projects"
          className="text-sm font-semibold text-white/50 transition hover:text-white"
        >
          ← All projects
        </Link>

        {heroItems.length > 1 && (
          <div className="mt-14 flex flex-col items-center gap-6">
            {heroItems.slice(1).map((item, i) => (
              <FullWidthImage key={item.src} item={item} alt={project.title} priority={i === 0} />
            ))}
          </div>
        )}

        <header className={`mt-14 ${heroItems.length > 0 ? "" : "text-center"}`}>
          {heroItems.length > 0 ? (
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <HeroImage item={heroItems[0]} alt={project.title} />
              <TitleBlock project={project} intro={intro} align="left" />
            </div>
          ) : (
            <TitleBlock project={project} intro={intro} align="center" />
          )}
        </header>

        <div className="mt-24 space-y-24">
          {story.map((chapter, i) => (
            <Chapter key={chapter.id} chapter={chapter} get={get} isFirst={i === 0} />
          ))}
        </div>
      </div>
    </main>
  );
}
