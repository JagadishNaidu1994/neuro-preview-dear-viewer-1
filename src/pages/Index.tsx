
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(25, 42, 58, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      <div className="relative z-10">
        <Header />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#192a3a' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                NOURISH
                <br />
                YOUR MIND
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-lg">
                Unlock the potential of your mind with our premium mushroom supplements. 
                Experience enhanced focus, mental clarity, and cognitive performance.
              </p>
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-white text-[#192a3a] hover:bg-gray-100"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=500&fit=crop"
                  alt="Focus Supplement"
                  className="rounded-2xl shadow-2xl max-w-sm w-full"
                />
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="text-center">
                    <h3 className="font-bold text-[#192a3a] text-lg">FOCUS</h3>
                    <p className="text-sm text-gray-600 mt-1">Premium Supplement</p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">✓ Enhanced Mental Clarity</span>
                      <br />
                      <span className="text-xs text-gray-500">✓ Improved Focus</span>
                      <br />
                      <span className="text-xs text-gray-500">✓ Natural Ingredients</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Two Column Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="bg-gray-200 p-12 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=400&fit=crop"
                alt="Two people collaborating"
                className="rounded-2xl shadow-lg w-full max-w-md"
              />
            </div>
            <div className="bg-white p-12 flex items-center">
              <div>
                <h2 className="text-4xl font-bold text-[#192a3a] mb-6">
                  Next generation cognitive wellness for your best mind & mood, where neuroscience meets nature
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our scientifically formulated supplements combine the power of premium mushrooms 
                  with cutting-edge research to deliver unparalleled cognitive enhancement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-200/30"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-[#192a3a] mb-4">Pure & Natural</h3>
                  <p className="text-gray-700 mb-6">
                    Experience the power of nature with our carefully selected, 
                    premium mushroom extracts.
                  </p>
                  <Button className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 text-center">
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop"
                  alt="Matcha Product"
                  className="mx-auto rounded-2xl shadow-lg mb-6"
                />
                <h3 className="text-2xl font-bold text-[#192a3a] mb-2">MATCHA</h3>
                <p className="text-gray-600">Premium organic matcha for sustained energy</p>
              </div>
            </div>

            {/* Bottom Product Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-[#192a3a] rounded-3xl p-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#192a3a] to-black/20"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4">SLEEP</h3>
                  <p className="text-white/80 mb-6">
                    Premium sleep support for restorative rest and recovery
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <span className="text-xs">FOCUS</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <span className="text-xs">CALM</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <span className="text-xs">FLUSH</span>
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=250&fit=crop"
                    alt="Sleep supplements"
                    className="mx-auto rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#192a3a] mb-4">
                    Connecting you to a network of cognitive care, directly to your doorstep, with no restrictions
                  </h3>
                  <Button className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                    Shop Now
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl p-8 text-center">
                <img
                  src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=200&h=150&fit=crop"
                  alt="Hand with supplement"
                  className="mx-auto rounded-lg mb-6"
                />
                <h3 className="text-xl font-bold text-[#192a3a] mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm">
                  Third-party tested for purity and potency
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-16 px-4 bg-[#192a3a] text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              Tap into your best state of mind with us.
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands who have transformed their cognitive wellness journey
            </p>
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold bg-white text-[#192a3a] hover:bg-gray-100"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Footer with Logos */}
        <section className="py-8 px-4 bg-white border-t">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
              <span>VOGUE</span>
              <span>ELLE</span>
              <span>Wallpaper*</span>
              <span>HUNGER</span>
              <span>BAZAAR</span>
              <span>VANITY FAIR</span>
              <span>marie claire</span>
              <span>VOGUE</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
