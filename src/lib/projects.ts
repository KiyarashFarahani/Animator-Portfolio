import { skySwampStory } from "./sky-swamp-story";

export interface Gallery {
  title: string;
  dir: string;
  pinned?: string[];
  exclude?: string[];
}

export interface StoryBeat {
  subheading?: string;
  paragraphs?: string[];
  images?: string[];
  layout?: "feature" | "duo" | "trio" | "masonry" | "split" | "tall-stack";
  caption?: string;
  /** which side images sit on in split layout (default "right") */
  side?: "left" | "right";
  /** image grid columns inside a split (1 = stacked, 2 = side by side) */
  cols?: 1 | 2;
  fitSquare?: boolean;
}

export interface StoryChapter {
  id: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  paragraphs?: string[];
  beats?: StoryBeat[];
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  dir: string;
  /** explicit cover image path relative to /public, overrides auto-picked cover */
  thumbnail?: string;
  pinned?: string[];
  galleries?: Gallery[];
  intro?: {
    subtitle?: string;
    disciplines?: string;
    logline?: string;
    heroImages?: string[];
  };
  story?: StoryChapter[];
}

export const projects: Project[] = [
  {
    slug: "animation",
    title: "Animation",
    description: "Looping character animations, acting shots and motion studies.",
    dir: "Animate",
    thumbnail: "Animate/20260405210941_720P.gif",
  },
  {
    slug: "sky-swamp",
    title: "Sky Swamp",
    description: "Characters and concept art from an original swamp-in-the-sky world.",
    dir: "sky-swamp-docx",
    thumbnail: "sky-swamp-docx/image9.jpg",
    intro: {
      subtitle: "An original animated film concept",
      disciplines:
        "Story · Character Design · Worldbuilding · Environment Design · Visual Development",
      logline: "A strange world. A lost friend. A way home",
      heroImages: ["image50.jpg", "image9.jpg"],
    },
    story: skySwampStory,
  },
  {
    slug: "character-concept",
    title: "Character & Concept",
    description: "Character sheets and visual development explorations.",
    dir: "character-concept",
    thumbnail: "character-concept/Ch01/01-cropped.jpg",
    galleries: [
      { title: "Characters", dir: "character-concept/Ch01" },
      { title: "Concepts", dir: "character-concept/Co" },
    ],
  },
  {
    slug: "short-movies",
    title: "Short Movies",
    description: "Independent animated short films and exercises.",
    dir: "short movie",
    thumbnail: "short movie/mastoons/07.gif",
    galleries: [
      { title: "Commercial", dir: "short movie/commercial" },
      { title: "Mastoons", dir: "short movie/mastoons", exclude: ["07.gif"] },
    ],
  },
];
