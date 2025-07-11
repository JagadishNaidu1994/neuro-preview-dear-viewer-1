
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaShoppingCart, FaMinus, FaPlus, FaStar, FaHeart, FaShare } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="min-h-screen bg-[#F8F6F3]">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F6F3]">
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

  const productImages = [product.image_url, product.image_url, product.image_url];

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-6">
              <div className="text-2xl font-light text-gray-900">
                ₹{product.price}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center border border-gray-200 rounded w-32">
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
                    className="w-16 text-center border-0 focus:ring-0 bg-transparent font-medium text-sm"
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

              {/* Add to Cart Button */}
              <div className="space-y-3">
                {product.stock_quantity > 0 ? (
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-sm font-medium"
                    disabled={quantity > product.stock_quantity}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <Button disabled className="w-full bg-gray-400 text-white py-3 text-sm font-medium">
                    Out of Stock
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-900 hover:bg-gray-50 py-3 text-sm font-medium"
                >
                  <FaHeart className="mr-2 text-sm" />
                  Add to Wishlist
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Details</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Premium quality ingredients</li>
                  <li>• Third-party tested for purity</li>
                  <li>• Made with natural, organic components</li>
                  <li>• Free shipping on orders over ₹500</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* You might also like section */}
        <div className="mt-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border-0 shadow-sm bg-white">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 rounded-t-lg mb-4">
                    <img 
                      src={product.image_url} 
                      alt={`Related product ${item}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Similar Product {item}</h3>
                    <p className="text-sm text-gray-600 mb-3">₹{(product.price * 0.8).toFixed(0)}</p>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">FAQ</h2>
            <div className="space-y-4">
              {[
                "How long does shipping take?",
                "What is your return policy?",
                "Are your products organic?",
                "Do you offer international shipping?"
              ].map((question, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button className="flex justify-between items-center w-full text-left">
                    <span className="font-medium text-gray-900">{question}</span>
                    <FaPlus className="text-gray-400 text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16">
          <div className="bg-[#4A5D3A] rounded-lg p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-light mb-2">Stay Updated.</h2>
              <p className="text-lg font-light mb-6">Stay Radiant</p>
              <div className="max-w-md mx-auto flex gap-2">
                <Input 
                  placeholder="Enter your email" 
                  ClassName="bg-white text-gray-900 border-0"
                />
                <Button className="bg-white text-gray-900 hover:bg-gray-100 px-6">
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="absolute right-4 bottom-4 opacity-50">
              <img 
                src={product.image_url} 
                alt="Newsletter" 
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
