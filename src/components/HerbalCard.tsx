// src/components/HerbalCard.tsx
import React, { useState } from "react";
import type { Herb } from "@/data/herbs";

const HerbalCard = ({ herb }: { herb: Herb }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full h-[360px] [perspective:1200px] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-semibold text-[#161616]">[{herb.id}]</span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: herb.color || "#C1A85F" }}
            />
          </div>
          <div className="mb-4 w-10 h-10">{herb.svg}</div>
          <h3 className="font-semibold text-[#161616] text-lg">{herb.name}</h3>
          <p className="italic text-sm text-gray-500 mb-4">{herb.latinName}</p>
          <p className="text-sm font-semibold text-[#1E1E1E]">Best For</p>
          <p className="text-sm text-gray-600">{herb.bestFor.join(", ")}</p>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-xl shadow-md p-6 text-sm text-[#444] overflow-hidden">
          <h3 className="font-semibold text-[#161616] mb-2">{herb.name}</h3>
          <p className="mb-2">
            <strong>Origins:</strong> {herb.back.origin}
          </p>
          <p className="mb-2">
            <strong>Why We Use It:</strong> {herb.back.whyWeUseIt}
          </p>
          <p className="font-semibold mt-2">Key Studies:</p>
          <ul className="list-disc ml-5 text-blue-600 underline">
            {herb.back.studies.map((link, i) => (
              <li key={i}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Study {i + 1}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2">
            <strong>Used In:</strong> {herb.back.usedIn}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HerbalCard;
