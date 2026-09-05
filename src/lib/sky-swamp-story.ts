import type { StoryChapter } from "./projects";

// Chapter structure mirrors the pitch document: text blocks interleaved with
// image groups, in the exact order they appear in the source material.
// Layouts are chosen per beat based on image aspect ratios and rhythm:
// split rows alternate image side down the page.
export const skySwampStory: StoryChapter[] = [
  {
    id: "universe",
    heading: "How This Universe Was Created",
    beats: [
      {
        subheading: "Once, Earth was ordinary.",
        paragraphs: [
          "Then a meteor changed everything.",
          "The planet broke away from its orbit, a new Sun was born from its molten core, and a new Moon emerged from the frozen poles.",
          "Earth became something else.",
          "A strange, donut-shaped world where the rules of nature no longer quite make sense.",
          "And somewhere inside this impossible world is a place called the Sky Swamp.",
        ],
        images: ["image45.jpg"],
        layout: "split",
        side: "right",
      },
    ],
  },
  {
    id: "story",
    heading: "The Story",
    subheading: "A journey into the unknown",
    beats: [
      {
        paragraphs: [
          "Blo and Bla Bla are two friends living in this strange new world.",
          "They spend their days exploring, getting into trouble, and discovering places that seem to have appeared from another dream.",
        ],
        images: ["image57.jpg"],
        layout: "split",
        side: "left",
      },
      {
        paragraphs: [
          "Then something unexpected happens.",
          "Blo is sent flying toward the Moon in a rocket, leaving Bla Bla behind. Now he has to find his way home. And along the way, the world gets stranger.",
        ],
        images: ["image89.jpg", "image75.jpg", "image90.jpg", "image40.jpg", "image98.jpg", "image5.jpg"],
        layout: "masonry",
      },
    ],
  },
  {
    id: "characters",
    eyebrow: "Characters",
    heading: "Blo & Bla Bla",
    subheading: "Two friends at the center of it all",
    beats: [
      {
        paragraphs: [
          "Blo is curious, energetic, and usually ready to get himself into trouble.",
          "Bla Bla is quieter, shy, and always close by.",
          "They don't always understand what they're getting themselves into.",
          "But they always seem to find a way forward.",
        ],
        images: ["image68.jpg"],
        layout: "split",
        side: "left",
      },
    ],
  },
  {
    id: "blo",
    eyebrow: "Characters",
    heading: "Blo",
    beats: [
      {
        paragraphs: [
          "Blo is the character I built the story around.",
          "His design went through a lot of small changes before reaching the version used in the film concepts. I wanted him to feel simple enough to animate, but expressive enough that his personality could come through without dialogue.",
        ],
        images: ["image96.jpg"],
        layout: "split",
        side: "left",
      },
      {
        images: [
          "image66.jpg",
          "image12.jpg",
          "image46.jpg",
          "image3.jpg",
          "image100.jpg",
          "image7.jpg",
          "image114.jpg",
          "image64.jpg",
          "image29.jpg",
          "image35.jpg",
          "image72.jpg",
          "image82.jpg",
          "image116.jpg",
          "image48.jpg",
        ],
        layout: "masonry",
      },
    ],
    note: "The original development book calls him Frank. I later changed the character's name to Blo as the project developed. The older artwork is part of the project's development history, so you may still see the original name in some of the early images.",
  },
  {
    id: "bla-bla",
    eyebrow: "Characters",
    heading: "Bla Bla",
    beats: [
      {
        paragraphs: [
          "Bla Bla doesn't really speak.",
          "Most of what comes out of him is some variation of: \u201CBla bla.\u201D",
          "Luckily, Blo understands him.",
          "That became one of the things I liked most about their relationship — one character talks too much, the other barely talks at all.",
        ],
        images: ["image87.jpg"],
        layout: "split",
        side: "left",
      },
      {
        images: [
          "image54.jpg",
          "image8.jpg",
          "image24.jpg",
          "image39.jpg",
          "image85.jpg",
          "image74.jpg",
          "image56.jpg",
          "image32.jpg",
          "image92.jpg",
          "image108.jpg",
        ],
        layout: "masonry",
      },
    ],
    note: "The original book shows how Bla Bla's design changed during development, including an earlier version where he appeared alongside Goji before becoming Blo's main companion.",
  },
  {
    id: "sapi",
    eyebrow: "Characters",
    heading: "Sapi",
    subheading: "The Spirit of Earth",
    beats: [
      {
        paragraphs: [
          "Sapi is the spirit of Earth. Before the meteor struck, he separated himself from the planet and created a small, simplified version of Earth to carry with him.",
          "He keeps it inside the cardboard box attached to his body, protecting the history of the world as he remembers it.",
        ],
        images: ["image63.jpg"],
        layout: "split",
        side: "left",
      },
      {
        images: ["image55.jpg", "image26.jpg", "image44.jpg"],
        layout: "masonry",
      },
      {
        paragraphs: [
          "When the meteor hit, Sapi survived — but not without a permanent mark.",
          "A large hollow was left in the center of his face, which he keeps hidden behind a wooden mask. He doesn't want to accept what happened to Earth, or let anyone see what was left behind.",
        ],
        images: ["image104.jpg"],
        layout: "split",
        side: "left",
      },
      {
        paragraphs: [
          "Sapi has tried many times to restore Earth to what it was before the impact.",
          "Every attempt has failed. Something is always missing. For his plan to work, Sapi needs one final piece: a powerful source of energy. And that search eventually brings him to Blo.",
        ],
        images: ["image19.jpg", "image59.jpg"],
        layout: "masonry",
      },
      {
        subheading: "Character Direction",
        paragraphs: [
          "Sapi was designed as an anti-hero rather than a straightforward villain. His actions come from his inability to accept the world's transformation. He is trying to repair something he believes should never have been changed, even if doing so means interfering with the new world that exists now.",
        ],
        images: ["image61.jpg"],
        layout: "split",
        side: "left",
      },
    ],
  },
  {
    id: "goji",
    eyebrow: "Characters",
    heading: "Goji",
    subheading: "The Old Star",
    beats: [
      {
        subheading: "Goji is an old dwarf star who lost the power to fly long ago.",
        paragraphs: [
          "Now he lives alone on the Moon, spending his remaining time experimenting, inventing, and observing the world around him.",
          "He has lived long enough to witness almost everything that happened to Earth. Because of this, Goji carries knowledge that few others in the world possess.",
          "When Blo reaches the Moon, Goji finds him and takes him in. From that point on, he becomes an important part of Blo's journey and the events that follow.",
        ],
        images: ["image2.jpg"],
        layout: "split",
        side: "left",
      },
      { images: ["image33.jpg", "image77.jpg"], layout: "masonry" },
      {
        subheading: "The Secret Garden",
        paragraphs: [
          "Hidden somewhere on the Moon is Goji's laboratory.",
          "But the laboratory is not what makes the place special.",
          "Goji has secretly grown a small garden around it, creating his own piece of life in an otherwise barren environment.",
          "The plants are designed to blend into the surface of the Moon. Their upper leaves resemble the texture and color of lunar soil, making the garden almost impossible to notice from above.",
          "From the outside, there seems to be nothing there.",
          "Behind the disguise is Goji's private world — a laboratory, a garden, and a place where he can continue experimenting with the strange materials and discoveries he has collected over the years.",
        ],
        images: ["image112.jpg"],
        layout: "split",
        side: "left",
      },
      {
        subheading: "Goji's Spaceship",
        paragraphs: [
          "Since Goji can no longer fly like the other stars, he had to find another way to travel. He built his own spaceship. The design started with quick explorations of different shapes, sizes, and ways Goji could move through space. I wanted the ships to feel like something Goji could have built himself — functional, strange, and a little improvised. These sketches are part of the early design process, exploring different silhouettes and ideas before settling on a direction for the final ship.",
        ],
        images: ["image97.jpg", "image52.jpg", "image113.jpg", "image34.jpg"],
        layout: "masonry",
      },
    ],
  },
  {
    id: "dusha",
    eyebrow: "Characters",
    heading: "Dusha",
    subheading: "The Spirit of the Swamp",
    beats: [
      {
        paragraphs: [
          "Dusha is the spirit of the swamp and a quiet guardian of Blo and Bla Bla.",
          "She rarely reveals herself. Calm and almost ghost-like, she stays hidden among the trees, watching from a distance and appearing only when something important happens.",
          "Dusha can fly effortlessly through the swamp, slipping between branches and disappearing into the vegetation almost as quickly as she appears.",
          "Her presence is meant to feel mysterious rather than threatening — a character who is always somewhere nearby, quietly protecting the world and the two friends within it.",
        ],
        images: ["image10.jpg", "image102.jpg"],
        layout: "split",
        side: "right",
      },
    ],
  },
  {
    id: "world",
    heading: "The World of Sky Swamp",
    subheading: "A world built to be explored",
    beats: [
      {
        paragraphs: [
          "I wanted the environments to feel familiar at first glance, then slightly wrong when you look closer.",
          "A forest can become a home.",
          "A piece of land can become its own little ecosystem.",
          "A tree can carry water through its roots and send it upward against gravity.",
          "The more Blo explores, the more strange rules he discovers.",
        ],
        images: ["image86.jpg"],
        layout: "split",
        side: "left",
      },
      {
        images: [
          "image36.jpg",
          "image84.jpg",
          "image91.jpg",
          "image30.jpg",
          "image117.jpg",
          "image80.jpg",
          "image42.jpg",
          "image16.jpg",
          "image21.jpg",
          "image23.jpg",
          "image1.jpg",
          "image110.jpg",
          "image47.jpg",
          "image70.jpg",
          "image73.jpg",
          "image65.jpg",
          "image25.jpg",
          "image22.jpg",
          "image95.jpg",
          "image109.jpg",
          "image62.jpg",
          "image37.jpg",
          "image13.jpg",
          "image67.jpg",
          "image20.jpg",
          "image58.jpg",
          "image111.jpg",
          "image88.jpg",
          "image18.jpg",
          "image27.jpg",
          "image38.jpg",
          "image93.jpg",
          "image81.jpg",
          "image106.jpg",
          "image31.jpg",
          "image17.jpg",
          "image105.jpg",
          "image53.jpg",
          "image71.jpg",
        ],
        layout: "masonry",
      },
      { caption: "Blo & Bla Bla house", images: ["image6.jpg"], layout: "feature" },
      {
        images: ["image49.jpg", "image115.jpg", "image103.jpg"],
        layout: "masonry",
      },
      {
        images: [
          "image41.jpg",
          "image51.jpg",
          "image107.jpg",
          "image94.jpg",
          "image101.jpg",
          "image15.jpg",
          "image79.jpg",
          "image43.jpg",
          "image76.jpg",
          "image118.jpg",
          "image4.jpg",
        ],
        layout: "masonry",
      },
    ],
  },
  {
    id: "creatures",
    heading: "The Creatures",
    subheading: "There is always something hiding nearby.",
    paragraphs: [
      "The creatures of Sky Swamp grew out of the same process as the environments: lots of quick ideas, strange shapes, and sketches before deciding which ones belonged in the world.",
    ],
    beats: [
      {
        images: ["image28.jpg", "image83.jpg", "image11.jpg", "image14.jpg", "image78.jpg", "image69.jpg", "image119.jpg", "image99.jpg"],
        layout: "masonry",
      },
    ],
  },
];
