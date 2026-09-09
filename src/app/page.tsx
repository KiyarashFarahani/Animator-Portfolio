import { projects } from "@/lib/projects";
import { collectMedia } from "@/lib/projects-server";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutSection from "@/components/AboutSection";
import SplashScreen from "@/components/SplashScreen";
import Hero from "@/components/Hero";

async function getProjectCovers() {
  const covers = await Promise.all(
    projects.map(async (project) => {
      if (project.thumbnail) {
        return { src: project.thumbnail, name: project.thumbnail, kind: "image" as const };
      }
      if (project.galleries?.length) {
        for (const g of project.galleries) {
          const media = await collectMedia(g.dir);
          const img = media.find((item) => item.kind === "image");
          if (img) return img;
        }
        for (const g of project.galleries) {
          const media = await collectMedia(g.dir);
          if (media[0]) return media[0];
        }
        return null;
      }
      const media = await collectMedia(project.dir);
      return media.find((item) => item.kind === "image") ?? media[0] ?? null;
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
        <Hero />

        <div className="h-12 sm:h-16 lg:h-20 bg-[#05080c]" aria-hidden="true" />
        <FeaturedProjects />
        <AboutSection variant="full" />
      </main>
    </>
  );
}