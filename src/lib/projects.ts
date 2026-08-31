export interface Project {
  slug: string;
  title: string;
  description: string;
  dir: string;
}

export const projects: Project[] = [
  {
    slug: "animation",
    title: "Animation",
    description: "Looping character animations, acting shots and motion studies.",
    dir: "Animate",
  },
  {
    slug: "sky-swamp",
    title: "Sky Swamp",
    description: "Characters and concept art from an original swamp-in-the-sky world.",
    dir: "Sky Swamp",
  },
  {
    slug: "character-concept",
    title: "Character & Concept",
    description: "Character sheets and visual development explorations.",
    dir: "character-concept",
  },
  {
    slug: "short-movies",
    title: "Short Movies",
    description: "Independent animated short films and exercises.",
    dir: "short movie",
  },
];
