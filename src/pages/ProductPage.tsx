import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaMinus, FaPlus, FaStar } from "react-icons/fa";
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
  const [purchaseType, setPurchaseType] = useState("subscribe"); // Default to subscription
  const [subscriptionFrequency, setSubscriptionFrequency] = useState("4");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cartRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState<any[]>([]);
  const [canReview, setCanReview] = useState(false);

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
          .select("*, users(email)")
          .eq("product_id", id)
          .eq("is_approved", true);
        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const checkCanReview = async () => {
      if (!user || !id) return;
      try {
        // Check if user has a delivered order for this product
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "delivered");
        if (ordersError) throw ordersError;

        if (orders.length > 0) {
          const orderIds = orders.map((o) => o.id);
          const { data: orderItems, error: itemsError } = await supabase
            .from("order_items")
            .select("product_id")
            .in("order_id", orderIds)
            .eq("product_id", id);
          if (itemsError) throw itemsError;

          if (orderItems.length > 0) {
            // Check if user has already reviewed this product
            const { data: existingReview, error: reviewError } = await supabase
              .from("reviews")
              .select("id")
              .eq("user_id", user.id)
              .eq("product_id", id)
              .single();
            if (reviewError && reviewError.code !== 'PGRST116') throw reviewError;

            if (!existingReview) {
              setCanReview(true);
            }
          }
        }
      } catch (error) {
        console.error("Error checking if user can review:", error);
      }
    };

    fetchProduct();
    checkWishlist();
    fetchReviews();
    checkCanReview();
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

      // Add 25 reward points
      const { data: currentRewards, error: rewardsError } = await supabase
        .from("user_rewards")
        .select("points_balance")
        .eq("user_id", user.id)
        .single();

      if (rewardsError && rewardsError.code !== 'PGRST116') throw rewardsError;

      const newBalance = (currentRewards?.points_balance || 0) + 25;

      const { error: updateRewardsError } = await supabase
        .from("user_rewards")
        .upsert({ user_id: user.id, points_balance: newBalance }, { onConflict: 'user_id' });

      if (updateRewardsError) throw updateRewardsError;

      setReview({ rating: 5, comment: "" });
      alert("Thanks for your valuable review! We will soon publish this. As a token of appreciation, we have added 25 points to your rewards section for your efforts.");
      setCanReview(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-white">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-700"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-white">
        {/* <Header /> */}
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold text-brand-blue-700 mb-4">Product not found</h2>
          <p className="text-brand-gray-500 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Sample nutrition supplement bottle images
  const productImages = [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop",
  ];

  // Calculate prices based on servings and purchase type
  const basePrice = servings === "30" ? 100 : 180;
  const subscriptionDiscount = purchaseType === "subscribe" ? 0.8 : 1; // 20% off
  const finalPrice = basePrice * subscriptionDiscount;
  const pricePerServing = finalPrice / parseInt(servings);

  return (
    <div className="min-h-screen bg-brand-white">
      <div className="w-full px-4 md:px-6 lg:px-8 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-none">
          {/* Product Images */}
          <div className="space-y-4 relative">
            {/* Main Image */}
            <div className="aspect-square bg-brand-gray-100 rounded-2xl overflow-hidden">
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
              className="absolute top-4 right-4 bg-brand-white/50 backdrop-blur-sm rounded-full hover:bg-brand-white/75"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist ? "text-red-500 fill-current" : "text-brand-gray-500"
                }`}
              />
            </Button>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-brand-blue-700 shadow-md"
                      : "border-brand-gray-200 hover:border-brand-gray-300"
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
              <h1 className="text-3xl lg:text-4xl font-light text-brand-blue-700 mb-2">
                {product.name}
              </h1>
              <p className="text-brand-gray-500 mb-2">{product.description}</p>
              <p className="text-sm text-brand-gray-500 mb-4">
                {
                  product.benefits?.join(', ')
                }
              </p>
              
              {/* Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-sm" />)}
                </div>
                <span className="text-sm text-brand-gray-500">4.9 • 20,564 Reviews</span>
                <span className="text-sm text-green-600 font-medium">✓ Verified</span>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">⚡ Energy</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">🎯 Focus</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">✨ Skin</span>
              </div>
            </div>

            {/* Servings Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-brand-blue-700 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {servings} servings
                </span>
                <span className="text-sm text-brand-gray-500">£{pricePerServing.toFixed(2)} per serving</span>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-3">
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="space-y-3">
                {/* One-time Purchase */}
                <div className="flex items-center space-x-3 p-4 border rounded-xl transition-all hover:border-brand-gray-300">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <div className="flex-1 flex justify-between items-center">
                    <label htmlFor="one-time" className="font-medium cursor-pointer">One-time Purchase</label>
                    <span className="font-bold text-lg">£{basePrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Subscribe & Save */}
                <div className="flex items-center space-x-3 p-4 border-2 border-blue-500 rounded-xl bg-blue-100">
                  <RadioGroupItem value="subscribe" id="subscribe" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <label htmlFor="subscribe" className="font-medium cursor-pointer">Subscribe & Save</label>
                        <span className="bg-brand-blue-700 text-brand-white px-2 py-1 rounded-full text-xs font-bold">20% OFF</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">£{finalPrice.toFixed(2)}</span>
                        <p className="text-sm text-brand-gray-500">£{pricePerServing.toFixed(2)} per serving</p>
                      </div>
                    </div>
                    <p className="text-xs text-brand-gray-500">Pouch only, free gifts NOT included</p>
                    
                    {purchaseType === "subscribe" && <div className="mt-3">
                        <Select value={subscriptionFrequency} onValueChange={setSubscriptionFrequency}>
                          <SelectTrigger className="w-full rounded-xl">
                            <Clock className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4">Every 4 weeks (Bestseller)</SelectItem>
                            <SelectItem value="6">Every 6 weeks</SelectItem>
                            <SelectItem value="8">Every 8 weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>}
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Servings & Quantity - More Compact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-blue-700 mb-2">Servings:</label>
                <Select value={servings} onValueChange={setServings}>
                  <SelectTrigger className="rounded-xl">
                    <Package className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 servings</SelectItem>
                    <SelectItem value="60">60 servings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-blue-700 mb-2">Quantity:</label>
                <div className="flex items-center border border-brand-gray-300 rounded-xl overflow-hidden">
                  <Button size="sm" variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-brand-gray-100 rounded-none border-0 h-full">
                    <FaMinus className="w-3 h-3" />
                  </Button>
                  <Input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center border-0 focus:ring-0 bg-transparent h-full" min="1" max={product.stock_quantity} />
                  <Button size="sm" variant="ghost" onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="px-3 py-2 hover:bg-brand-gray-100 rounded-none border-0 h-full">
                    <FaPlus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAddToCart}
                className="w-full"
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity > 0
                  ? purchaseType === "subscribe"
                    ? `SUBSCRIBE - £${finalPrice.toFixed(2)}`
                    : `ADD TO CART - £${finalPrice.toFixed(2)}`
                  : "Out of Stock"}
              </Button>
            </motion.div>

            {/* Benefits - More Compact Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Skip or cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>30-day money back</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>20% off every subscription</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Award-winning quality</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Free shipping over £50</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Fast delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information with Collapsible */}
        <div className="w-full mt-16 space-y-4">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-brand-blue-700 border-b border-brand-gray-200 pb-4">
              Description
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-brand-gray-500 leading-relaxed">
              This premium product is crafted with the finest ingredients to deliver exceptional results. 
              Our carefully formulated blend ensures maximum effectiveness while being gentle on your skin.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-brand-blue-700 border-b border-brand-gray-200 pb-4">
              Ingredients
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-brand-gray-500 leading-relaxed">
              Natural clay, purified water, organic botanical extracts, essential oils, and carefully selected 
              active ingredients that work synergistically to provide optimal benefits.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-brand-blue-700 border-b border-brand-gray-200 pb-4">
              How to Use
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-brand-gray-500 leading-relaxed">
              Apply a generous amount to clean, damp skin. Gently massage in circular motions for 1-2 minutes. 
              Leave on for 10-15 minutes, then rinse thoroughly with warm water. Use 2-3 times per week for best results.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-brand-blue-700 border-b border-brand-gray-200 pb-4">
              Shipping & Returns
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 text-brand-gray-500 leading-relaxed">
              Free shipping on orders over £50. Standard delivery takes 3-5 business days. 
              We offer a 30-day return policy for unopened products in original packaging.
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Existing Reviews */}
        <div className="mt-16 pt-16 border-t border-brand-gray-200">
          <h2 className="text-2xl font-light text-brand-blue-700 mb-8 text-center">
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
                          ${i < r.rating ? "text-yellow-400" : "text-brand-gray-300"}
                        `}
                      />
                    ))}
                  </div>
                  <span className="ml-4 text-sm text-brand-gray-500">
                    by {r.users.email}
                  </span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-brand-gray-500">No reviews yet.</p>}
          </div>
        </div>

        {/* Review Submission Form */}
        {user && canReview && (
          <div className="mt-16 pt-16 border-t border-brand-gray-200">
            <h2 className="text-2xl font-light text-brand-blue-700 mb-8 text-center">
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
                        i < review.rating ? "text-yellow-400" : "text-brand-gray-300"
                      }`}
                      onClick={() => setReview({ ...review, rating: i + 1 })}
                    />
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Write your review here..."
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

        {/* You Might Like Section */}
        <div className="mt-16 pt-16 border-t border-brand-gray-200">
          <h2 className="text-2xl font-light text-brand-blue-700 mb-8 text-center">You might like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="aspect-square bg-brand-gray-100 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop" alt="Clay Clean" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-medium text-brand-blue-700">Clay Clean</h3>
                <p className="text-brand-gray-500 text-sm">₹29.99</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="aspect-square bg-brand-gray-100 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop" alt="Deep Clean" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-medium text-brand-blue-700">Deep Clean</h3>
                <p className="text-brand-gray-500 text-sm">₹39.99</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="aspect-square bg-brand-gray-100 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop" alt="Gentle Clean" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-medium text-brand-blue-700">Gentle Clean</h3>
                <p className="text-brand-gray-500 text-sm">₹24.99</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-brand-blue-700 rounded-2xl p-8 md:p-12 text-center text-brand-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-light mb-2">Stay Updated.</h2>
            <p className="text-brand-gray-300 mb-6">Stay Radiant</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your mail" className="flex-1 bg-brand-white text-brand-blue-700 border-0 focus:ring-2 focus:ring-brand-white/20 rounded-xl" />
              <Button className="bg-brand-white text-brand-blue-700 hover:bg-brand-gray-100 px-8 rounded-xl">
                Submit
              </Button>
            </div>
          </div>
          <div className="absolute right-8 bottom-8 opacity-20">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop" alt="Decorative" className="w-24 h-24 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;