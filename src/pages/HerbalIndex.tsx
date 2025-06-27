import React from "react";
import Header from "@/components/Header";

const herbs = [
  { name: "American Ginseng", latin: "Panax quinquefolius", icon: "american-ginseng.svg" },
  { name: "Ashwagandha", latin: "Withania somnifera", icon: "ashwagandha.svg" },
  { name: "Cacao Seed", latin: "Theobroma cacao", icon: "cacao-seed.svg" },
  { name: "Calendula", latin: "Calendula officinalis", icon: "calendula.svg" },
  { name: "Chaga Mushroom", latin: "Inonotus obliquus", icon: "chaga-mushroom.svg" },
  { name: "Chamomile", latin: "Matricaria chamomilla", icon: "chamomile.svg" },
  { name: "Cordyceps Mushroom", latin: "Cordyceps sinensis", icon: "cordyceps.svg" },
  { name: "Echinacea", latin: "Echinacea purpurea", icon: "echinacea.svg" },
  { name: "GABA", latin: "Gamma-Aminobutyric Acid", icon: "gaba.svg" },
  { name: "Goji Berry", latin: "Lycium barbarum", icon: "goji-berry.svg" },
  { name: "Green Tea Leaf", latin: "Camellia sinensis", icon: "green-tea.svg" },
  { name: "L-Theanine", latin: "L-Theanine", icon: "l-theanine.svg" },
  { name: "Lion's Mane Mushroom", latin: "Hericium erinaceus", icon: "lion-mane-mushroom.svg" },
  { name: "Magnesium Glycinate", latin: "Magnesium glycinate", icon: "magnesium-glycinate.svg" },
  { name: "Maitake Mushroom", latin: "Grifola frondosa", icon: "maitake.svg" },
  { name: "Passionflower", latin: "Passiflora incarnata", icon: "passionflower.svg" },
  { name: "Poria Cocos Mushroom", latin: "Wolfiporia extensa", icon: "poria-cocos.svg" },
  { name: "Reishi Mushroom", latin: "Ganoderma lucidum", icon: "reishi.svg" },
  { name: "Rhodiola", latin: "Rhodiola rosea", icon: "rhodiola.svg" },
  { name: "Schisandra Berry", latin: "Schisandra chinensis", icon: "schisandra.svg" },
  { name: "Shiitake Mushroom", latin: "Lentinula edodes", icon: "shiitake.svg" },
  { name: "Tremella Mushroom", latin: "Tremella fuciformis", icon: "tremella.svg" },
  { name: "Turkey Tail Mushroom", latin: "Coriolus versicolor", icon: "turkey-tail.svg" },
  { name: "Valerian Root", latin: "Valeriana officinalis", icon: "valerian-root.svg" },
  { name: "Vitamin B Complex", latin: "Vitamins B1-B12", icon: "vitamin-b-complex.svg" },
  { name: "Vitamin D3", latin: "Cholecalciferol", icon: "vitamin-d3.svg" },
];

const HerbalIndex = () => {
  return (
    <div className="bg-[#FAFAF7] text-[#1E1E1E] min-h-screen">
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            A whole world of mushrooms,<br />adaptogens and nootropics that<br />work better, together.
          </h1>
        </section>

        <section className="mb-16">
          <img
            src="/images/hero-herbal.jpg"
            alt="Herbal Index Hero"
            className="w-full rounded-2xl"
          />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {herbs.map((herb, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="w-2 h-2 bg-gray-300 rounded-full" />
              </div>
              <img
                src={`/icons/herbs/${herb.icon}`}
                alt={herb.name}
                className="w-12 h-12 mb-4"
              />
              <h3 className="text-lg font-semibold">{herb.name}</h3>
              <p className="text-xs italic text-gray-500 mb-2">{herb.latin}</p>
              <p className="text-sm text-gray-600 mb-2">
                Description placeholder for {herb.name}. Customize later.
              </p>
              <p className="text-xs text-gray-500">
                <strong>Best For:</strong> Stress, Focus, Mood
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="bg-[#FAFAF7] text-center text-sm text-gray-400 py-12">
        <img
          src="/images/footer-noon.svg"
          alt="NOON Logo"
          className="mx-auto w-32 opacity-10 mb-4"
        />
        <div className="space-x-4">
          <a href="/shop-all">Shop All</a>
          <a href="/the-science">The Science</a>
          <a href="/ethos">Our Ethos</a>
          <a href="/herbal-index">Herbal Index</a>
        </div>
        <p className="mt-4">&copy; 2025 All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HerbalIndex;
