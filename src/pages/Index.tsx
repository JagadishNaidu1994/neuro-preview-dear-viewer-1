
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
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{ color: '#192a3a' }}>
                Enhance Your
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mind
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Premium mushroom gummies designed to boost focus, reduce stress, 
                and enhance cognitive performance naturally.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-[#192a3a] hover:bg-[#0f1a26] text-white"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg font-semibold border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
                <Zap className="w-12 h-12 text-[#192a3a] mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#192a3a' }}>Enhanced Focus</h3>
                <p className="text-gray-600">
                  Boost your cognitive performance with our scientifically formulated mushroom blends.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
                <Shield className="w-12 h-12 text-[#192a3a] mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#192a3a' }}>Natural & Safe</h3>
                <p className="text-gray-600">
                  All-natural ingredients with no artificial additives or harmful chemicals.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
                <Sparkles className="w-12 h-12 text-[#192a3a] mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#192a3a' }}>Premium Quality</h3>
                <p className="text-gray-600">
                  Third-party tested for purity and potency. Only the finest ingredients.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#192a3a' }}>
                Our Products
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our range of premium mushroom gummies, each crafted to support different aspects of your wellness journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Focus Gummies",
                  description: "Enhance concentration and mental clarity",
                  price: "$32.00",
                  image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop"
                },
                {
                  name: "Chill Gummies",
                  description: "Reduce stress and promote relaxation",
                  price: "$32.00",
                  image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"
                },
                {
                  name: "Energy Gummies",
                  description: "Natural energy boost without the crash",
                  price: "$28.00",
                  image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop"
                }
              ].map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#192a3a' }}>
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: '#192a3a' }}>
                        {product.price}
                      </span>
                      <Button className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4" style={{ backgroundColor: '#192a3a' }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Enhance Your Mind?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of satisfied customers who have transformed their cognitive wellness.
              </p>
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-white text-[#192a3a] hover:bg-gray-100"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
