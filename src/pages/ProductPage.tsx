
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FaMinus, FaPlus } from "react-icons/fa";

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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold text-black mb-4">Product not found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-black hover:bg-gray-800 text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Use images from the Kanva template reference
  const productImages = [
    "https://framerusercontent.com/images/fUKUaOKmvyEBOIWwcofYAHoV80.png",
    "https://framerusercontent.com/images/fUKUaOKmvyEBOIWwcofYAHoV80.png",
    "https://framerusercontent.com/images/fUKUaOKmvyEBOIWwcofYAHoV80.png"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-black' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-light text-black mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-black text-sm">★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8)</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-light text-black">
              ₹{product.price}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-black">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 rounded-none border-0"
                  >
                    <FaMinus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:ring-0 bg-transparent"
                    min="1"
                    max={product.stock_quantity}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 rounded-none border-0"
                  >
                    <FaPlus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 px-8 rounded font-medium text-sm"
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Product Information Accordion */}
            <div className="space-y-4 pt-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-gray-200">
                  <AccordionTrigger className="text-left font-medium text-black hover:no-underline">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    This premium product is crafted with the finest ingredients to deliver exceptional results. 
                    Our carefully formulated blend ensures maximum effectiveness while being gentle on your skin.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ingredients" className="border-gray-200">
                  <AccordionTrigger className="text-left font-medium text-black hover:no-underline">
                    Ingredients
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Natural clay, purified water, organic botanical extracts, essential oils, and carefully selected 
                    active ingredients that work synergistically to provide optimal benefits.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="usage" className="border-gray-200">
                  <AccordionTrigger className="text-left font-medium text-black hover:no-underline">
                    How to Use
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Apply a generous amount to clean, damp skin. Gently massage in circular motions for 1-2 minutes. 
                    Leave on for 10-15 minutes, then rinse thoroughly with warm water. Use 2-3 times per week for best results.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping" className="border-gray-200">
                  <AccordionTrigger className="text-left font-medium text-black hover:no-underline">
                    Shipping & Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Free shipping on orders over ₹500. Standard delivery takes 3-5 business days. 
                    We offer a 30-day return policy for unopened products in original packaging.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* You Might Like Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-light text-black mb-8 text-center">You might like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src="https://framerusercontent.com/images/fUKUaOKmvyEBOIWwcofYAHoV80.png" 
                  alt="Clay Clean" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div>
                <h3 className="font-medium text-black">Clay Clean</h3>
                <p className="text-gray-600 text-sm">₹29.99</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src="https://framerusercontent.com/images/fUKUaOKmvyEBOIWwcofYAHoV80.png" 
                  alt="Deep Clean" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div>
                <h3 className="font-medium text-black">Deep Clean</h3>
                <p className="text-gray-600 text-sm">₹39.99</p>
              </div>
            </div>

            {/* Product 3 */}
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src="https://framerusercontent.com/images/fUKUaOKmvyEBOIWwcofYAHoV80.png" 
                  alt="Gentle Clean" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div>
                <h3 className="font-medium text-black">Gentle Clean</h3>
                <p className="text-gray-600 text-sm">₹24.99</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-light mb-2">Stay Updated.</h2>
            <p className="text-gray-300 mb-6">Stay Radiant</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your mail"
                className="flex-1 bg-white text-black border-0 focus:ring-2 focus:ring-white/20"
              />
              <Button className="bg-white text-black hover:bg-gray-100 px-8">
                Submit
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute right-8 bottom-8 opacity-20">
            <img 
              src="https://framerusercontent.com/images/fUKUaOKmvyEBOIWwcofYAHoV80.png" 
              alt="Decorative" 
              className="w-24 h-24 object-contain" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
