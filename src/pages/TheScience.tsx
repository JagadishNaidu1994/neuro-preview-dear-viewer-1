import Header from "@/components/Header";

const TheScience = () => {
  return (
    <div className="bg-[#F8F8F5] text-[#1E1E1E]">
      <Header />

      {/* Intro Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Good science feels like magic, and we're here to share that with the world
          </h1>
          <p className="text-lg text-[#444]">
            We’ve done the hard work to find the best ingredients and the most novel technology to give you the purest, cleanest and most effective products on the market. Neuroscience backed to help you sleep good, feel full, and support your best self.
          </p>
        </div>
        <img
          src="https://noon.world/cdn/shop/files/noon-science-top.png"
          alt="Hand with drop"
          className="w-full rounded-lg"
        />
      </section>

      {/* Four Icons Row */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { label: "Transparency", src: "https://noon.world/cdn/shop/files/science_1.jpg" },
          { label: "Scientific Efficacy", src: "https://noon.world/cdn/shop/files/science_2.jpg" },
          { label: "Clean Ingredients", src: "https://noon.world/cdn/shop/files/science_3.jpg" },
          { label: "Maximum Effect", src: "https://noon.world/cdn/shop/files/science_4.jpg" }
        ].map((item, i) => (
          <div key={i}>
            <img src={item.src} alt={item.label} className="rounded-lg w-full" />
            <p className="mt-2 text-sm font-semibold">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <h2 className="text-2xl font-bold mb-4">
            Neuroscience meets nature. Our scientific leadership team combines expertise in cutting-edge brain research with the regenerative power of plants.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                name: "Dr. Julie Hwang, MD",
                img: "https://noon.world/cdn/shop/files/science_julie.png",
              },
              {
                name: "Dr. Christine Wong, PhD",
                img: "https://noon.world/cdn/shop/files/science_wong.png",
              },
              {
                name: "Dr. Samantha Lee, ND",
                img: "https://noon.world/cdn/shop/files/science_sam.png",
              }
            ].map((doc, i) => (
              <div key={i} className="text-center">
                <img src={doc.img} alt={doc.name} className="mx-auto w-[120px] rounded-full mb-4" />
                <p className="text-sm font-medium">{doc.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion Section (summary) */}
      <section className="max-w-[800px] mx-auto px-6 md:px-10 py-16 text-sm leading-relaxed space-y-10">
        <div>
          <h3 className="font-bold text-lg mb-2">Proprietary formulas made by Neuroscientists and Clinical Doctors</h3>
          <p>
            Each formula is crafted with care by our Neuroscience & Clinical Formulation team with clinically tested ingredients and informed by decades of herbal tradition.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Innovative dual-layer gummies that work better, faster and longer</h3>
          <p>
            Our outer layer supports quick digestion while the inner layer ensures long-lasting effects. We use liposomal delivery for superior absorption.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Committing to the highest standards in formulation, testing and production</h3>
          <p>
            We back up every product with high scientific research and rigorous testing protocols. Each batch is third-party tested and made with clean manufacturing practices.
          </p>
        </div>
      </section>

      {/* Image Highlights */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-20 grid md:grid-cols-2 gap-10">
        {[
          "https://noon.world/cdn/shop/files/science_gummy1.jpg",
          "https://noon.world/cdn/shop/files/science_gummy2.jpg",
          "https://noon.world/cdn/shop/files/science_hand.jpg",
        ].map((img, i) => (
          <img key={i} src={img} alt={`Science visual ${i}`} className="rounded-lg w-full" />
        ))}
      </section>
    </div>
  );
};

export default TheScience;
