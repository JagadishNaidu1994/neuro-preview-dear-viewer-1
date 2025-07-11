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
  const {
    addToCart
  } = useCart();
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const {
          data,
          error
        } = await supabase.from("products").select("*").eq("id", id).eq("is_active", true).single();
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
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#192a3a]"></div>
        </div>
      </div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold text-[#192a3a] mb-4">Product not found</h2>
          <p className="text-slate-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-[#192a3a] hover:bg-[#243447]">
            Go Back
          </Button>
        </div>
      </div>;
  }
  const productImages = [product.image_url, product.image_url,
  // Placeholder for additional images
  product.image_url, product.image_url];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <img src={productImages[selectedImage]} alt={product.name} className="w-full h-full hover:scale-105 transition-transform duration-500 object-contain" />
            </div>
            
            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-[#192a3a] shadow-lg scale-105' : 'border-slate-300 hover:border-slate-400'}`}>
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>)}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-[#192a3a]/10 text-[#192a3a] rounded-full text-sm font-medium">
                  {product.category}
                </span>
                {product.stock_quantity <= 10 && product.stock_quantity > 0 && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    Only {product.stock_quantity} left!
                  </span>}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-[#192a3a] mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-lg" />)}
                </div>
                <span className="text-slate-600">(4.8) • 124 reviews</span>
              </div>
              
              <p className="text-lg text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-[#192a3a]/5 to-blue-50 rounded-2xl p-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-[#192a3a]">₹{product.price}</span>
                <span className="text-xl text-slate-500 line-through">₹{(product.price * 1.2).toFixed(0)}</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  17% OFF
                </span>
              </div>
              <p className="text-slate-600 mt-2">Inclusive of all taxes • Free shipping on orders over ₹500</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <label className="text-lg font-semibold text-[#192a3a]">Quantity:</label>
                <div className="flex items-center bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
                  <Button size="sm" variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-slate-100 rounded-none">
                    <FaMinus />
                  </Button>
                  <Input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center border-0 focus:ring-0 bg-transparent font-semibold" min="1" max={product.stock_quantity} />
                  <Button size="sm" variant="ghost" onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="px-4 py-3 hover:bg-slate-100 rounded-none">
                    <FaPlus />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {product.stock_quantity > 0 ? <>
                    <Button onClick={handleAddToCart} className="flex-1 bg-[#192a3a] hover:bg-[#243447] text-white py-4 px-8 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl" disabled={quantity > product.stock_quantity}>
                      <FaShoppingCart className="mr-3" />
                      Add to Cart - ₹{(product.price * quantity).toFixed(2)}
                    </Button>
                    
                    <Button variant="outline" className="px-6 py-4 rounded-2xl border-2 border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white transition-all duration-300">
                      <FaHeart className="mr-2" />
                      Wishlist
                    </Button>
                    
                    <Button variant="outline" className="px-6 py-4 rounded-2xl border-2 border-slate-300 text-slate-600 hover:bg-slate-100 transition-all duration-300">
                      <FaShare />
                    </Button>
                  </> : <Button disabled className="flex-1 bg-slate-400 text-white py-4 px-8 rounded-2xl text-lg font-semibold">
                    Out of Stock
                  </Button>}
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-[#192a3a] mb-4 text-lg">Product Highlights</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#192a3a] rounded-full mt-2 flex-shrink-0"></span>
                  Premium quality, third-party tested for purity
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#192a3a] rounded-full mt-2 flex-shrink-0"></span>
                  Made with natural, organic ingredients
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#192a3a] rounded-full mt-2 flex-shrink-0"></span>
                  Free shipping on orders over ₹500
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#192a3a] rounded-full mt-2 flex-shrink-0"></span>
                  30-day money-back guarantee
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#192a3a] rounded-full mt-2 flex-shrink-0"></span>
                  Sustainably sourced and environmentally friendly
                </li>
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-bold text-emerald-800 mb-3">Shipping & Returns</h3>
              <div className="space-y-2 text-emerald-700">
                <p>• Free delivery on orders above ₹500</p>
                <p>• Standard delivery: 3-5 business days</p>
                <p>• Express delivery: 1-2 business days (₹99)</p>
                <p>• Easy returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-3xl font-bold text-[#192a3a] mb-8">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(review => <div key={review} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#192a3a] to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      U{review}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#192a3a]">User {review}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-sm" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700">
                    "Excellent product! I've been using it for a month and can see significant improvements. 
                    Highly recommend to anyone looking for quality supplements."
                  </p>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ProductPage;