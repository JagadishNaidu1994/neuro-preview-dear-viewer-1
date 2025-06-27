// src/pages/HerbalIndex.tsx
import React, { useState } from "react";
import Header from "@/components/Header";

interface Herb {
  id: number;
  name: string;
  svg: JSX.Element;
  bestFor: string[];
  back: {
    origin: string;
    whyWeUseIt: string;
    studies: string[];
    usedIn: string;
  };
}

const herbs: Herb[] = [
  {
    id: 1,
    name: "American Ginseng",
    svg: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    bestFor: ["Energy", "Memory", "Clarity"],
    back: {
      origin: "Native to North America, traditionally used in Chinese medicine.",
      whyWeUseIt:
        "Supports the nervous system and cognitive clarity. Helps regulate stress.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
  // Add more items here
];

const HerbalIndex: React.FC = () => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <>
      <Header />
      <main className="bg-[#FAFAF7] min-h-screen px-4 py-10">
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-8">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center max-w-7xl mx-auto">
          {herbs.map((herb) => (
            <div
              key={herb.id}
              className="w-full max-w-[280px] h-[360px] perspective"
              onClick={() =>
                setFlipped((prev) => ({ ...prev, [herb.id]: !prev[herb.id] }))
              }
            >
              <div
                className={`relative w-full h-full duration-700 transform-style-preserve-3d ${
                  flipped[herb.id] ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <div className="absolute w-full h-full bg-white rounded-xl shadow-md p-6 backface-hidden flex flex-col justify-between items-start">
                  <div>{herb.svg}</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      [{String(herb.id).padStart(2, "0")}] {herb.name}
                    </h3>
                    <p className="text-sm text-[#514B3D]">
                      Best for: {herb.bestFor.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full bg-white rounded-xl shadow-md p-6 backface-hidden rotate-y-180 overflow-auto">
                  <h3 className="font-bold text-lg">{herb.name}</h3>
                  <p className="mt-2 text-sm"><strong>Origins:</strong> {herb.back.origin}</p>
                  <p className="mt-2 text-sm"><strong>Why We Use It:</strong> {herb.back.whyWeUseIt}</p>
                  <p className="mt-2 text-sm font-medium">Key Studies:</p>
                  <ul className="list-disc pl-4">
                    {herb.back.studies.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Study {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">
                    <strong>Used In:</strong> {herb.back.usedIn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default HerbalIndex;
