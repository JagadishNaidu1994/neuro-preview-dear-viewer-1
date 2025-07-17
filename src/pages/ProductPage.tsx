import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

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

        if (reviewsData && reviewsData.length > 0) {
          const userIds = [...new Set(reviewsData.map(r => r.user_id).filter(Boolean))];
          const { data: users } = await supabase
            .from("users")
            .select("id, email")
            .in("id", userIds);

          const userMap = new Map(users?.map(u => [u.id, u.email]) || []);

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

      const { data: deliveredOrders } = await supabase
        .from("orders")
        .select(
          `
          id,
          status,
          order_items!inner(
            product_id
          )
        `
        )
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
      const { error: reviewError } = await supabase.from("reviews").insert([
        {
          product_id: product.id,
          user_id: user.id,
          rating: review.rating,
          comment: review.comment,
        },
      ]);
      if (reviewError) throw reviewError;

      const { data: existingRewards } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingRewards) {
        const { error: updateError } = await supabase
          .from("user_rewards")
          .update({
            points_balance: existingRewards.points_balance + 25,
            total_earned: existingRewards.total_earned + 25,
          })
          .eq("user_id", user.id);
        if (updateError) throw updateError;
      } else {
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
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  };

  const renderStars = (rating: number, size = "text-sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className={`text-yellow-400 ${size}`} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className={`text-gray-300 ${size}`} />
      );
    }

    return stars;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMonths = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

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
          <h2 className="text-3xl font-bold text-black mb-4">
            Product not found
          </h2>
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
    product.image_url,
    "https://framerusercontent.com/images/7PrGzN5G7FNOl4aIONdYwfdZEjI.jpg",
    "https://framerusercontent.com/images/fC1GN0dWOebGJtoNP7yCPwHf654.png",
    "https://framerusercontent.com/images/7PrGzN5G7FNOl4aIONdYwfdZEjI.jpg",
  ];

  const basePrice = servings === "30" ? 100 : 180;
  const subscriptionDiscount = purchaseType === "subscribe" ? 0.8 : 1;
  const finalPrice = basePrice * subscriptionDiscount;
  const averageRating = getAverageRating();

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images - Left Side */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
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
          <div className="space-y-6">
            {/* Header Text */}
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              MADE FROM 100% NATURAL INGREDIENTS
            </div>

            {/* Product Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-black">
              {product.name}
            </h1>

            {/* Product Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                25 mg CBD
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                FULL SPEC
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                ONE TIME
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                GLUTEN FREE
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-black">
              ${finalPrice.toFixed(0)}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {product.description || "Crafted for optimal focus. Contains ashwagandha and bacopa to help you tackle work with calm, focused energy. Clinically-tested ingredients at effective dosages. L-theanine provides a layer of L-chill energy...plus L.A. lifestyle."}
            </p>

            {/* Additional Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <div>✓ THC-FREE INCLUDES CAFFEINE & L-THEANINE · FORMULATED BY NEUROSCIENTISTS, AND TESTED FOR PURITY</div>
              <div>✓ ETHANOL-EXTRACTED CBG, PROVIDES MILD JOLT-FREE ENERGY BOOSTS, AND TASTES DELICIOUS</div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-black">Quantity</div>
              <div className="flex gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2"
                  >
                    <FaMinus className="w-3 h-3" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2"
                  >
                    <FaPlus className="w-3 h-3" />
                  </Button>
                </div>

                <Select value={servings} onValueChange={setServings}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Bottle - 30</SelectItem>
                    <SelectItem value="60">Bottle - 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subscribe and Save */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="subscribe"
                  checked={purchaseType === "subscribe"}
                  onChange={(e) => setPurchaseType(e.target.checked ? "subscribe" : "one-time")}
                  className="rounded border-gray-300"
                />
                <label htmlFor="subscribe" className="text-sm font-medium text-green-800">
                  Subscribe and save 30%
                </label>
              </div>
              {purchaseType === "subscribe" && (
                <div className="text-xs text-green-700">
                  Delivery every {subscriptionFrequency} weeks
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4" />
              <span>Delivery and Returns</span>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <Button
                ref={cartRef}
                onClick={handleAddToCart}
                className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-medium rounded-lg"
                disabled={isAnimating}
              >
                {isAnimating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding to Bag...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaShoppingCart />
                    Add to Bag
                  </div>
                )}
              </Button>

              <div className="text-right text-lg font-medium">
                ${(finalPrice * quantity).toFixed(2)}
              </div>
            </div>

            {/* Wishlist Button */}
            <Button
              variant="outline"
              onClick={handleToggleWishlist}
              className="w-full border-gray-300 hover:bg-gray-50"
              disabled={!user}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${
                  isInWishlist ? "text-red-500 fill-current" : "text-gray-600"
                }`}
              />
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      {/* Lower Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Statistics Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              93% Experienced increased focus and productivity within<br />
              the first 45 minutes of taking 2 gummies*
            </h2>
            <p className="text-gray-600">
              *Based on independent 30-day user study of 29 people
            </p>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-black mb-2">Fast acting without the crash</h3>
              <p className="text-sm text-gray-600">
                Fast acting, lasting up to 45 minutes, lasting up to 4 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-black mb-2">Clinically studied ingredients for cognitive performance</h3>
              <p className="text-sm text-gray-600">Clinical research</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-black mb-2">Next-level gummies with fast and sustained release</h3>
              <p className="text-sm text-gray-600">Sustained release</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-black mb-2">Balanced energy without jitters or crash</h3>
              <p className="text-sm text-gray-600">Balanced energy without jitters or crash</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-black mb-2">Natural flavors and colors, zero added sugar</h3>
              <p className="text-sm text-gray-600">Natural flavors and colors, zero added sugar</p>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <p className="text-gray-700 mb-4">
                  Our premium focus gummies are crafted with clinically-studied ingredients to help enhance cognitive performance
                  and provide sustained energy without the crash.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Fast-acting formula with effects felt within 45 minutes</li>
                  <li>Sustained release for up to 4 hours of focus</li>
                  <li>Natural flavors and colors with zero added sugar</li>
                  <li>Clinically-tested ingredients at effective dosages</li>
                  <li>No artificial preservatives or fillers</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-2">Active Ingredients</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• CBD (25mg per serving)</li>
                      <li>• L-Theanine (100mg)</li>
                      <li>• Caffeine (50mg)</li>
                      <li>• Ashwagandha Extract (300mg)</li>
                      <li>• Bacopa Monnieri (250mg)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Other Ingredients</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Organic Cane Sugar</li>
                      <li>• Organic Tapioca Syrup</li>
                      <li>• Natural Flavors</li>
                      <li>• Pectin</li>
                      <li>• Citric Acid</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-8">
                {/* Review Form */}
                {canReview && !hasReviewed && user && (
                  <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <div className="space-y-4">
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
                          rows={4}
                        />
                      </div>
                      <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                        Submit Review
                      </Button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                      <p className="text-gray-500">Be the first to review this product and help others make informed decisions!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                    <span className="font-medium text-left">How do NOON FOCUS gummy delights work?</span>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-l border-r border-b rounded-b-lg bg-white">
                    <p className="text-gray-700">
                      Our FOCUS gummies contain a carefully crafted blend of CBD, L-theanine, caffeine, and adaptogenic herbs
                      that work synergistically to enhance cognitive function, promote focus, and provide sustained energy.
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                    <span className="font-medium text-left">How do NOON gummy delights provide energy without added caffeine?</span>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-l border-r border-b rounded-b-lg bg-white">
                    <p className="text-gray-700">
                      While our FOCUS gummies do contain natural caffeine (50mg per serving), our formulation includes L-theanine
                      which helps promote calm alertness and reduces jitters often associated with caffeine consumption.
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                    <span className="font-medium text-left">How quickly will I start feeling the benefits? How long do they last?</span>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-l border-r border-b rounded-b-lg bg-white">
                    <p className="text-gray-700">
                      Most users report feeling effects within 45 minutes of consumption. The benefits typically last 4-6 hours,
                      providing sustained focus and energy throughout your day.
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                    <span className="font-medium text-left">Can I take them daily? How many can I have?</span>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-l border-r border-b rounded-b-lg bg-white">
                    <p className="text-gray-700">
                      Yes, our gummies are designed for daily use. We recommend starting with 1-2 gummies per day and adjusting
                      based on your individual needs. Do not exceed 4 gummies in a 24-hour period.
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                    <span className="font-medium text-left">Can I take them with other supplements?</span>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border-l border-r border-b rounded-b-lg bg-white">
                    <p className="text-gray-700">
                      While our gummies are made with natural ingredients, we recommend consulting with your healthcare provider
                      before combining with other supplements, especially if you're taking medication or have any health conditions.
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Goes well with</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-32 h-32 bg-green-100 rounded-lg mx-auto mb-4"></div>
                <h4 className="font-semibold text-lg mb-2">CHILL</h4>
                <p className="text-gray-600 text-sm mb-4">Magnesium & Botanical For Easier Rest</p>
                <Button variant="outline" className="w-full">View Product</Button>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-32 h-32 bg-blue-100 rounded-lg mx-auto mb-4"></div>
                <h4 className="font-semibold text-lg mb-2">SLEEP</h4>
                <p className="text-gray-600 text-sm mb-4">Melatonin For Deep Sleep And Recovery</p>
                <Button variant="outline" className="w-full">View Product</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;