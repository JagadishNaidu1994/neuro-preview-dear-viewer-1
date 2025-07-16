import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaMinus, FaPlus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ChevronDown, Package, Clock, Heart, ThumbsUp, ThumbsDown, MessageCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "@/components/ReviewCard";
import { useToast } from "@/hooks/use-toast";

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

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  admin_reply?: string;
  admin_reply_date?: string;
  users?: { email: string } | null;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

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
          .select(`
            *,
            users:user_id(email)
          `)
          .eq("product_id", id)
          .eq("is_approved", true)
          .eq("archived", false)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setReviews((data as any) || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const checkReviewEligibility = async () => {
      if (!user || !id) return;
      
      // Check if user has already reviewed this product
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .maybeSingle();
      
      if (existingReview) {
        setHasReviewed(true);
        setCanReview(false);
        return;
      }
      
      // Fixed purchase verification query
      const { data: deliveredOrders } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          order_items!inner(
            product_id
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "delivered")
        .eq("order_items.product_id", id);
      
      setCanReview(deliveredOrders && deliveredOrders.length > 0);
    };

    fetchProduct();
    if (user) {
      checkWishlist();
      checkReviewEligibility();
    }
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
    if (!user || !product || !canReview || hasReviewed) return;

    try {
      // Submit review
      const { error: reviewError } = await supabase.from("reviews").insert([
        {
          product_id: product.id,
          user_id: user.id,
          rating: review.rating,
          comment: review.comment,
        },
      ]);
      if (reviewError) throw reviewError;

      // Add 25 points to user rewards
      const { data: existingRewards } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingRewards) {
        // Update existing rewards
        const { error: updateError } = await supabase
          .from("user_rewards")
          .update({
            points_balance: existingRewards.points_balance + 25,
            total_earned: existingRewards.total_earned + 25,
          })
          .eq("user_id", user.id);
        if (updateError) throw updateError;
      } else {
        // Create new rewards entry
        const { error: insertError } = await supabase
          .from("user_rewards")
          .insert([
            {
              user_id: user.id,
              points_balance: 25,
              total_earned: 25,
              total_redeemed: 0,
            },
          ]);
        if (insertError) throw insertError;
      }

      setReview({ rating: 5, comment: "" });
      setHasReviewed(true);
      setCanReview(false);
      toast({
        title: "Success",
        description: "Review submitted for approval! You earned 25 points!",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive",
      });
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const renderStars = (rating: number, size = "text-sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={`text-yellow-400 ${size}`} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={`text-gray-300 ${size}`} />);
    }
    
    return stars;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffInMonths === 0) return "Recently";
    if (diffInMonths === 1) return "1 month ago";
    return `${diffInMonths} months ago`;
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
            The product you're looking for doesn't exist or has been removed.
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

  const productImages = [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop",
  ];

  const basePrice = servings === "30" ? 100 : 180;
  const subscriptionDiscount = purchaseType === "subscribe" ? 0.8 : 1;
  const finalPrice = basePrice * subscriptionDiscount;
  const pricePerServing = finalPrice / parseInt(servings);
  const averageRating = getAverageRating();

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
                {product.name} - Ceremonial Grade
              </h1>
              <p className="text-gray-600 mb-2">Energy, focus, beauty</p>
              <p className="text-sm text-gray-500 mb-4">The creamiest, ceremonial-grade Matcha with Lion's Mane, Tremella, and essential B vitamins.</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(averageRating)}
                </div>
                <span className="text-sm text-gray-600">{averageRating.toFixed(1)} • {reviews.length} Reviews</span>
                <span className="text-sm text-green-600 font-medium">✓ Verified</span>
              </div>

              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">⚡ Energy</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">🎯 Focus</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">✨ Skin</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-black flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {servings} servings
                </span>
                <span className="text-sm text-gray-600">£{pricePerServing.toFixed(2)} per serving</span>
              </div>
            </div>

            <div className="space-y-3">
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-xl transition-all hover:border-gray-300">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <div className="flex-1 flex justify-between items-center">
                    <label htmlFor="one-time" className="font-medium cursor-pointer">One-time Purchase</label>
                    <span className="font-bold text-lg">£{basePrice.toFixed(2)}</span>
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
                        <span className="font-bold text-lg">£{finalPrice.toFixed(2)}</span>
                        <p className="text-sm text-gray-600">£{pricePerServing.toFixed(2)} per serving</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Pouch only, free gifts NOT included</p>
                    
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Servings:</label>
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
                    ? `SUBSCRIBE - £${finalPrice.toFixed(2)}`
                    : `ADD TO CART - £${finalPrice.toFixed(2)}`
                  : "Out of Stock"}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="details" className="text-lg font-medium">Item Details</TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg font-medium">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Item Details Content */}
              <div className="space-y-4">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                    <span className="font-medium">Description</span>
                    <ChevronDown className="w-5 h-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                    <p className="text-gray-700">{product.description}</p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                    <span className="font-medium">Ingredients</span>
                    <ChevronDown className="w-5 h-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                    <p className="text-gray-700">Organic ceremonial-grade matcha, Lion's Mane mushroom extract, Tremella mushroom extract, Vitamin B12, Vitamin B6, Folate.</p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                    <span className="font-medium">How to Use</span>
                    <ChevronDown className="w-5 h-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                    <p className="text-gray-700">Mix 1 scoop with hot water or your favorite milk. Whisk until frothy. Best enjoyed in the morning for sustained energy throughout the day.</p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                    <span className="font-medium">Shipping & Returns</span>
                    <ChevronDown className="w-5 h-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                    <p className="text-gray-700">Free shipping on orders over £50. 30-day money-back guarantee. Ships within 1-2 business days.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              {/* Overall Rating */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                  <div>
                    <div className="flex mb-1">
                      {renderStars(averageRating, "text-lg")}
                    </div>
                    <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
                  </div>
                </div>
              </div>

              {/* Write Review Button */}
              {user && canReview && !hasReviewed && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReview({ ...review, rating: star })}
                            className="text-2xl"
                          >
                            {star <= review.rating ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <Textarea
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        placeholder="Share your experience with this product..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                      Submit Review (+25 Points)
                    </Button>
                  </form>
                </div>
              )}

              {!user && (
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-gray-600">Please log in to write a review</p>
                </div>
              )}

              {user && !canReview && !hasReviewed && (
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-gray-600">You can only review products you have purchased and received</p>
                </div>
              )}

              {hasReviewed && (
                <div className="border rounded-lg p-6 text-center bg-green-50">
                  <p className="text-green-700">Thank you! You have already reviewed this product</p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard 
                      key={review.id}
                      review={review}
                      userEmail={review.users?.email}
                      onReplySubmitted={() => {
                        // Re-fetch reviews after reply is submitted
                        const fetchReviews = async () => {
                          if (!id) return;
                          try {
                            const { data, error } = await supabase
                              .from("reviews")
                              .select(`
                                *,
                                users:user_id(email)
                              `)
                              .eq("product_id", id)
                              .eq("is_approved", true)
                              .eq("archived", false)
                              .order("created_at", { ascending: false });
                            if (error) throw error;
                            setReviews((data as any) || []);
                          } catch (error) {
                            console.error("Error fetching reviews:", error);
                          }
                        };
                        fetchReviews();
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-black text-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Stay in the loop</h3>
            <p className="text-gray-300 mb-6">Get the latest updates on new products and exclusive offers</p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white text-black border-0"
              />
              <Button className="bg-white text-black hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;