import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartProvider";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";

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

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .eq("is_active", true)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="text-center py-24 text-xl text-gray-500">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="text-center py-24 text-2xl text-gray-500">
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-2xl shadow-lg object-cover"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl text-[#1E1E1E] font-semibold mb-4">
              {product.name}
            </h1>
            <p className="text-lg md:text-xl text-[#231F20] mb-6">
              {product.description}
            </p>
          </div>
          
          <div className="text-3xl text-[#161616] font-bold">
            ${product.price}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <FaMinus />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center"
                  min="1"
                  max={product.stock_quantity}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                >
                  <FaPlus />
                </Button>
              </div>
            </div>

            {product.stock_quantity > 0 ? (
              <div className="space-y-2">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-[#514B3D] text-white rounded-2xl text-sm hover:bg-[#3f3a2f] transition-all py-3"
                  disabled={quantity > product.stock_quantity}
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
                {product.stock_quantity <= 10 && (
                  <p className="text-sm text-orange-600">
                    Only {product.stock_quantity} left in stock!
                  </p>
                )}
              </div>
            ) : (
              <Button
                disabled
                className="w-full bg-gray-400 text-white rounded-2xl text-sm py-3"
              >
                Out of Stock
              </Button>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Category: {product.category}</li>
              <li>Free shipping on orders over $50</li>
              <li>30-day money-back guarantee</li>
              <li>Made with premium, natural ingredients</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;