
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import Header from "@/components/Header";

type Product = Database['public']['Tables']['products']['Row'];

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(4);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section - Current Design */}
      <section className="relative bg-gradient-to-br from-[#F8F8F5] to-[#E8E8E0] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#192a3a] leading-tight">
                  Wellness
                  <br />
                  <span className="text-[#4a5c6a]">Redefined</span>
                </h1>
                <p className="text-xl text-[#6B5B4F] leading-relaxed max-w-lg">
                  Experience the power of nature with our premium herbal supplements, 
                  crafted for modern wellness seekers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/shop-all"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#192a3a] text-white font-semibold rounded-full hover:bg-[#243447] transition-colors text-lg"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/the-science"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#192a3a] text-[#192a3a] font-semibold rounded-full hover:bg-[#192a3a] hover:text-white transition-colors text-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#4a5c6a] to-[#192a3a] rounded-full opacity-20 absolute inset-0 transform rotate-12"></div>
              <img 
                src="/images/ethos/gummy_sparkling.webp" 
                alt="Premium Herbal Supplements"
                className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#192a3a] mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-[#4a5c6a] max-w-2xl mx-auto">
              Discover our most popular herbal supplements, carefully selected for their quality and effectiveness.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200">
                  <div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden shadow-sm">
                    <img 
                      src={product.image_url || "/placeholder.svg"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-[#192a3a] mb-2 text-lg">
                    {product.name}
                  </h3>
                  <p className="text-[#4a5c6a] text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#192a3a]">
                      ₹{product.price}
                    </span>
                    <Link 
                      to={`/product?id=${product.id}`}
                      className="bg-[#192a3a] text-white px-4 py-2 rounded-full text-sm hover:bg-[#243447] transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/shop-all"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#192a3a] text-white font-semibold rounded-full hover:bg-[#243447] transition-colors text-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#192a3a] mb-4">
              Why Choose NutriHerb?
            </h2>
            <p className="text-xl text-[#4a5c6a] max-w-2xl mx-auto">
              We're committed to providing the highest quality herbal supplements backed by science.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-[#192a3a] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#192a3a] mb-4">
                Premium Quality
              </h3>
              <p className="text-[#4a5c6a] leading-relaxed">
                All our products are third-party tested for purity and potency, ensuring you get the best quality supplements.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-[#192a3a] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l.828.828A2 2 0 0018 9.172V5l-1-1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#192a3a] mb-4">
                Science-Backed
              </h3>
              <p className="text-[#4a5c6a] leading-relaxed">
                Our formulations are based on extensive research and traditional wisdom, combining the best of both worlds.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-[#192a3a] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#192a3a] mb-4">
                Customer First
              </h3>
              <p className="text-[#4a5c6a] leading-relaxed">
                Your wellness journey is our priority. We offer personalized support and guidance every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#192a3a] to-[#4a5c6a]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Wellness?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the power of natural wellness with NutriHerb.
          </p>
          <Link 
            to="/shop-all"
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#192a3a] font-bold rounded-full hover:bg-gray-100 transition-colors text-lg"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
