export const herbs: Herb[] = [
  {
    id: 1,
    name: "American Ginseng",
    latinName: "Panax quinquefolius",
    color: "#C1A85F",
    svg: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="18" stroke="#161616" strokeWidth="2" />
        <path d="M15 20L20 25L25 20L20 15Z" fill="#161616" />
      </svg>
    ),
    bestFor: ["Energy", "Memory", "Stress", "Mental Clarity"],
    back: {
      origin:
        "Native to the Appalachian Mountains and Eastern Canada, revered in both Native American and traditional Chinese medicine.",
      whyWeUseIt:
        "The primary active compounds of American Ginseng are called ginsenosides. Ginsenosides support your nervous system by protecting and promoting the growth of brain cells. These bioactives also help calm the body’s stress response by tuning down overactivity in your HPA axis (your stress system) for greater emotional balance.",
      studies: [
        "https://example.com/study1",
        "https://example.com/study2",
        "https://example.com/study3",
      ],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
];
