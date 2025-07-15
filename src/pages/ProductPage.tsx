
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaMinus, FaPlus, FaStar, FaBrain, FaMemory, FaLightbulb } from "react-icons/fa";
import { ChevronDown, Package, Clock, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [servings, setServings] = useState("30");
  const [purchaseType, setPurchaseType] = useState("subscribe");
  const [subscriptionFrequency, setSubscriptionFrequency] = useState("4");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cartRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState<any[]>([]);

  const { user } = useAuth();
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
    
    const checkWishlist = async () => {
      if (!user || !id) return;
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", id);
      if (error) {
        console.error("Error checking wishlist:", error);
      } else if (data && data.length > 0) {
        setIsInWishlist(true);
      }
    };
    
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", id)
          .eq("is_approved", true);
        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProduct();
    checkWishlist();
    fetchReviews();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAnimating(true);
    await addToCart(product.id, quantity, purchaseType === "subscribe");
  };

  const handleToggleWishlist = async () => {
    if (!user || !product) return;
    if (isInWishlist) {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);
      if (error) {
        console.error("Error removing from wishlist:", error);
      } else {
        setIsInWishlist(false);
      }
    } else {
      const { error } = await supabase.from("wishlist_items").insert([
        {
          user_id: user.id,
          product_id: product.id,
        },
      ]);
      if (error) {
        console.error("Error adding to wishlist:", error);
      } else {
        setIsInWishlist(true);
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    try {
      const { error } = await supabase.from("reviews").insert([
        {
          product_id: product.id,
          user_id: user.id,
          rating: review.rating,
          comment: review.comment,
        },
      ]);
      if (error) throw error;
      setReview({ rating: 5, comment: "" });
      alert("Review submitted for approval!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold text-black mb-4">Product not found</h2>
          <p className="text-gray-600 mb-8">
            The brain supplement you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Brain supplement product images
  const productImages = [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=500&fit=crop",
  ];

  const basePrice = servings === "30" ? product.price : product.price * 1.8;
  const subscriptionDiscount = purchaseType === "subscribe" ? 0.8 : 1;
  const finalPrice = basePrice * subscriptionDiscount;
  const pricePerServing = finalPrice / parseInt(servings);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory-support':
        return <FaMemory className="w-5 h-5 text-blue-500" />;
      case 'cognitive-support':
        return <FaBrain className="w-5 h-5 text-purple-500" />;
      case 'focus':
        return <FaLightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return <FaBrain className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 md:px-6 lg:px-8 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-none">
          {/* Product Images */}
          <div className="space-y-4 relative">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <img
                ref={imageRef}
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/75"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist ? "text-red-500 fill-current" : "text-gray-500"
                }`}
              />
            </Button>

            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-black shadow-md"
                      : "border-gray-200 hover:border-gray-300"
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
            <div>
              <h1 className="text-3xl lg:text-4xl font-light text-black mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                {getCategoryIcon(product.category)}
                Cognitive enhancement, brain health, mental clarity
              </p>
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-sm" />)}
                </div>
                <span className="text-sm text-gray-600">4.8 • 2,847 Reviews</span>
                <span className="text-sm text-green-600 font-medium">✓ Clinically Tested</span>
              </div>

              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">🧠 Cognitive Support</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">🎯 Focus Enhancement</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">✨ Memory Boost</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-black flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {servings} capsules
                </span>
                <span className="text-sm text-gray-600">₹{pricePerServing.toFixed(2)} per capsule</span>
              </div>
            </div>

            <div className="space-y-3">
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-xl transition-all hover:border-gray-300">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <div className="flex-1 flex justify-between items-center">
                    <label htmlFor="one-time" className="font-medium cursor-pointer">One-time Purchase</label>
                    <span className="font-bold text-lg">₹{basePrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 border-blue-500 rounded-xl bg-blue-50">
                  <RadioGroupItem value="subscribe" id="subscribe" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <label htmlFor="subscribe" className="font-medium cursor-pointer">Subscribe & Save</label>
                        <span className="bg-black text-white px-2 py-1 rounded-full text-xs font-bold">20% OFF</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">₹{finalPrice.toFixed(2)}</span>
                        <p className="text-sm text-gray-600">₹{pricePerServing.toFixed(2)} per capsule</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Regular delivery, cancel anytime</p>
                    
                    {purchaseType === "subscribe" && (
                      <div className="mt-3">
                        <Select value={subscriptionFrequency} onValueChange={setSubscriptionFrequency}>
                          <SelectTrigger className="w-full rounded-xl">
                            <Clock className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4">Every 4 weeks (Most Popular)</SelectItem>
                            <SelectItem value="6">Every 6 weeks</SelectItem>
                            <SelectItem value="8">Every 8 weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Bottle Size:</label>
                <Select value={servings} onValueChange={setServings}>
                  <SelectTrigger className="rounded-xl">
                    <Package className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 capsules (1 month)</SelectItem>
                    <SelectItem value="60">60 capsules (2 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <Button size="sm" variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 rounded-none border-0 h-full">
                    <FaMinus className="w-3 h-3" />
                  </Button>
                  <Input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center border-0 focus:ring-0 bg-transparent h-full" min="1" max={product.stock_quantity} />
                  <Button size="sm" variant="ghost" onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="px-3 py-2 hover:bg-gray-100 rounded-none border-0 h-full">
                    <FaPlus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAddToCart}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 px-8 rounded-xl font-medium text-base"
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity > 0
                  ? purchaseType === "subscribe"
                    ? `SUBSCRIBE - ₹${finalPrice.toFixed(2)}`
                    : `ADD TO CART - ₹${finalPrice.toFixed(2)}`
                  : "Out of Stock"}
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Skip or cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>30-day money back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>20% off every subscription</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Clinically tested ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Free shipping over ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Third-party tested purity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="w-full mt-16 space-y-4">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-black border-b border-gray-200 pb-4">
              Key Benefits
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-gray-600 leading-relaxed">
              This premium cognitive supplement is scientifically formulated to support brain health and mental performance. 
              Key benefits include enhanced memory formation, improved focus and concentration, increased mental clarity, 
              and support for overall cognitive function. Each ingredient is carefully selected for its neuroprotective properties.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-black border-b border-gray-200 pb-4">
              Ingredients & Dosage
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-gray-600 leading-relaxed">
              Premium brain-supporting ingredients including Lion's Mane mushroom extract, Bacopa Monnieri, 
              Ginkgo Biloba, Phosphatidylserine, and essential B-vitamins. Take 1-2 capsules daily with food 
              or as directed by your healthcare professional. Each capsule contains standardized extracts 
              for optimal potency and bioavailability.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-black border-b border-gray-200 pb-4">
              How to Use
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-gray-600 leading-relaxed">
              Take 1-2 capsules daily with a meal for optimal absorption. For best results, take consistently 
              at the same time each day. Effects may be noticed within 2-4 weeks of regular use. 
              Consult with your healthcare provider before starting any new supplement regimen.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-black border-b border-gray-200 pb-4">
              Shipping & Returns
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-gray-600 leading-relaxed">
              Free shipping on orders over ₹999. Standard delivery takes 3-5 business days. 
              We offer a 30-day money-back guarantee for unopened products. All supplements are 
              third-party tested for purity and potency.
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-light text-black mb-8 text-center">
            Customer Reviews
          </h2>
          <div className="space-y-8 max-w-xl mx-auto">
            {reviews.map((r) => (
              <div key={r.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`
                          ${i < r.rating ? "text-yellow-400" : "text-gray-300"}
                        `}
                      />
                    ))}
                  </div>
                  <span className="ml-4 text-sm text-gray-600">
                    Verified Purchase
                  </span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>}
          </div>
        </div>

        {/* Review Form */}
        {user && (
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl font-light text-black mb-8 text-center">
              Write a Review
            </h2>
            <form onSubmit={handleReviewSubmit} className="max-w-xl mx-auto">
              <div className="flex items-center mb-4">
                <span className="mr-4">Your Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`cursor-pointer ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setReview({ ...review, rating: i + 1 })}
                    />
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Share your experience with this brain supplement..."
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                rows={5}
                className="mb-4"
              />
              <Button type="submit">Submit Review</Button>
            </form>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-light text-black mb-8 text-center">Related Brain Supplements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop" alt="Memory Booster" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-medium text-black">Memory Booster Complex</h3>
                <p className="text-gray-600 text-sm">₹1,299.00</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop" alt="Focus Formula" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-medium text-black">Focus Formula</h3>
                <p className="text-gray-600 text-sm">₹1,599.00</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop" alt="Brain Shield" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-medium text-black">Brain Shield Antioxidant</h3>
                <p className="text-gray-600 text-sm">₹1,799.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-light mb-2">Optimize Your Mind.</h2>
            <p className="text-gray-300 mb-6">Get brain health tips and exclusive offers</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1 bg-white text-black border-0 focus:ring-2 focus:ring-white/20 rounded-xl" />
              <Button className="bg-white text-black hover:bg-gray-100 px-8 rounded-xl">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="absolute right-8 bottom-8 opacity-20">
            <FaBrain className="w-24 h-24 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
