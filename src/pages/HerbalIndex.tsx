// pages/HerbalIndex.tsx
import React from "react";
import Header from "@/components/Header";
import HerbalCard from "@/components/HerbalCard";
import { herbs } from "@/data/herbs";

const HerbalIndex = () => {
  return (
    <div className="bg-[#F8F8F5] min-h-screen text-[#1E1E1E]">
      <Header />
      <section className="max-w-[1200px] mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>

        <div className="aspect-[3/1] rounded-3xl overflow-hidden mb-12">
          <img
            src="/images/herbs/mushroom-banner.png"
            alt="Herbal Index Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {herbs.map((herb) => (
            <div key={herb.id} className="h-[300px]">
              <HerbalCard herb={herb} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HerbalIndex;
