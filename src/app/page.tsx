import FeaturedProjects from "@/components/FeaturedProjects";
import { FEATURED_ASSETS } from "@/lib/featured-assets";
import AboutSection from "@/components/AboutSection";
import SplashScreen from "@/components/SplashScreen";
import Hero from "@/components/Hero";

export default function Home() {
  const splashAssets = [
    "/Hero/dusha_02_bg.png",
    "/Hero/animation.gif",
    "/About/profile.webp",
    ...FEATURED_ASSETS.slice(0, 5).map((s) => `/${s}`),
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