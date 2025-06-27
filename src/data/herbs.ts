export interface Herb {
  id: number;
  name: string;
  latinName: string;
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
    latinName: "Panax quinquefolius",
    svg: `<svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10..." /></svg>`,
    bestFor: ["Energy", "Memory", "Stress", "Mental Clarity"],
    back: {
      origin:
        "Native to the Appalachian Mountains and Eastern Canada, revered in both Native American and traditional Chinese medicine.",
      whyWeUseIt:
        "The primary active compounds of American Ginseng are called ginsenosides. Ginsenosides support your nervous system by protecting and promoting the growth of brain cells. These bioactives also help calm the body’s stress response by tuning down overactivity in your HPA axis (your stress system) for greater emotional balance.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
  // Add other herbs with the same format
];
