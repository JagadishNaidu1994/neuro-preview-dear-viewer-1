export interface Herb {
  id: number;
  name: string;
  latinName: string;
  svg: JSX.Element;
  bestFor: string[];
  color?: string;
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
    color: "#A88C3D",
    svg: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2">
        <path d="M5 12h14M12 5v14" />
      </svg>
    ),
    bestFor: ["Energy", "Memory", "Stress", "Mental Clarity"],
    back: {
      origin: "Native to the Appalachian Mountains and Eastern Canada...",
      whyWeUseIt: "The primary active compounds are ginsenosides...",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights"
    }
  },
  // Add more herbs here
];
