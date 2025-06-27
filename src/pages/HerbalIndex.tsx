// src/pages/HerbalIndex.tsx
import React, { useState } from "react";
import Header from "@/components/Header";

const herbs = [
  {
    id: 1,
    name: "American Ginseng",
    svg: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 2C10.343 4.343 6.343 5.343 6 8c.343 2.657 4.343 3.657 6 6 1.657-2.343 5.657-3.343 6-6-.343-2.657-4.343-3.657-6-6z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    latin: "Panax quinquefolius",
    bestFor: ["Energy", "Memory", "Stress", "Mental Clarity"],
    description:
      "This powerful root enhances cognitive performance by improving memory and neuroplasticity (your brain’s ability to adapt), reaction time, and combating stress to support mental clarity. It can also provide a gentle boost of energy by stimulating metabolism and combating fatigue without the jitters associated with harsh stimulants.",
    back: {
      origin:
        "Native to the Appalachian Mountains and Eastern Canada, revered in both Native American and traditional Chinese medicine.",
      whyWeUseIt:
        "The primary active compounds of American Ginseng are called ginsenosides. Ginsenosides support your nervous system by protecting and promoting the growth of brain cells. These bioactives also help calm the body’s stress response by tuning down overactivity in your HPA axis (your stress system) for greater emotional balance.",
      studies: ["Study 1", "Study 2", "Study 3"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
  // Add more herbs...
];

const HerbalIndex = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <Header />
      <div className="text-center py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D]">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 pb-16">
        {herbs.map((herb) => {
          const isFlipped = flipped === herb.id;
          return (
            <div
              key={herb.id}
              className="relative cursor-pointer [perspective:1000px]"
              onClick={() => setFlipped(isFlipped ? null : herb.id)}
            >
              <div
                className={`transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Face */}
                <div className="absolute w-full h-full bg-white rounded-xl p-6 [backface-visibility:hidden] shadow-md">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-semibold text-[#333]">[{herb.id}]</span>
    <span className="w-4 h-4 rounded-full bg-[#a58956]" />
  </div>
  <div className="flex justify-center mb-4">{herb.svg}</div>
  <h2 className="font-semibold text-[#111] text-base mb-1">{herb.name}</h2>
  <p className="italic text-sm text-[#555] mb-2">{herb.latin}</p>
  <p className="text-sm text-[#444] line-clamp-5">{herb.description}</p>
  <div className="mt-3 text-xs font-semibold text-[#333]">
    Best For
  </div>
  <p className="text-xs text-[#666]">{herb.bestFor.join(", ")}</p>
</div>


                {/* Back Face */}
                <div className="absolute w-full h-full bg-white rounded-xl p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-md">
                  <h2 className="font-semibold text-[#111] text-md mb-2">{herb.name}</h2>
                  <div className="text-xs text-[#444] space-y-2">
                    <div>
                      <span className="font-semibold">Origins:</span> {herb.back.origin}
                    </div>
                    <div>
                      <span className="font-semibold">Why We Use It:</span> {herb.back.whyWeUseIt}
                    </div>
                    <div>
                      <span className="font-semibold">Key Studies:</span>
                      <ul className="list-disc pl-4">
                        {herb.back.studies.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold">Used In:</span> {herb.back.usedIn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HerbalIndex;
