// src/pages/ShopAll.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FaShoppingCart } from "react-icons/fa";
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
  const {
    addToCart
  } = useCart();
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("products").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  const handleAddToCart = async (productId: string) => {
    const quantity = quantities[productId] || 1;
    await addToCart(productId, quantity);
    // You could add a toast notification here
  };
  if (loading) {
    return <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="w-full px-4 md:px-8 py-8 text-center">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-[#F8F8F5]">
           <main className="w-full px-4 bg-white py-px md:px-[14px]">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Shop All Products</h1>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => <div key={product.id} className={`group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 border ${!product.is_active || product.stock_quantity === 0 ? 'opacity-75 bg-gray-50' : ''}`}>
                <Link to={`/product?id=${product.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {(!product.is_active || product.stock_quantity === 0) && <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product?id=${product.id}`}>
                    <h3 className="text-gray-900 font-medium mb-2 hover:text-[#514B3D] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">
                      ${product.price}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" min="1" max={product.stock_quantity} value={quantities[product.id] || 1} onChange={e => handleQuantityChange(product.id, parseInt(e.target.value))} className="w-16 h-8 text-center" />
                      <Button size="sm" onClick={() => handleAddToCart(product.id)} disabled={!product.is_active || product.stock_quantity === 0} className="text-white bg-gray-950 hover:bg-gray-800 text-base font-medium">
                        <FaShoppingCart className="mr-2" />
                        {!product.is_active || product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">Save 20% on subscriptions</p>
                  {product.is_active && product.stock_quantity > 0 && product.stock_quantity <= 10 && <p className="text-xs text-orange-600 mt-2">
                      Only {product.stock_quantity} left in stock!
                    </p>}
                </div>
              </div>)}
          </div>

          {products.length === 0 && <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">No products available</h2>
              <p className="text-gray-600">Check back soon for new products!</p>
            </div>}
        </div>
      </main>
    </div>;
}