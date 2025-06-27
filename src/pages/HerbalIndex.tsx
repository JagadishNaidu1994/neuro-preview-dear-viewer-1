import React from "react";
import Header from "@/components/Header";
import HerbalCard from "@/components/HerbalCard";
import { herbs } from "@/data/herbalData";

const HerbalIndex = () => {
  return (
    <div className="bg-[#F8F8F5] min-h-screen text-[#1E1E1E]">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
          A whole world of mushrooms, adaptogens and nootropics that work better, together.
        </h1>
      </section>

      {/* Hero Mushroom Image */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <img
          src="/images/herbal/hero-mushroom.png"
          alt="Herbal Index Hero"
          className="w-full rounded-xl object-cover"
        />
      </div>

      {/* Herb Cards Grid */}
      <section className="max-w-[1300px] mx-auto px-4 pb-20 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {herbs.map((herb) => (
          <HerbalCard
            key={herb.id}
            id={herb.id}
            title={herb.title}
            icon={herb.icon}
            color={herb.color}
            frontText={herb.frontText}
            backContent={herb.backContent}
          />
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-[#F8F8F5] pt-20 pb-12 text-sm text-gray-500 relative">
        <div className="absolute bottom-0 left-0 w-full text-center opacity-10">
          <img src="/images/footer-noon-logo.svg" alt="NOON Logo" className="mx-auto h-24" />
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center z-10 relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-8">
            <a href="/shop-all">Shop All</a>
            <a href="/the-science">The Science</a>
            <a href="/ethos">Our Ethos</a>
            <a href="/herbal-index">Herbal Index</a>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 DearNeuro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HerbalIndex;
