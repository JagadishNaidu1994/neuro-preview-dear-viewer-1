// src/pages/HerbalIndex.tsx
import React from "react";
import HerbalCard from "@/components/HerbalCard";
import { herbs } from "@/data/herbalData";
import Header from "@/components/Header";

const HerbalIndex = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#1E1E1E]">
      <Header />
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-semibold text-center mb-10">
          A whole world of mushrooms,<br /> adaptogens and nootropics that work better, together.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {herbs.map((herb) => (
            <HerbalCard
              key={herb.name}
              name={herb.name}
              index={herb.index}
              icon={herb.icon}
              colorDot={herb.colorDot}
              details={herb.details}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HerbalIndex;
