export interface Gallery {
  title: string;
  dir: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  dir: string;
  galleries?: Gallery[];
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
    galleries: [
      { title: "Characters", dir: "Sky Swamp/Character" },
      { title: "Concepts", dir: "Sky Swamp/Concept" },
    ],
  },
  {
    slug: "character-concept",
    title: "Character & Concept",
    description: "Character sheets and visual development explorations.",
    dir: "character-concept",
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
  },
];
