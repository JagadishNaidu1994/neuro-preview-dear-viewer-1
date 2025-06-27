import React, { useState } from "react";
import type { Herb } from "@/data/herbs";

const HerbalCard = ({ herb }: { herb: Herb }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer perspective"
      style={{ perspective: "1000px" }}
    >
      <div
        className={`relative w-full h-[340px] transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full p-6 bg-white rounded-xl shadow-md backface-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-semibold text-[#161616]">[{herb.id}]</span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: herb.color || "#C1A85F" }}
            />
          </div>

          <div className="w-10 h-10 mb-4">{herb.svg}</div>

          <h3 className="font-semibold text-[#161616] text-base">{herb.name}</h3>
          <p className="italic text-sm text-gray-500 mb-4">{herb.latinName}</p>

          <div className="mt-auto">
            <p className="text-sm font-semibold text-[#1E1E1E]">Best For</p>
            <p className="text-sm text-[#555]">{herb.bestFor.join(", ")}</p>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full p-6 bg-white rounded-xl shadow-md rotate-y-180 backface-hidden overflow-hidden">
          <h3 className="font-semibold text-[#161616] text-base mb-2">{herb.name}</h3>

          <p className="text-[13px] text-[#555] mb-2">
            <strong>Origins:</strong> {herb.back.origin}
          </p>

          <p className="text-[13px] text-[#555] mb-2">
            <strong>Why We Use It:</strong> {herb.back.whyWeUseIt}
          </p>

          <div className="mb-2">
            <p className="text-sm font-semibold">Key Studies:</p>
            <ul className="list-disc list-inside text-blue-600 text-sm">
              {herb.back.studies.map((study, index) => (
                <li key={index}>
                  <a href={study} target="_blank" rel="noopener noreferrer">
                    Study {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[13px] text-[#555] mt-2">
            <strong>Used In:</strong> {herb.back.usedIn}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HerbalCard;
