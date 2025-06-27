import Header from "@/components/Header";

const TheScience = () => {
  return (
    <div className="bg-[#F8F8F5] text-[#1E1E1E]">
      <Header />

      {/* Intro Section */}
        <main className="max-w-[1200px] mx-auto px-4 pt-16 space-y-24 pb-32">

    {/* Top Section */}
    <section className="flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Good science feels like magic, and we’re here to share that with the world
        </h1>
        <p className="text-base text-[#3C3C3C]">
          We’ve done the hard work to find the best ingredients and the most novel technologies to help you get the purest, cleanest, most effective products on the market.
        </p>
      </div>
      <div className="flex-1">
        <img
          src="/images/thescience/header-image.webp"
          alt="Science overview"
          className="w-full rounded-lg"
        />
      </div>
    </section>

    {/* Pillars */}
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-16 my-12">
  {[
    {
      title: "Transparency",
      image: "/images/thescience/pillar1.jpg",
    },
    {
      title: "Scientific Efficacy",
      image: "/images/thescience/pillar2.jpg",
    },
    {
      title: "Clean Ingredients",
      image: "/images/thescience/pillar3.jpg",
    },
    {
      title: "Maximum Effect",
      image: "/images/thescience/pillar4.jpg",
    },
  ].map((item, idx) => (
    <div
      key={idx}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="text-center text-sm mt-2 mb-4 font-medium">
        {item.title}
      </div>
    </div>
  ))}
</section>


    {/* Doctors Section */}
    <section className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">Proprietary formulas made by Neuroscientists and Clinical Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "Dr. Julie Hwang, MD", image: "/images/thescience/doc1.webp" },
          { name: "Dr. Christine Wong, PhD", image: "/images/thescience/doc2.webp" },
          { name: "Dr. Riley Chen, MD", image: "/images/thescience/doc3.webp" },
        ].map((doc) => (
          <div key={doc.name}>
            <img src={doc.image} alt={doc.name} className="w-full rounded-md mb-2" />
            <p className="text-sm font-medium">{doc.name}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Accordion - Proprietary Formulas */}
    <section className="space-y-6">
      <h3 className="text-xl font-semibold">Each formula is crafted with care</h3>
      <details className="bg-white border rounded-lg p-4">
        <summary className="cursor-pointer font-medium">Backed by Human Clinical Studies</summary>
        <p className="mt-2 text-sm text-gray-600">Every ingredient and product we use has been tested in clinical trials.</p>
      </details>
      <details className="bg-white border rounded-lg p-4">
        <summary className="cursor-pointer font-medium">Made for Maximum Value & Effect</summary>
        <p className="mt-2 text-sm text-gray-600">Formulated for potency, absorption, and real-world benefits.</p>
      </details>
      <details className="bg-white border rounded-lg p-4">
        <summary className="cursor-pointer font-medium">For Immediate and Long-term Effects</summary>
        <p className="mt-2 text-sm text-gray-600">Designed for quick noticeable impact and lasting support.</p>
      </details>
    </section>

    {/* Gummies Image */}
    <section className="w-full">
      <img
        src="/images/thescience/gummies-blocks.webp"
        alt="Gummies block"
        className="rounded-xl w-full"
      />
    </section>

    {/* Dual Layer Section */}
    <section>
      <h3 className="text-xl font-semibold mb-4">Innovative dual-layer gummies that work better, faster and longer</h3>
      <div className="flex items-start gap-10 flex-col md:flex-row">
        <div className="flex-1 space-y-4">
          <details className="bg-white border rounded-lg p-4">
            <summary className="cursor-pointer font-medium">Outer Protective Layer</summary>
            <p className="mt-2 text-sm text-gray-600">Protects active ingredients and starts digestion later.</p>
          </details>
          <details className="bg-white border rounded-lg p-4">
            <summary className="cursor-pointer font-medium">Enhanced Bioavailability</summary>
            <p className="mt-2 text-sm text-gray-600">Optimized for maximum absorption in the gut.</p>
          </details>
          <details className="bg-white border rounded-lg p-4">
            <summary className="cursor-pointer font-medium">Quick Release Effects</summary>
            <p className="mt-2 text-sm text-gray-600">Get noticeable benefits in minutes, not hours.</p>
          </details>
        </div>
        <div className="flex-1">
          <img
            src="/images/thescience/gummy-hand.webp"
            alt="Gummy on hand"
            className="rounded-xl"
          />
        </div>
      </div>
    </section>

    {/* Final Commitment Section */}
    <section>
      <h3 className="text-xl font-semibold mb-4">Committing to the highest standards in formulation, testing and production</h3>
      <div className="space-y-4">
        <details className="bg-white border rounded-lg p-4">
          <summary className="cursor-pointer font-medium">Multistep Clinical Research Methodology</summary>
          <p className="mt-2 text-sm text-gray-600">We test and refine every step from raw ingredient to finished product.</p>
        </details>
        <details className="bg-white border rounded-lg p-4">
          <summary className="cursor-pointer font-medium">cGMP Manufacturing</summary>
          <p className="mt-2 text-sm text-gray-600">Manufactured in facilities that follow current Good Manufacturing Practices.</p>
        </details>
        <details className="bg-white border rounded-lg p-4">
          <summary className="cursor-pointer font-medium">Alpha, Beta and Third Party Testing</summary>
          <p className="mt-2 text-sm text-gray-600">All products undergo internal and external testing for quality, potency and safety.</p>
        </details>
      </div>
    </section>
  </main>

  {/* Simple Footer Placeholder */}
  <footer className="text-center py-10 border-t mt-16 text-sm text-[#777]">
    <p>NOON © 2025 All rights reserved.</p>
  </footer>
</div>

  );
};

export default TheScience;
