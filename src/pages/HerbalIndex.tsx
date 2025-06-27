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
      <svg width="48" height="48" fill="none" stroke="currentColor">
        {/* inline SVG path from noon */}
        <path d="M10 10 L38 38 M38 10 L10 38"/>
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
  // ... include all 25 items similarly
];

const HerbalIndex: React.FC = () => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <>
      <Header />
      <main className="bg-[#FAFAF7] min-h-screen p-8">
        <h1 className="text-center text-3xl font-bold mb-6">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {herbs.map((h) => (
            <div
              key={h.id}
              onClick={() => setFlipped((f) => ({ ...f, [h.id]: !f[h.id] }))}
              className="relative w-[260px] h-[300px] bg-white rounded-lg shadow-md cursor-pointer perspective"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-preserve ${
                  flipped[h.id] ? "rotateY(180deg)" : ""
                }`}
              >
                {/* front */}
                <div className="absolute w-full h-full backface-hidden flex flex-col p-4 justify-between">
                  <div>{h.svg}</div>
                  <div>
                    <h2 className="font-semibold">{`[${String(
                      h.id
                    ).padStart(2, "0")}] ${h.name}`}</h2>
                    <p className="text-sm text-gray-500 mt-2">Best for:</p>
                    <p className="mt-1 text-[#514B3D]">
                      {h.bestFor.join(", ")}
                    </p>
                  </div>
                </div>
                {/* back */}
                <div className="absolute w-full h-full backface-hidden rotateY-180deg p-4 overflow-auto">
                  <h2 className="text-lg font-semibold">{h.name}</h2>
                  <p className="mt-2 text-sm"><strong>Origins:</strong> {h.back.origin}</p>
                  <p className="mt-2 text-sm"><strong>Why We Use It:</strong> {h.back.whyWeUseIt}</p>
                  <p className="mt-2 text-sm"><strong>Key Studies:</strong></p>
                  <ul className="list-disc list-inside text-sm">
                    {h.back.studies.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-600"
                        >
                          Study {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm"><strong>Used In:</strong> {h.back.usedIn}</p>
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
