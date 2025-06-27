import React from "react";
import HerbalCard from "@/components/HerbalCard";
import Header from "@/components/Header";

const herbs = [
  {
    id: 1,
    title: "American Ginseng",
    icon: "/icons/american-ginseng.svg",
    color: "#B49A52",
    frontText: "Energy, Memory, Mood Clarity",
    backContent: (
      <div>
        <h4 className="font-semibold text-sm mb-1">Origins</h4>
        <p className="text-xs mb-2">
          Native to the Appalachian Mountains and Eastern Canada, revered in both Native American and traditional Chinese medicine.
        </p>
        <h4 className="font-semibold text-sm mb-1">Why We Use It</h4>
        <p className="text-xs mb-2">
          Ginsenosides support your nervous system and brain cell growth, and help reduce stress response.
        </p>
        <h4 className="font-semibold text-sm mb-1">Key Studies</h4>
        <ul className="text-xs list-disc list-inside mb-2">
          <li><a href="#" className="underline">Study 1</a></li>
          <li><a href="#" className="underline">Study 2</a></li>
          <li><a href="#" className="underline">Study 3</a></li>
        </ul>
        <h4 className="font-semibold text-sm mb-1">Used In</h4>
        <p className="text-xs">In the Zone & Matcha Chocolate Delights</p>
      </div>
    ),
  },
  // Add the other 24 herbs here in similar format...
];

const HerbalIndex = () => {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-center mb-4">
          A whole world of mushrooms,<br /> adaptogens and nootropics that<br /> work better, together.
        </h1>
        <div className="my-8">
          <img
            src="/images/herbal-banner.png"
            alt="Mushroom"
            className="rounded-2xl w-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-12">
          {herbs.map((herb) => (
            <HerbalCard key={herb.id} {...herb} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HerbalIndex;
