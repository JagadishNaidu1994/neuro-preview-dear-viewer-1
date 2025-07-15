import React from "react";
import Header from "@/components/Header";

const Ethos = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="w-full px-4 md:px-8 lg:px-12 xl:px-16 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24 lg:space-y-32">
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
                Pioneering the future of your best mind & mood through the power of plants
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                We're a next-gen cognitive wellness company on a mission to help people reach their fullest potential by nurturing their greatest asset—the mind.
                By melding the power of neuroscience with plant science, we're creating tools to help you tune into your best state of mind.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <img 
                src="https://images.unsplash.com/photo-1750296812293-e97d7e972f27?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Chill Gummy Hero" 
                className="w-full h-auto rounded-xl shadow-lg" 
              />
            </div>
          </section>

          {/* Large Image */}
          <section className="py-8 md:py-12">
            <img 
              src="/images/ethos/hand_gummy.webp" 
              alt="Gummy Held" 
              className="w-full h-auto rounded-xl shadow-lg" 
            />
          </section>

          {/* Care Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div>
              <img 
                src="/images/ethos/gummy_eating.webp" 
                alt="Gummy Eating" 
                className="w-full h-auto rounded-xl shadow-lg" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                We believe in creating small moments of care to tend the mind-body axis
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Your mind is the most powerful part of your body; it's the control center for your whole body, helping you manage stress, emotions and hormones.
                Our products are cognitive rituals to help you feel more deeply, stay connected to the present and have clear thoughts.
                We believe in small and repeatable rituals to make everyday feel amazing.
              </p>
            </div>
          </section>

          {/* Beautiful Design Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 lg:order-first">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                Designing beautiful products that help you build joyful, consistent habits
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                We believe that aesthetics are more than just a visual treat—they are drivers for behavioral change.
                Neuroscience shows that people are drawn to beautiful, functional designs that reprogram the mind and support new habits.
                Our products are expertly crafted to turn everyday routines into joyful rituals, helping you stay consistent with your wellness goals.
                Through our engaging, sensory products and experiences, we make wellness a seamless part of your life.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <img 
                src="/images/ethos/gummy_sparkling.webp" 
                alt="Gummy Cubes" 
                className="w-full h-auto rounded-xl shadow-lg" 
              />
            </div>
          </section>

          {/* Wisdom Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div>
              <img 
                src="/images/ethos/founders.webp" 
                alt="Founders Jane and Julie" 
                className="w-full h-auto rounded-xl shadow-lg" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                Proudly transforming 8,000 years of plant wisdom into small, bite-sized delights
              </h2>
              <div className="space-y-4 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                <p>
                  We were born out of our personal experiences of burnout and a return to our roots in Traditional Chinese Medicine to find natural and holistic ways to improve our wellbeing.
                  But finding and preparing the herbs isn't accessible for everyone—including ourselves.
                  We wanted to find a new way to get the superpowers of the herbs in a more compact and easy form, without compromising on the efficacy.
                </p>
                <p>
                  Today, we're proud to transform the strength of 8,000 years of ancient herbal wisdom into fun, tasty products that actually work.
                  Bringing the best of East and West, beauty and science all together in the form of delights.
                </p>
                <p className="italic font-medium">
                  — Jane & Julie
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
export default Ethos;