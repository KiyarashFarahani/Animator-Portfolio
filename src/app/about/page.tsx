import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = { title: "About Me — Masoud Azad" };

export default function AboutPage() {
  return (
    <main className="min-h-screen text-white">
      <AboutSection variant="full" />
    </main>
  );
}
