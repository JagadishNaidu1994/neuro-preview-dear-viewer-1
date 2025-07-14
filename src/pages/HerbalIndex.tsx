import React from "react";
import { herbs } from "@/data/herbs";
import HerbalCard from "@/components/HerbalCard";
import Header from "@/components/Header";
const HerbalIndex = () => {
  return <div className="min-h-screen bg-[#F9F9F4]">
      <Header />
      <section className="w-full px-4 py-12 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold text-center mb-12 text-[#161616]">
            A whole world of mushrooms, adaptogens and nootropics that work better, together.
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {herbs.map(herb => <HerbalCard key={herb.id} herb={herb} />)}
          </div>
        </div>
      </section>
    </div>;
};
export default HerbalIndex;