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
import { FaMinus, FaPlus, FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare } from "react-icons/fa";
import { ChevronDown, Package, Clock, Heart, ThumbsUp, ThumbsDown, MessageCircle, CheckCircle, Star, Shield, Truck, RotateCcw } from "lucide-react";
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
        console.log("Fetching reviews for product ID:", id);
        
        // Use separate queries for better reliability
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", id)
          .eq("is_approved", true)
          .eq("archived", false)
          .order("created_at", { ascending: false });
          
        if (reviewsError) {
          console.error("Reviews fetch error:", reviewsError);
          throw reviewsError;
        }
        
        console.log("Reviews found:", reviewsData?.length || 0);
        
        if (reviewsData && reviewsData.length > 0) {
          // Fetch user details separately
          const userIds = [...new Set(reviewsData.map(r => r.user_id).filter(Boolean))];
          const { data: users } = await supabase
            .from("users")
            .select("id, email")
            .in("id", userIds);
            
          const userMap = new Map(users?.map(u => [u.id, u.email]) || []);
          
          // Combine data
          const reviewsWithUsers = reviewsData.map(review => ({
            ...review,
            users: review.user_id ? { email: userMap.get(review.user_id) || "Anonymous" } : null
          }));
          
          setReviews(reviewsWithUsers);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
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
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images - Left Side */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-lg">
                <img
                  ref={imageRef}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist ? "text-red-500 fill-current" : "text-gray-600"
                    }`}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg"
                >
                  <FaShare className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 justify-center">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
                    selectedImage === index
                      ? "border-black shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-400 hover:scale-102"
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

          {/* Product Details - Right Side */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span>DearNeuro</span>
                <span>•</span>
                <span>Premium Collection</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-light text-black leading-tight">
                {product.name}
              </h1>
              
              <p className="text-xl text-gray-600 font-light">
                Ceremonial Grade • Energy, Focus, Beauty
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                The creamiest, ceremonial-grade Matcha with Lion's Mane, Tremella, and essential B vitamins for sustained energy and cognitive enhancement.
              </p>
              
              {/* Rating and Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(averageRating, "text-lg")}
                  </div>
                  <span className="text-lg font-medium text-gray-900">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{reviews.length} Reviews</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              </div>

              {/* Benefits Tags */}
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center gap-2">
                  ⚡ Energy Boost
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                  🧠 Mental Focus
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-2">
                  ✨ Skin Health
                </span>
              </div>
            </div>

            {/* Pricing and Servings Info */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-lg font-medium text-black">{servings} servings</span>
                </div>
                <span className="text-lg text-gray-600">£{pricePerServing.toFixed(2)} per serving</span>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Lab Tested</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4" />
                  <span>30-Day Return</span>
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Choose Your Plan</h3>
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="space-y-4">
                {/* One-time Purchase */}
                <div className="relative">
                  <div className="flex items-center space-x-4 p-6 border-2 rounded-2xl transition-all hover:border-gray-300 cursor-pointer">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <label htmlFor="one-time" className="text-lg font-medium cursor-pointer">One-time Purchase</label>
                        <p className="text-sm text-gray-500">No commitment, cancel anytime</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-black">£{basePrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription */}
                <div className="relative">
                  <div className="flex items-center space-x-4 p-6 border-2 border-blue-500 rounded-2xl bg-blue-50/50">
                    <RadioGroupItem value="subscribe" id="subscribe" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <label htmlFor="subscribe" className="text-lg font-medium cursor-pointer">Subscribe & Save</label>
                          <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">20% OFF</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-black">£{finalPrice.toFixed(2)}</span>
                          <p className="text-sm text-gray-600">£{pricePerServing.toFixed(2)} per serving</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Delivered automatically, modify or cancel anytime</p>
                      
                      {purchaseType === "subscribe" && (
                        <div className="mt-4">
                          <Select value={subscriptionFrequency} onValueChange={setSubscriptionFrequency}>
                            <SelectTrigger className="w-full rounded-xl bg-white">
                              <Clock className="w-4 h-4 mr-2" />
                              <SelectValue placeholder="Select delivery frequency" />
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
                </div>
              </RadioGroup>
            </div>

            {/* Product Options */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Servings</label>
                <Select value={servings} onValueChange={setServings}>
                  <SelectTrigger className="rounded-xl h-12">
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
                <label className="block text-sm font-semibold text-black mb-3">Quantity</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden h-12">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="px-4 py-3 hover:bg-gray-100 rounded-none border-0 h-full"
                  >
                    <FaMinus className="w-3 h-3" />
                  </Button>
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                    className="w-16 text-center border-0 focus:ring-0 bg-transparent h-full text-lg font-medium" 
                    min="1" 
                    max={product.stock_quantity} 
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} 
                    className="px-4 py-3 hover:bg-gray-100 rounded-none border-0 h-full"
                  >
                    <FaPlus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.div whileTap={{ scale: 0.98 }} className="pt-4">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-black hover:bg-gray-800 text-white py-6 px-8 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={product.stock_quantity === 0}
              >
                <FaShoppingCart className="w-5 h-5" />
                {product.stock_quantity > 0
                  ? purchaseType === "subscribe"
                    ? `Subscribe Now - £${finalPrice.toFixed(2)}`
                    : `Add to Cart - £${finalPrice.toFixed(2)}`
                  : "Out of Stock"}
              </Button>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Product Information Tabs */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12 bg-white rounded-2xl p-2 shadow-sm">
              <TabsTrigger value="details" className="text-lg font-semibold py-4 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white">
                Product Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg font-semibold py-4 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-8">
              {/* Product Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-lg font-semibold text-black">Description</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 p-6 bg-white rounded-2xl shadow-sm">
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-lg font-semibold text-black">Ingredients</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 p-6 bg-white rounded-2xl shadow-sm">
                      <div className="space-y-3">
                        <p className="text-gray-700 leading-relaxed">
                          Premium organic ceremonial-grade matcha powder, Lion's Mane mushroom extract (Hericium erinaceus), 
                          Tremella mushroom extract (Tremella fuciformis), Vitamin B12 (Methylcobalamin), 
                          Vitamin B6 (Pyridoxal-5-Phosphate), Folate (5-MTHF).
                        </p>
                        <div className="bg-amber-50 p-4 rounded-xl">
                          <p className="text-sm text-amber-800">
                            <strong>Note:</strong> All ingredients are third-party tested for purity and potency.
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div className="space-y-6">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-lg font-semibold text-black">How to Use</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 p-6 bg-white rounded-2xl shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                          <p className="text-gray-700">Mix 1 scoop (1 tsp) with 2-4 oz of hot water (160-175°F)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                          <p className="text-gray-700">Whisk vigorously until frothy and well combined</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                          <p className="text-gray-700">Enjoy immediately, preferably in the morning for sustained energy</p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-lg font-semibold text-black">Shipping & Returns</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 p-6 bg-white rounded-2xl shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">Free shipping on orders over £50</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <RotateCcw className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">30-day money-back guarantee</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-700">Ships within 1-2 business days</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-8">
              {/* Overall Rating Summary */}
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-black mb-2">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center mb-2">
                      {renderStars(averageRating, "text-xl")}
                    </div>
                    <p className="text-gray-600">Based on {reviews.length} reviews</p>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Write Review Section */}
              {user && canReview && !hasReviewed && (
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-2xl font-semibold mb-6 text-black">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-black">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReview({ ...review, rating: star })}
                            className="text-3xl hover:scale-110 transition-transform"
                          >
                            {star <= review.rating ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-gray-300 hover:text-yellow-200" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-black">Your Review</label>
                      <Textarea
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        placeholder="Share your experience with this product..."
                        className="min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-black"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold">
                      Submit Review (+25 Reward Points)
                    </Button>
                  </form>
                </div>
              )}

              {!user && (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Please log in to write a review</p>
                </div>
              )}

              {user && !canReview && !hasReviewed && (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">You can only review products you have purchased and received</p>
                </div>
              )}

              {hasReviewed && (
                <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-200">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-green-700 text-lg font-medium">Thank you! You have already reviewed this product</p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
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
                  <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                    <p className="text-gray-500">Be the first to review this product and help others make informed decisions!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl lg:text-4xl font-light text-white mb-4">Stay in the loop</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive offers, and wellness tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white text-black border-0 rounded-xl h-12 px-4 flex-1"
            />
            <Button className="bg-white text-black hover:bg-gray-100 rounded-xl px-8 h-12 font-semibold">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No spam, unsubscribe at any time
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
