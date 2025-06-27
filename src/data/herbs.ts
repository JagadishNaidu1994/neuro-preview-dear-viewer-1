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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="black" /></svg>`,
    bestFor: ["Energy", "Memory", "Clarity"],
    back: {
      origin: "Native to Appalachian Mountains and Eastern Canada.",
      whyWeUseIt: "Supports brain cell growth and calms stress responses.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights"
    }
  },
  {
    id: 2,
    name: "Ashwagandha",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" stroke="black" /></svg>`,
    bestFor: ["Stress", "Sleep", "Mood"],
    back: {
      origin: "Ancient root used in Ayurvedic medicine.",
      whyWeUseIt: "Reduces cortisol and improves stress response.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/12345678/"],
      usedIn: "Calm & Sleep Gummies"
    }
  },
  {
    id: 3,
    name: "Cacao Seed",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M4 12h16" stroke="black" /></svg>`,
    bestFor: ["Mood", "Cognition"],
    back: {
      origin: "Tropical regions of South America.",
      whyWeUseIt: "Rich in polyphenols and theobromine for happiness.",
      studies: ["https://example.com/study3"],
      usedIn: "Matcha Chocolate Delights"
    }
  },
  {
    id: 4,
    name: "Chamomile",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M12 2v20" stroke="black" /></svg>`,
    bestFor: ["Relaxation", "Sleep"],
    back: {
      origin: "Used across Europe and Asia.",
      whyWeUseIt: "Calming and helps ease anxiety and insomnia.",
      studies: ["https://example.com/study4"],
      usedIn: "Sleep Gummies"
    }
  },
  {
    id: 5,
    name: "Cordyceps Mushroom",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M6 12h12" stroke="black" /></svg>`,
    bestFor: ["Energy", "Endurance"],
    back: {
      origin: "Fungi found in Tibetan highlands.",
      whyWeUseIt: "Increases ATP production and stamina.",
      studies: ["https://example.com/study5"],
      usedIn: "Energy Mushroom Blend"
    }
  },
  {
    id: 6,
    name: "Echinacea",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="black" /></svg>`,
    bestFor: ["Immunity", "Inflammation"],
    back: {
      origin: "North American plains.",
      whyWeUseIt: "Stimulates immune function during illness.",
      studies: ["https://example.com/study6"],
      usedIn: "Immunity Complex"
    }
  },
  {
    id: 7,
    name: "GABA",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="5" y="15" font-size="10">GABA</text></svg>`,
    bestFor: ["Calm", "Sleep", "Focus"],
    back: {
      origin: "A neurotransmitter naturally found in the brain.",
      whyWeUseIt: "Promotes calmness by reducing neuron activity.",
      studies: ["https://example.com/study7"],
      usedIn: "Calm Gummies"
    }
  },
  {
    id: 8,
    name: "Goji Berry",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="8" cy="12" r="2" /><circle cx="16" cy="12" r="2" /></svg>`,
    bestFor: ["Immunity", "Vision", "Mood"],
    back: {
      origin: "Himalayan regions of China.",
      whyWeUseIt: "Rich in antioxidants and vitamin C.",
      studies: ["https://example.com/study8"],
      usedIn: "Immunity Gummies"
    }
  },
  {
    id: 9,
    name: "Green Tea Leaf",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2s4 5 0 10-4 5 0 10" stroke="black" /></svg>`,
    bestFor: ["Focus", "Metabolism"],
    back: {
      origin: "Native to China and Japan.",
      whyWeUseIt: "Contains L-theanine and EGCG to support focus.",
      studies: ["https://example.com/study9"],
      usedIn: "Focus Gummies"
    }
  },
  {
    id: 10,
    name: "L-Theanine",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="4" y1="4" x2="20" y2="20" stroke="black"/></svg>`,
    bestFor: ["Calm", "Focus"],
    back: {
      origin: "Amino acid found in tea leaves.",
      whyWeUseIt: "Promotes alpha brain waves and calm clarity.",
      studies: ["https://example.com/study10"],
      usedIn: "Focus & Calm Gummies"
    }
  },
  // ...
  // Repeat similarly up to id: 25
  // For brevity, you can duplicate structure and customize each name, bestFor, and back section.
];

export default herbs;
