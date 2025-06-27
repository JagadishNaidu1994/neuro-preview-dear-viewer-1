// components/HerbalCard.tsx
import React, { useState } from "react";
import "./HerbalCard.css"; // Custom flip styles if needed

interface Herb {
  id: number;
  name: string;
  svg: JSX.Element;
  bestFor: string;
  frontColor?: string;
  details?: {
    origins?: string;
    whyWeUseIt?: string;
    usedIn?: string;
    studies?: string[];
  };
}

const HerbalCard = ({ herb }: { herb: Herb }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-full cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white rounded-xl shadow p-4 [backface-visibility:hidden] flex flex-col justify-between">
          <div className="flex justify-between">
            <span className="text-xs font-bold">[{herb.id}]</span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: herb.frontColor || "#d4d4d4" }}
            ></span>
          </div>
          <div className="mt-2">{herb.svg}</div>
          <div className="mt-4">
            <h3 className="text-sm font-bold">{herb.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{herb.bestFor}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-white rounded-xl shadow p-4 rotate-y-180 [backface-visibility:hidden] overflow-auto">
          <h3 className="text-sm font-bold mb-2">[{herb.id}] {herb.name}</h3>

          {herb.details?.origins && (
            <div className="mb-2">
              <p className="font-semibold text-xs">Origins</p>
              <p className="text-xs text-gray-600">{herb.details.origins}</p>
            </div>
          )}

          {herb.details?.whyWeUseIt && (
            <div className="mb-2">
              <p className="font-semibold text-xs">Why We Use It</p>
              <p className="text-xs text-gray-600">{herb.details.whyWeUseIt}</p>
            </div>
          )}

          {herb.details?.studies && (
            <div className="mb-2">
              <p className="font-semibold text-xs">Key Studies</p>
              <ul className="text-xs text-blue-600 underline">
                {herb.details.studies.map((study, idx) => (
                  <li key={idx}>
                    <a href={study} target="_blank" rel="noopener noreferrer">
                      Study {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {herb.details?.usedIn && (
            <div>
              <p className="font-semibold text-xs">Used In</p>
              <p className="text-xs text-gray-600">{herb.details.usedIn}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HerbalCard;
