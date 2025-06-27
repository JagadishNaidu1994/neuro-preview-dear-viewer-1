import React from "react";
import Header from "@/components/Header";
import herbs from "@/data/herbs";
import HerbalCard from "@/components/HerbalCard";

const HerbalIndex = () => {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <Header />
      <div className="text-center px-4 pt-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] max-w-xl mx-auto">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>
        <img
          src="/images/herbal-banner.png"
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
