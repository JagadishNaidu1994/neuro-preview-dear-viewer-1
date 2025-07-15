import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FaShoppingCart, FaBrain, FaMemory, FaLightbulb } from "react-icons/fa";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
}

export default function ShopAll() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleAddToCart = async (productId: string) => {
    const quantity = quantities[productId] || 1;
    await addToCart(productId, quantity);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory-support':
        return <FaMemory className="w-4 h-4 text-blue-500" />;
      case 'cognitive-support':
        return <FaBrain className="w-4 h-4 text-purple-500" />;
      case 'focus':
        return <FaLightbulb className="w-4 h-4 text-yellow-500" />;
      case 'nootropics':
        return <FaBrain className="w-4 h-4 text-green-500" />;
      default:
        return <FaBrain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'memory-support':
        return 'bg-blue-100 text-blue-800';
      case 'cognitive-support':
        return 'bg-purple-100 text-purple-800';
      case 'focus':
        return 'bg-yellow-100 text-yellow-800';
      case 'nootropics':
        return 'bg-green-100 text-green-800';
      case 'brain-health':
        return 'bg-indigo-100 text-indigo-800';
      case 'neuroprotection':
        return 'bg-red-100 text-red-800';
      case 'stress-support':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-white">
        <Header />
        <div className="w-full px-4 md:px-8 py-8 text-center">
          <div className="text-xl text-brand-blue-700">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <main className="w-full px-4 bg-white py-px md:px-[14px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center py-12 mb-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              <FaBrain className="inline-block mr-3 text-purple-600" />
              Brain & Cognitive Support
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock your mind's potential with our premium collection of scientifically-backed cognitive supplements
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <div 
                key={product.id} 
                className={`group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 border ${
                  !product.is_active || product.stock_quantity === 0 
                    ? 'opacity-75 bg-gray-50' 
                    : ''
                }`}
              >
                <Link to={`/product?id=${product.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {(!product.is_active || product.stock_quantity === 0) && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(product.category)}`}>
                        {getCategoryIcon(product.category)}
                        {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product?id=${product.id}`}>
                    <h3 className="text-brand-blue-700 font-medium mb-2 hover:text-brand-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-brand-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-brand-blue-700">
                      ₹{product.price}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={product.stock_quantity}
                        value={quantities[product.id] || 1}
                        onChange={e =>
                          handleQuantityChange(product.id, parseInt(e.target.value))
                        }
                        className="w-16 h-8 text-center"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={!product.is_active || product.stock_quantity === 0}
                      >
                        <FaShoppingCart className="mr-2" />
                        {!product.is_active || product.stock_quantity === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">Save 20% on subscriptions</p>
                  {product.is_active && product.stock_quantity > 0 && product.stock_quantity <= 10 && (
                    <p className="text-xs text-orange-600 mt-2">
                      Only {product.stock_quantity} left in stock!
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4 text-brand-blue-700">No products available</h2>
              <p className="text-brand-gray-500">Check back soon for new products!</p>
            </div>
          )}

          {/* Benefits Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Why Choose Our Brain Supplements?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBrain className="text-blue-600 text-2xl" />
                </div>
                <h3 className="font-semibold mb-2">Scientifically Proven</h3>
                <p className="text-gray-600 text-sm">
                  Research-backed ingredients for optimal cognitive function
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMemory className="text-purple-600 text-2xl" />
                </div>
                <h3 className="font-semibold mb-2">Memory Enhancement</h3>
                <p className="text-gray-600 text-sm">
                  Support memory formation and recall with premium nootropics
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLightbulb className="text-green-600 text-2xl" />
                </div>
                <h3 className="font-semibold mb-2">Focus & Clarity</h3>
                <p className="text-gray-600 text-sm">
                  Enhance mental clarity and sustained focus throughout the day
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
