// src/components/HerbalCard.tsx
import React, { useState } from "react";
import "./HerbalCard.css"; // CSS file for flip animation

interface Study {
  title: string;
  link: string;
}

interface HerbalCardProps {
  id: number;
  name: string;
  icon: string;
  color: string;
  back: {
    origins: string;
    why: string;
    studies: Study[];
    usedIn: string;
  };
}

const HerbalCard: React.FC<HerbalCardProps> = ({ id, name, icon, color, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flip-card" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flip-inner ${isFlipped ? "flipped" : ""}`}>
        {/* Front */}
        <div className="flip-front">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold">[{String(id).padStart(2, "0")}]</span>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          </div>
          <img src={icon} alt={name} className="w-10 h-10 mb-4" />
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>

        {/* Back */}
        <div className="flip-back">
          <h3 className="font-semibold text-md mb-2">{name}</h3>
          <p className="mb-2"><strong>Origins:</strong> {back.origins}</p>
          <p className="mb-2"><strong>Why We Use It:</strong> {back.why}</p>
          <p className="mb-2"><strong>Key Studies:</strong></p>
          <ul className="list-disc pl-5 text-blue-600">
            {back.studies.map((s, i) => (
              <li key={i}>
                <a href={s.link} target="_blank" rel="noreferrer">{s.title}</a>
              </li>
            ))}
          </ul>
          <p className="mt-2"><strong>Used In:</strong> {back.usedIn}</p>
        </div>
      </div>
    </div>
  );
};

export default HerbalCard;
