import React, { useState } from "react";
import "../styles/herbal.css";
import { Herb } from "@/data/herbs";

const HerbalCard = ({ herb }: { herb: Herb }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`herbal-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
      <div className="card-inner">
        {/* Front */}
        <div className="card-front">
          <div dangerouslySetInnerHTML={{ __html: herb.svg }} className="herb-icon" />
          <h3>{herb.name}</h3>
          <p><em>{herb.latinName}</em></p>
          <p className="text-sm text-gray-600">
            <strong>Best For</strong><br />
            {herb.bestFor.join(", ")}
          </p>
        </div>

        {/* Back */}
        <div className="card-back">
          <h3>{herb.name}</h3>
          <p className="font-bold mt-2">Origins:</p>
          <p>{herb.back.origin}</p>
          <p className="font-bold mt-2">Why We Use It:</p>
          <p>{herb.back.whyWeUseIt}</p>
          <p className="font-bold mt-2">Key Studies:</p>
          <ul className="list-disc ml-4">
            {herb.back.studies.map((url, i) => (
              <li key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Study {i + 1}</a></li>
            ))}
          </ul>
          <p className="font-bold mt-2">Used In:</p>
          <p>{herb.back.usedIn}</p>
        </div>
      </div>
    </div>
  );
};

export default HerbalCard;
