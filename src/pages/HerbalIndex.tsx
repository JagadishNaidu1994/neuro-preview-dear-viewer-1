import React, { useState } from "react";
import Header from "@/components/Header";

const herbs = [
  {
    id: 1,
    name: "American Ginseng",
    svg: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    bestFor: ["Energy", "Memory", "Clarity"],
    back: {
      origin:
        "Native to North America, traditionally used in Chinese medicine.",
      whyWeUseIt:
        "Supports the nervous system and cognitive clarity. Helps regulate stress.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
];

const HerbalIndex = () => {
  const [flippedId, setFlippedId] = useState<number | null>(null);

  const toggleFlip = (id: number) => {
    setFlippedId(flippedId === id ? null : id);
  };

  return (
    <>
      <Header />
      <main className="bg-[#FAFAF7] min-h-screen px-4 py-10">
        <h1 className="text-center text-xl md:text-3xl font-semibold text-[#1E1E1E] mb-8">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>

        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {herbs.map((herb) => (
            <div
              key={herb.id}
              className="relative w-[280px] h-[360px] cursor-pointer [perspective:1000px]"
              onClick={() => toggleFlip(herb.id)}
            >
              <div
                className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                  flippedId === herb.id ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* FRONT */}
                <div className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-xl shadow-md p-5 flex flex-col items-center justify-center text-center">
                  <div className="mb-4">{herb.svg}</div>
                  <h3 className="text-lg font-semibold">
                    [{String(herb.id).padStart(2, "0")}] {herb.name}
                  </h3>
                  <p className="text-sm mt-2 text-gray-600">
                    Best for: {herb.bestFor.join(", ")}
                  </p>
                  <p className="text-xs mt-4 text-gray-400">
                    Tap to learn more →
                  </p>
                </div>

                {/* BACK */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-xl shadow-md p-5 overflow-y-auto">
                  <h3 className="text-md font-bold mb-1">{herb.name}</h3>
                  <p className="text-sm text-gray-800">
                    <strong>Origins:</strong> {herb.back.origin}
                  </p>
                  <p className="text-sm text-gray-800 mt-2">
                    <strong>Why We Use It:</strong> {herb.back.whyWeUseIt}
                  </p>
                  <p className="text-sm font-medium mt-2">Key Studies:</p>
                  <ul className="text-sm list-disc pl-4">
                    {herb.back.studies.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link}
                          className="text-blue-600 underline"
                          target="_blank"
                        >
                          Study {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm mt-2">
                    <strong>Used In:</strong> {herb.back.usedIn}
                  </p>
                  <p className="text-xs mt-2 text-gray-400 text-right">Tap to flip back</p>
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
