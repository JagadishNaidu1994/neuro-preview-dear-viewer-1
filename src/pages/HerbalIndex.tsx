import React, { useState } from "react";
import Header from "@/components/Header";

const HerbalIndex = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleFlip = (id: number) => {
    setFlipped(flipped === id ? null : id);
  };

  const herbs = [
    {
      id: 1,
      name: "American Ginseng",
      latin: "Panax quinquefolius",
      description:
        "This powerful root enhances cognitive performance by improving memory and neuroplasticity (your brain’s ability to adapt), reaction time, and combating stress to support mental clarity.",
      bestFor: ["Energy", "Memory", "Stress", "Mental Clarity"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
      origin:
        "Native to the Appalachian Mountains and Eastern Canada, revered in both Native American and traditional Chinese medicine.",
      why:
        "Supports nervous system and cognitive clarity. Helps regulate stress.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      svg: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
          <path d="M5 12c2 2 4 2 6 0s4-2 6 0" />
          <path d="M12 12v6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#1E1E1E]">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-4xl font-semibold text-center mb-8">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {herbs.map((herb) => (
            <div
              key={herb.id}
              onClick={() => handleFlip(herb.id)}
              className="relative w-full h-[360px] cursor-pointer [perspective:1000px]"
            >
              <div
                className={`relative w-full h-full duration-700 [transform-style:preserve-3d] ${
                  flipped === herb.id ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Side */}
                <div className="absolute w-full h-full p-6 rounded-xl bg-white shadow-md [backface-visibility:hidden]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">[{herb.id}]</span>
                    <span className="w-4 h-4 rounded-full bg-[#a58956]" />
                  </div>
                  <div className="flex justify-center mb-3">{herb.svg}</div>
                  <h2 className="font-semibold text-lg">{herb.name}</h2>
                  <p className="italic text-sm mb-2">{herb.latin}</p>
                  <p className="text-sm line-clamp-4">{herb.description}</p>
                  <p className="mt-4 text-xs font-semibold">Best For</p>
                  <p className="text-xs text-gray-600">{herb.bestFor.join(", ")}</p>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full p-6 rounded-xl bg-white shadow-md rotate-y-180 [backface-visibility:hidden]">
                  <h3 className="text-md font-bold mb-2">{herb.name}</h3>
                  <p className="text-sm mb-2">
                    <strong>Origins:</strong> {herb.origin}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Why We Use It:</strong> {herb.why}
                  </p>
                  <div className="text-sm mb-2">
                    <strong>Key Studies:</strong>
                    <ul className="list-disc list-inside text-blue-600">
                      {herb.studies.map((url, i) => (
                        <li key={i}>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            Study {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm">
                    <strong>Used In:</strong> {herb.usedIn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HerbalIndex;
