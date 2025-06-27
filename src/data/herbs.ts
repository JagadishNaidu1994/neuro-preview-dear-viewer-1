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
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20L20 10L30 20L20 30Z" stroke="black" strokeWidth="2" />
  </svg>
),
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
