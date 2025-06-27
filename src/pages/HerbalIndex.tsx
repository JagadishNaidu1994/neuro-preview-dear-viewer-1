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
        "This powerful root enhances cognitive performance by improving memory and neuroplasticity (your brain’s ability to adapt), reaction time, and combating stress to support mental clarity. It can also provide a gentle boost of energy by stimulating metabolism and combating fatigue without the jitters associated with harsh stimulants.",
      bestFor: ["Energy", "Memory", "Stress", "Mental Clarity"],
      origin:
        "Native to the Appalachian Mountains and Eastern Canada, revered in both Native American and traditional Chinese medicine.",
      why:
        "The primary active compounds of American Ginseng are called ginsenosides. Ginsenosides support your nervous system by protecting and promoting the growth of brain cells. These bioactives also help calm the body’s stress response by tuning down overactivity in your HPA axis (your stress system) for greater emotional balance.",
      studies: [
        "https://example.com/study1",
        "https://example.com/study2",
        "https://example.com/study3",
      ],
      usedIn: "In the Zone & Matcha Chocolate Delights",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="#1E1E1E"
          viewBox="0 0 24 24"
          width="36"
          height="36"
        >
          <path d="M12 2c3 1 5 4 6 7 0 4-4 9-6 9s-6-5-6-9c1-3 3-6 6-7z" strokeWidth="1.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1E1E1E]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-4xl font-semibold text-center mb-12">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {herbs.map((herb) => (
            <div
              key={herb.id}
              onClick={() => handleFlip(herb.id)}
              className="relative w-full h-[420px] [perspective:1000px] cursor-pointer"
            >
              <div
                className={`relative w-full h-full duration-700 ease-in-out transform-style-3d ${
                  flipped === herb.id ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <div className="absolute w-full h-full bg-white rounded-xl shadow p-6 backface-hidden">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>[{herb.id}]</span>
                    <span className="w-4 h-4 rounded-full bg-[#a58956]" />
                  </div>
                  <div className="mb-4">{herb.svg}</div>
                  <h2 className="text-md font-semibold">{herb.name}</h2>
                  <p className="text-sm italic mb-3">{herb.latin}</p>
                  <p className="text-sm line-clamp-5">{herb.description}</p>
                  <p className="text-xs font-semibold mt-4">Best For</p>
                  <p className="text-xs text-gray-600">{herb.bestFor.join(", ")}</p>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full bg-white rounded-xl shadow p-6 rotate-y-180 backface-hidden">
                  <h3 className="text-md font-bold mb-2">{herb.name}</h3>
                  <p className="text-sm mb-2">
                    <strong>Origins:</strong> {herb.origin}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Why We Use It:</strong> {herb.why}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Key Studies:</strong>
                    <ul className="list-disc list-inside text-blue-600">
                      {herb.studies.map((s, i) => (
                        <li key={i}>
                          <a href={s} target="_blank" rel="noreferrer">
                            Study {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </p>
                  <p className="text-sm">
                    <strong>Used In:</strong> {herb.usedIn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind utilities to make 3D flip work */}
      <style>
        {`
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default HerbalIndex;
