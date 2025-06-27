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
      onClick={() => setFlipped(!flipped)}
      className={`cursor-pointer transform transition-transform duration-500 relative w-full h-64 rounded-xl shadow-md bg-white ${flipped ? "rotate-y-180" : ""}`}
    >
      <div className="absolute inset-0 p-4 backface-hidden">
        {/* Front content */}
        <div
          className="w-12 h-12 mb-2"
          dangerouslySetInnerHTML={{ __html: herb.svg }}
        />
        <h3 className="text-sm font-semibold">[{herb.id}] {herb.name}</h3>
        <p className="text-xs text-gray-600 mt-2">{herb.bestFor.join(", ")}</p>
      </div>

      <div className="absolute inset-0 p-4 rotate-y-180 backface-hidden bg-[#FAFAF7] text-sm">
        <h4 className="font-bold">Origins</h4>
        <p>{herb.back.origin}</p>
        <h4 className="font-bold mt-2">Why We Use It</h4>
        <p>{herb.back.whyWeUseIt}</p>
      </div>
    </div>
  );
};


export default HerbalCard;
