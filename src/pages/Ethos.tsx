
import React from "react";
import Header from "@/components/Header";

const Ethos = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1E1E1E]">
      <Header />
      <main className="w-full px-4 md:px-8 lg:px-12 xl:px-16 pt-16 pb-32">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                Pioneering the future of your best mind & mood through the power of cognitive enhancement
              </h1>
              <p className="text-lg md:text-xl text-[#3C3C3C] leading-relaxed">
                We're a next-gen cognitive wellness company on a mission to help people reach their fullest potential by nurturing their greatest asset—the mind.
                By melding the power of neuroscience with natural supplements, we're creating tools to help you tune into your best state of mind.
              </p>
            </div>
            <div className="w-full">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"
                alt="Brain Supplements"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          </section>

          {/* Large Image Section */}
          <section className="w-full">
            <img
              src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=1200&q=80"
              alt="Cognitive Enhancement Supplements"
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </section>

          {/* Care Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="w-full order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"
                alt="Brain Health Supplements"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                We believe in creating small moments of care to enhance the mind-body connection
              </h2>
              <p className="text-lg md:text-xl text-[#3C3C3C] leading-relaxed">
                Your mind is the most powerful part of your body; it's the control center for your whole body, helping you manage stress, emotions and cognitive function.
                Our products are cognitive rituals to help you think more clearly, stay focused and have enhanced mental performance.
                We believe in small and repeatable rituals to make everyday feel sharper and more focused.
              </p>
            </div>
          </section>

          {/* Beautiful Design Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                Designing premium supplements that help you build effective, consistent cognitive habits
              </h2>
              <p className="text-lg md:text-xl text-[#3C3C3C] leading-relaxed">
                We believe that quality is more than just ingredients—it's the foundation for cognitive transformation.
                Neuroscience shows that people respond better to high-quality, consistent supplementation that supports new neural pathways.
                Our products are expertly formulated to turn everyday routines into powerful cognitive rituals, helping you stay consistent with your mental wellness goals.
                Through our premium, science-backed supplements and experiences, we make cognitive enhancement a seamless part of your life.
              </p>
            </div>
            <div className="w-full">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80"
                alt="Premium Brain Supplements"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          </section>

          {/* Wisdom Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="w-full order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80"
                alt="Founders Jane and Julie"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                Proudly transforming decades of neuroscience research into premium, effective supplements
              </h2>
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-[#3C3C3C] leading-relaxed">
                  We were born out of our personal experiences with mental fatigue and a deep dive into neuroscience research to find natural and effective ways to improve our cognitive performance.
                  But finding and combining the right ingredients isn't accessible for everyone—including ourselves.
                  We wanted to find a new way to get the benefits of premium nootropics in a more convenient and reliable form, without compromising on the science.
                </p>
                <p className="text-lg md:text-xl text-[#3C3C3C] leading-relaxed">
                  Today, we're proud to transform the power of cutting-edge neuroscience into premium, effective products that actually work.
                  Bringing the best of science and nature, quality and efficacy all together in the form of cognitive enhancement.
                </p>
                <p className="text-lg md:text-xl text-[#3C3C3C] font-medium italic">
                  — Jane & Julie, Co-Founders
                </p>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="pt-16 text-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3C3C3C]/20 to-transparent mb-8"></div>
            <p className="text-[#3C3C3C] text-lg">
              Enhance your cognitive potential with science-backed supplements
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Ethos;
