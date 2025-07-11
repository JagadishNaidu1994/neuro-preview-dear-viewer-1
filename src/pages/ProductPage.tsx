
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaShoppingCart, FaMinus, FaPlus, FaStar, FaHeart, FaShare } from "react-icons/fa";

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
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  // Clay Clean product images
  const clayCleanImages = [
    "https://framerusercontent.com/images/fV8lW9sAhvGZQPONgL8CJcdRGz8.jpg",
    "https://framerusercontent.com/images/HkUbIZBVv1q7iGBQB8Nc4ILZDc.jpg",
    "https://framerusercontent.com/images/fV8lW9sAhvGZQPONgL8CJcdRGz8.jpg",
    "https://framerusercontent.com/images/HkUbIZBVv1q7iGBQB8Nc4ILZDc.jpg"
  ];

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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-gray-900 hover:bg-gray-800">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={clayCleanImages[selectedImage]} 
                alt="Clay Clean"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {clayCleanImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-gray-900' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Clay Clean ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Clay Clean
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">(4.8) • 124 reviews</span>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Experience the power of nature with our premium Clay Clean formula. 
                Designed to purify and rejuvenate your skin with natural ingredients 
                that deliver exceptional results.
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                <span className="text-xl text-gray-500 line-through">₹{(product.price * 1.2).toFixed(0)}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  17% OFF
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Key Benefits:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></span>
                  Deep cleansing with natural clay minerals
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></span>
                  Removes impurities and excess oil
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></span>
                  Suitable for all skin types
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></span>
                  Cruelty-free and sustainably sourced
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 rounded-none border-r"
                  >
                    <FaMinus className="text-xs" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:ring-0 bg-transparent font-semibold"
                    min="1"
                    max={product.stock_quantity}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 rounded-none border-l"
                  >
                    <FaPlus className="text-xs" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {product.stock_quantity > 0 ? (
                  <>
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg text-base font-semibold"
                      disabled={quantity > product.stock_quantity}
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart - ₹{(product.price * quantity).toFixed(2)}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400"
                    >
                      <FaHeart className="mr-2" />
                      Wishlist
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400"
                    >
                      <FaShare />
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled
                    className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg text-base font-semibold"
                  >
                    Out of Stock
                  </Button>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping & Returns</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Free delivery on orders above ₹500</p>
                <p>• Standard delivery: 3-5 business days</p>
                <p>• Express delivery: 1-2 business days (₹99)</p>
                <p>• Easy returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* You might also like section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={clayCleanImages[item % clayCleanImages.length]}
                    alt={`Related product ${item}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Clay Clean Variant {item}</h3>
                <p className="text-gray-600 text-sm mb-2">Premium skincare formula</p>
                <p className="font-bold text-gray-900">₹{(product.price + item * 100).toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
