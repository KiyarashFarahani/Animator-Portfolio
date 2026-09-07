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
        <Hero />

        <FeaturedProjects covers={covers} />
        <AboutSection variant="full" />
      </main>
    </>
  );
}