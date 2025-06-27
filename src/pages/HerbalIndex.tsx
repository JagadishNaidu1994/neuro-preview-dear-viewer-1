import React, { useState } from "react";
import Header from "@/components/Header";

// Define herb type
interface Herb {
  id: number;
  name: string;
  svg: string;
  bestFor: string[];
  back: {
    origin: string;
    whyWeUseIt: string;
    studies: string[];
    usedIn: string;
  };
}

// Sample herb data
const herbs: Herb[] = [
  {
    id: 1,
    name: "American Ginseng",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/></svg>`,
    bestFor: ["Energy", "Memory", "Clarity"],
    back: {
      origin: "Native to North America, traditionally used in Chinese medicine.",
      whyWeUseIt:
        "Supports the nervous system and cognitive clarity. Helps regulate stress.",
      studies: ["https://example.com/study1", "https://example.com/study2"],
      usedIn: "In the Zone & Matcha Chocolate Delights",
    },
  },
  {
    id: 2,
    name: "Ashwagandha",
    svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" stroke-width="2"/></svg>`,
    bestFor: ["Stress", "Sleep", "Mood"],
    back: {
      origin: "An adaptogen from India used in Ayurvedic medicine.",
      whyWeUseIt:
        "Helps reduce cortisol and manage daily stressors. Improves sleep quality.",
      studies: ["https://example.com/study3"],
      usedIn: "Calm & Sleep Gummies",
    },
  },
];

// Card component
const HerbalCard: React.FC<{ herb: Herb }> = ({ herb }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer w-full h-64 perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">[{herb.id}] {herb.name}</span>
            <span className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
          <div
            className="mt-6 w-16 h-16"
            dangerouslySetInnerHTML={{ __html: herb.svg }}
          />
          <div className="mt-4 text-xs text-gray-600">
            <strong>Best For:</strong> {herb.bestFor.join(", ")}
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-gray-100 rounded-lg p-4 shadow transform rotate-y-180 overflow-auto text-sm">
          <h4 className="font-semibold">Origins</h4>
          <p>{herb.back.origin}</p>

          <h4 className="font-semibold mt-2">Why We Use It</h4>
          <p>{herb.back.whyWeUseIt}</p>

          <h4 className="font-semibold mt-2">Used In</h4>
          <p>{herb.back.usedIn}</p>

          <h4 className="font-semibold mt-2">Studies</h4>
          <ul className="list-disc list-inside">
            {herb.back.studies.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" className="text-blue-600 underline">
                  Study {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Full page
const HerbalIndex = () => {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <Header />
      <div className="text-center px-4 pt-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] max-w-xl mx-auto">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>
        <img
          src="images/thescience/pillar1.jpg"
          alt="Herbal Index Banner"
          className="mx-auto mt-8 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-8 py-12">
        {herbs.map((herb) => (
          <HerbalCard key={herb.id} herb={herb} />
        ))}
      </div>
    </div>
  );
};

export default HerbalIndex;
