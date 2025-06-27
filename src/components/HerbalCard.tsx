import React, { useState } from "react";
import type { Herb } from "@/data/herbs";

const HerbalCard = ({ herb }: { herb: Herb }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute backface-hidden w-full h-full p-6 rounded-xl bg-white shadow-md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-[#161616]">[{herb.id}]</span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: herb.color || "#C1A85F" }}
            />
          </div>

          <div className="mb-4 w-10 h-10">{herb.svg}</div>

          <h3 className="font-semibold text-[#161616] text-lg">{herb.name}</h3>
          <p className="italic text-sm text-gray-500 mb-4">{herb.latinName}</p>
          <div>
            <p className="text-sm font-semibold text-[#1E1E1E]">Best For</p>
            <p className="text-sm text-[#555]">
              {herb.bestFor.join(", ")}
            </p>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute backface-hidden rotate-y-180 w-full h-full p-6 rounded-xl bg-white shadow-md text-sm overflow-hidden">
          <h3 className="font-semibold text-[#161616] text-base mb-1">{herb.name}</h3>
          <p className="text-[13px] text-[#555] mb-2"><strong>Origins:</strong> {herb.back.origin}</p>
          <p className="text-[13px] text-[#555] mb-2"><strong>Why We Use It:</strong> {herb.back.whyWeUseIt}</p>
          <div className="mb-2">
            <strong>Key Studies:</strong>
            <ul className="list-disc ml-5 text-blue-600 underline">
              {herb.back.studies.map((study, index) => (
                <li key={index}><a href={study} target="_blank" rel="noopener noreferrer">Study {index + 1}</a></li>
              ))}
            </ul>
          </div>
          <p className="text-[13px] text-[#555]"><strong>Used In:</strong> {herb.back.usedIn}</p>
        </div>
      </div>
    </div>
  );
};

export default HerbalCard;
