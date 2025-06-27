export interface Herb {
  id: number;
  name: string;
  svg: string; // inline SVG markup
  bestFor: string[];
  back: {
    origin: string;
    whyWeUseIt: string;
    studies: string[];
    usedIn: string;
  };
}

export const herbs: Herb[] = [
  {
    id: 1,
    name: "American Ginseng",
    svg: `<svg width="32" height="32" fill="none" stroke="currentColor"><circle cx="16" cy="16" r="14" stroke-width="2" /></svg>`,
    bestFor: ["Energy", "Memory", "Clarity"],
    back: {
      origin: "Native to North America, traditionally used in Chinese medicine.",
      whyWeUseIt: "Supports the nervous system and cognitive clarity. Helps regulate stress.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
  {
    id: 2,
    name: "Ashwagandha",
    svg: `<svg width="32" height="32" fill="none" stroke="currentColor"><rect x="6" y="6" width="20" height="20" rx="2" stroke-width="2" /></svg>`,
    bestFor: ["Stress", "Sleep", "Mood"],
    back: {
      origin: "An adaptogen from India used in Ayurvedic medicine.",
      whyWeUseIt: "Helps reduce cortisol and manage daily stressors. Improves sleep quality.",
      studies: ["https://example.com/study3"],
      usedIn: "Calm & Sleep Gummies",
    },
  },
  // ⏳ Add rest of the 25 herbs in similar format.
];

export default herbs;
