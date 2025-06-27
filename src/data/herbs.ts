export interface Herb {
  id: number;
  name: string;
  svg: string;
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
    svg: "/icons/ginseng.svg",
    bestFor: ["Energy", "Memory", "Clarity"],
    back: {
      origin: "Native to North America, traditionally used in Chinese medicine.",
      whyWeUseIt:
        "Supports the nervous system and cognitive clarity. Helps regulate stress.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
  {
    id: 2,
    name: "Ashwagandha",
    svg: "/icons/ashwagandha.svg",
    bestFor: ["Stress", "Sleep", "Mood"],
    back: {
      origin: "An adaptogen from India used in Ayurvedic medicine.",
      whyWeUseIt:
        "Helps reduce cortisol and manage daily stressors. Improves sleep quality.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "Calm & Sleep Gummies",
    },
  },
  {
    id: 3,
    name: "Cacao Seed",
    svg: "/icons/cacao.svg",
    bestFor: ["Mood", "Cognition"],
    back: {
      origin: "Sourced from tropical regions of South America.",
      whyWeUseIt:
        "Rich in polyphenols and theobromine, supports focus and happiness.",
      studies: ["https://example.com/study1"],
      usedIn: "Matcha Chocolate Delights",
    },
  },
  {
    id: 4,
    name: "Chamomile",
    svg: "/icons/chamomile.svg",
    bestFor: ["Relaxation", "Sleep"],
    back: {
      origin: "Commonly found across Europe and Asia.",
      whyWeUseIt:
        "Natural calming herb that reduces anxiety and supports deep sleep.",
      studies: ["https://example.com/study1"],
      usedIn: "Sleep Gummies",
    },
  },
  {
    id: 5,
    name: "Cordyceps Mushroom",
    svg: "/icons/cordyceps.svg",
    bestFor: ["Energy", "Endurance"],
    back: {
      origin: "High-altitude fungi used in traditional Tibetan medicine.",
      whyWeUseIt:
        "Improves oxygen uptake and physical performance.",
      studies: ["https://example.com/study1"],
      usedIn: "Energy Gummies",
    },
  },
  // Add more herbs similarly up to 25
];

export default herbs;
