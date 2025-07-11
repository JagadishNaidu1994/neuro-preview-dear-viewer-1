// src/pages/Ethos.tsx
import React from "react";
import Header from "@/components/Header";
const Ethos = () => {
  return <div className="min-h-screen bg-[#FAFAF7] text-[#1E1E1E]">
      <Header />
      <main className="w-full px-4 md:px-8 pt-12 space-y-24 pb-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Hero Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-semibold mb-6">
                Pioneering the future of your best mind & mood through the power of plants
              </h1>
              <p className="text-base md:text-lg text-[#3C3C3C]">
                We're a next-gen cognitive wellness company on a mission to help people reach their fullest potential by nurturing their greatest asset—the mind.
                By melding the power of neuroscience with plant science, we're creating tools to help you tune into your best state of mind.
              </p>
            </div>
            <div>
              <img src="https://cdn.shopify.com/s/files/1/0671/5382/1848/files/chill_editorial_ethos.png" alt="Chill Gummy Hero" className="w-full rounded-xl" />
            </div>
          </section>

          {/* Large Image */}
          <section>
            <img src="/images/ethos/hand_gummy.webp" alt="Gummy Held" className="w-full rounded-xl" />
          </section>

          {/* Care Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img src="/images/ethos/gummy_eating.webp" alt="Gummy Eating" className="rounded-xl" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                We believe in creating small moments of care to tend the mind-body axis
              </h2>
              <p className="text-base md:text-lg text-[#3C3C3C]">
                Your mind is the most powerful part of your body; it's the control center for your whole body, helping you manage stress, emotions and hormones.
                Our products are cognitive rituals to help you feel more deeply, stay connected to the present and have clear thoughts.
                We believe in small and repeatable rituals to make everyday feel amazing.
              </p>
            </div>
          </section>

          {/* Beautiful Design Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Designing beautiful products that help you build joyful, consistent habits
              </h2>
              <p className="text-base md:text-lg text-[#3C3C3C]">
                We believe that aesthetics are more than just a visual treat—they are drivers for behavioral change.
                Neuroscience shows that people are drawn to beautiful, functional designs that reprogram the mind and support new habits.
                Our products are expertly crafted to turn everyday routines into joyful rituals, helping you stay consistent with your wellness goals.
                Through our engaging, sensory products and experiences, we make wellness a seamless part of your life.
              </p>
            </div>
            <div>
              <img src="/images/ethos/gummy_sparkling.webp" alt="Gummy Cubes" className="rounded-xl" />
            </div>
          </section>

          {/* Wisdom Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img src="/images/ethos/founders.webp" alt="Founders Jane and Julie" className="rounded-xl" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Proudly transforming 8,000 years of plant wisdom into small, bite-sized delights
              </h2>
              <p className="text-base md:text-lg text-[#3C3C3C]">
                We were born out of our personal experiences of burnout and a return to our roots in Traditional Chinese Medicine to find natural and holistic ways to improve our wellbeing.
                But finding and preparing the herbs isn't accessible for everyone—including ourselves.
                We wanted to find a new way to get the superpowers of the herbs in a more compact and easy form, without compromising on the efficacy.
                <br /><br />
                Today, we're proud to transform the strength of 8,000 years of ancient herbal wisdom into fun, tasty products that actually work.
                Bringing the best of East and West, beauty and science all together in the form of delights.
                <br />
                — Jane & Julie
              </p>
            </div>
          </section>

          {/* Footer Logo */}
          <footer className="mt-24 relative">
            <div className="flex justify-center">
              
            </div>
            
          </footer>
        </div>
      </main>
    </div>;
};
export default Ethos;