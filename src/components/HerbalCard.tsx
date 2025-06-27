import React, { useState } from "react";
import type { Herb } from "@/data/herbs";

interface Props {
  herb: Herb;
}

const HerbalCard: React.FC<Props> = ({ herb }) => {
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
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#aaa" }} />
          </div>
          <div className="mt-6 w-16 h-16" dangerouslySetInnerHTML={{ __html: herb.svg }} />
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
                <a href={url} target="_blank" className="text-blue-600 underline">Study {i + 1}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HerbalCard;
