// src/pages/HerbalIndex.tsx
import React, { useState } from "react";
import Header from "@/components/Header";
import "@/index.css"; // <-- Ensure this is imported

const herbs = [
  {
    id: 1,
    name: "American Ginseng",
    bestFor: ["Energy", "Memory", "Clarity"],
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
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Header />
      <main className="bg-[#FAFAF7] min-h-screen px-4 py-10">
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-8">
          A whole world of mushrooms, adaptogens and nootropics that work
          better, together.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
          {herbs.map((herb) => (
            <div
              key={herb.id}
              className="card-container w-[280px] h-[360px] cursor-pointer"
              onClick={() => toggleFlip(herb.id)}
            >
              <div className={`card ${flipped[herb.id] ? "flipped" : ""}`}>
                {/* FRONT */}
                <div className="card-face">
                  {herb.svg}
                  <h3 className="font-semibold mt-4">
                    [{String(herb.id).padStart(2, "0")}] {herb.name}
                  </h3>
                  <p className="text-sm mt-2 text-[#514B3D]">
                    Best for: {herb.bestFor.join(", ")}
                  </p>
                </div>

                {/* BACK */}
                <div className="card-face card-back">
                  <h3 className="font-bold text-lg">{herb.name}</h3>
                  <p className="mt-2 text-sm">
                    <strong>Origins:</strong> {herb.back.origin}
                  </p>
                  <p className="mt-2 text-sm">
                    <strong>Why We Use It:</strong> {herb.back.whyWeUseIt}
                  </p>
                  <p className="mt-2 text-sm font-medium">Key Studies:</p>
                  <ul className="list-disc pl-4 text-sm">
                    {herb.back.studies.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
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
