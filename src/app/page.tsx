import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { collectMedia } from "@/lib/projects-server";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutSection from "@/components/AboutSection";
import SplashScreen from "@/components/SplashScreen";

async function getProjectCovers() {
  const covers = await Promise.all(
    projects.map(async (project) => {
      if (project.thumbnail) {
        return { src: project.thumbnail, name: project.thumbnail, kind: "image" as const };
      }
      const media = await collectMedia(project.dir);
      return media.find((item) => item.kind === "image") ?? null;
    })
  );
  return covers;
}

export default async function Home() {
  const covers = await getProjectCovers();
  const splashAssets = [
    "/Hero/dusha_02_bg.png",
    "/Hero/animation.gif",
    "/About/profile.webp",
    ...covers.filter((c): c is NonNullable<typeof c> => c !== null).map((c) => `/${c.src}`),
  ];
  return (
    <>
      <SplashScreen assets={splashAssets} maxDuration={2500} />
      <main className="min-h-screen w-full">
      <section className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/Hero/dusha_02_bg.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover select-none pointer-events-none"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col-reverse items-center justify-center gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-2 md:px-8 lg:px-12 md:py-0">
          <div className="max-w-xl shrink-0 text-center md:text-left">
            <p className="text-white/75 text-lg sm:text-xl">Hi, I&apos;m</p>
            <h1 className="mt-2 text-5xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
              Masoud Azad
            </h1>
            <p className="mt-3 text-lg text-white/75 sm:text-xl">
              2D Character Animator & Visual Development Artist
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
              <Link
                href="/projects"
                className="rounded-full bg-white px-7 py-3 text-base font-semibold text-neutral-900 shadow-lg transition hover:bg-white/85 active:scale-95"
              >
                View Projects
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/40 px-7 py-3 text-base font-semibold text-white transition hover:border-white/70 hover:bg-white/10 active:scale-95"
              >
                About Me
              </Link>
            </div>
          </div>

          <img
            src="/Hero/animation.gif"
            alt="Masoud Azad character illustration"
            width={1920}
            height={1920}
            className="h-auto w-[94vw] max-w-[560px] object-contain select-none drop-shadow-2xl sm:max-w-[600px] md:w-auto md:flex-1 md:min-w-0 md:max-h-[92vh] md:max-w-none md:mr-[calc(50%-50vw-2rem)] lg:mr-[calc(50%-50vw-3rem)]"
            draggable={false}
          />
        </div>
      </section>

        <FeaturedProjects covers={covers} />
        <AboutSection variant="full" />
      </main>
    </>
  );
}