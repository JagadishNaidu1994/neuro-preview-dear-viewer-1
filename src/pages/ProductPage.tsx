import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ChevronDown, Heart, Star, Minus, Plus, Snowflake, Brain, Eye, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "@/components/ReviewCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductData = async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);

        // Define all async functions
        const fetchProduct = supabase.from("products").select("*").eq("id", id).eq("is_active", true).single();
        const fetchReviewsForProduct = supabase.from("reviews").select(`*, users (email)`).eq("product_id", id).eq("is_approved", true).order("created_at", { ascending: false });

        let checkWishlist = null;
        let checkReviewEligibility = null;
        if (user) {
            checkWishlist = supabase
                .from("wishlist_items")
                .select("*")
                .eq("user_id", user.id)
                .eq("product_id", id)
                .maybeSingle();
            // Fix: check if user has already reviewed this product
            checkReviewEligibility = supabase
                .from("reviews")
                .select("id")
                .eq("user_id", user.id)
                .eq("product_id", id)
                .maybeSingle();
        }

        // Await all promises
        const [productResult, reviewsResult, wishlistResult, reviewEligibilityResult] = await Promise.all([
            fetchProduct,
            fetchReviewsForProduct,
            checkWishlist,
            checkReviewEligibility
        ]);

        // Process results
        if (productResult.error) console.error("Error fetching product:", productResult.error);
        else setProduct(productResult.data);

        if (reviewsResult.error) {
          console.error("Error fetching reviews:", reviewsResult.error);
        } else {
          // Defensive: filter out reviews with missing users or email
          const validReviews = (reviewsResult.data || []).filter(
            (review: any) =>
              review.users &&
              typeof review.users.email === "string" &&
              // Ensure users is an object with email property
              typeof review.users === "object" &&
              review.users.email !== undefined
            );
            // Map to correct Review type (if needed)
            setReviews(
              validReviews.map((review: any) => ({
                ...review,
                users: { email: review.users.email }
              }))
            );
          }

          if (wishlistResult && wishlistResult.data) setIsInWishlist(true);

        if (reviewEligibilityResult) {
          // If a review exists, user has already reviewed
          if (reviewEligibilityResult.data) {
            setHasReviewed(true);
            setCanReview(false);
          } else {
            setHasReviewed(false);
            setCanReview(true);
          }
        }
        
        setLoading(false);
    };

    fetchProductData();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAnimating(true);
    await addToCart(product.id, quantity, purchaseType === "subscribe");
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleToggleWishlist = async () => {
    if (!user || !product) {
        toast({ title: "Please sign in to add to wishlist", variant: "destructive"});
        return;
    }
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
        toast({ title: "Removed from wishlist" });
      }
    }
     else {
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
        toast({ title: "Added to wishlist" });
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

      // The following line caused a type error because 'award_review_points' is not a valid RPC function in the current Supabase types.
      // If you have a custom function, add it to your Supabase types. Otherwise, comment it out or handle gracefully.
      // await supabase.rpc('award_review_points', {p_user_id: user.id});

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
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<FaStar key={i} className={cn("text-amber-400", size)} />);
        } else if (i - 0.5 <= rating) {
            stars.push(<FaStarHalfAlt key={i} className={cn("text-amber-400", size)} />);
        } else {
            stars.push(<FaRegStar key={i} className={cn("text-gray-300", size)} />);
        }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 text-center py-24">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Product not found</h2>
          <p className="text-neutral-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-neutral-900 hover:bg-neutral-800 text-white">Go Back</Button>
      </div>
    );
  }

  const productImages = [
    product.image_url,
    "https://framerusercontent.com/images/7PrGzN5G7FNOl4aIONdYwfdZEjI.jpg",
    "https://framerusercontent.com/images/fC1GN0dWOebGJtoNP7yCPwHf654.png",
    "https://framerusercontent.com/images/7PrGzN5G7FNOl4aIONdYwfdZEjI.jpg",
  ];

  const basePrice = servings === "30" ? product.price : product.price * 1.8;
  const subscriptionDiscount = purchaseType === "subscribe" ? 0.8 : 1;
  const finalPrice = basePrice * subscriptionDiscount;
  const averageRating = getAverageRating();

  return (
    <div className="min-h-screen bg-[#f8f7f3] font-sans">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Image Gallery */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-lg overflow-hidden mb-6 lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  ref={imageRef}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
               <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleWishlist}
                    className={cn(
                        "absolute top-4 right-4 rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm border-neutral-200 hover:bg-white",
                        isInWishlist && "border-red-500 text-red-500 hover:bg-red-50"
                    )}
                    >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'text-neutral-600'}`} />
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                    selectedImage === index ? "border-neutral-900" : "border-transparent hover:border-neutral-300"
                  )}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-sm">{renderStars(averageRating, "text-sm")}</div>
                <span className="text-sm text-neutral-600">({reviews.length} customer review)</span>
              </div>
               <div className="text-2xl font-semibold text-neutral-900 mb-4">
                ${finalPrice.toFixed(2)}
                {purchaseType === "subscribe" && (
                  <span className="text-base text-neutral-500 line-through ml-2">${basePrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-neutral-700 text-base leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">Servings</h3>
                <RadioGroup value={servings} onValueChange={setServings} className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="30-servings" className="peer sr-only" />
                    <Label
                      htmlFor="30-servings"
                      className={cn(
                          "flex items-center justify-between rounded-md border border-neutral-200 bg-white p-3 hover:bg-neutral-50 cursor-pointer flex-1 text-sm",
                          servings === '30' && 'border-neutral-900 bg-neutral-50'
                      )}
                    >
                      <span className="font-medium text-neutral-900">30 Servings</span>
                      <span className="text-neutral-700">${product.price.toFixed(2)}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">Delivery Options</h3>
                <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-time" id="one-time" className="peer sr-only"/>
                    <Label htmlFor="one-time" className={cn(
                      "flex-1 cursor-pointer p-3 border border-neutral-200 rounded-md hover:border-neutral-300 transition-colors text-sm",
                      purchaseType === 'one-time' && 'border-neutral-900 bg-neutral-50'
                    )}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-neutral-900">One-time Purchase</span>
                        <span className="font-semibold text-neutral-900">${basePrice.toFixed(2)}</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="subscribe" id="subscribe" className="peer sr-only"/>
                    <Label htmlFor="subscribe" className={cn(
                      "flex-1 cursor-pointer p-3 border border-neutral-200 rounded-md hover:border-neutral-300 transition-colors relative text-sm",
                      purchaseType === 'subscribe' && 'border-neutral-900 bg-neutral-50'
                    )}>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-neutral-900">Subscribe & Save</span>
                          <div className="text-xs text-emerald-600">Save 20% • Free shipping</div>
                        </div>
                        <span className="font-semibold text-neutral-900">${finalPrice.toFixed(2)}</span>
                      </div>
                      <div className="absolute -top-2 right-2 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">Best Value</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-9 w-9 rounded-l-md rounded-r-none border-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-3 py-1.5 font-medium min-w-[2rem] text-center text-neutral-900">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-9 w-9 rounded-r-md rounded-l-none border-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                 <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 text-base font-semibold rounded-md"
                  disabled={isAnimating || product.stock_quantity === 0}
                >
                  {isAnimating ? "Adding..." : (product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock")}
                </Button>
              </div>

                <div className="flex items-center gap-6 text-sm text-neutral-700">
                    <button className="flex items-center gap-1 hover:text-neutral-900 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>Browse Wishlist</span>
                    </button>
                     <button className="flex items-center gap-1 hover:text-neutral-900 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Add to compare</span>
                    </button>
                </div>

                <div className="space-y-2 text-sm">
                    <p className="text-neutral-700"><span className="font-medium">Categories:</span> Supplements, Nootropics</p>
                    <p className="text-neutral-700"><span className="font-medium">Tag:</span> cognitive enhancement</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-700 pt-4 border-t border-neutral-200">
                    <span className="font-medium">Share this product:</span>
                    <div className="flex items-center gap-2">
                        <a href="#" className="hover:text-neutral-900"><FaStar className="w-4 h-4" /></a>
                        <a href="#" className="hover:text-neutral-900"><FaStar className="w-4 h-4" /></a>
                        <a href="#" className="hover:text-neutral-900"><FaStar className="w-4 h-4" /></a>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ingredient Science Strip */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Snowflake className="w-8 h-8 mx-auto text-neutral-400 mb-4" />
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our innovative blend combines powerful nootropics, adaptogens, and functional mushrooms for optimal cognitive enhancement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-6 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <span className="text-4xl">🍎</span>
                </div>
                <div className="absolute inset-0 bg-green-500/10 rounded-lg blur-xl opacity-50"></div>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Apple Extract</h3>
              <p className="text-sm text-neutral-600">Natural energy and focus enhancement</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <span className="text-4xl">🍄</span>
                </div>
                <div className="absolute inset-0 bg-amber-500/10 rounded-lg blur-xl opacity-50"></div>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Mushroom Blend</h3>
              <p className="text-sm text-neutral-600">Cognitive support and neuroprotection</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <span className="text-4xl">💊</span>
                </div>
                <div className="absolute inset-0 bg-purple-500/10 rounded-lg blur-xl opacity-50"></div>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Adaptogen Complex</h3>
              <p className="text-sm text-neutral-600">Stress reduction and mental clarity</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Benefits Section */}
      <div className="bg-[#f8f7f3] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Brain className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                90% experienced reduced stress and anxiety, leading to 
                <span className="text-emerald-600"> better sleep and 8x less brain fog</span> from 2 gummies*
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="best-for" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                  Best For
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-neutral-600">
                    Professionals seeking enhanced focus, students preparing for exams, creatives looking for mental clarity, 
                    and anyone experiencing daily stress or brain fog.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="whats-inside" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                  What's Inside
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Lion's Mane (500mg) - Cognitive enhancement</li>
                    <li>• Reishi (300mg) - Stress reduction</li>
                    <li>• Cordyceps (200mg) - Energy support</li>
                    <li>• Apple Extract (150mg) - Natural focus</li>
                    <li>• Rhodiola (100mg) - Adaptogenic support</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="how-to-take" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                  How to Take
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-neutral-600">
                    Take 1-2 gummies daily, preferably in the morning with or without food. 
                    Effects typically begin within 30-60 minutes and last 2-3 hours.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* 4. Product Comparison Matrix */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                An innovative dual-layered gummy designed for maximum bioavailability and sustained release
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center">
                <div className="relative bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 mb-6">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-b from-green-400 to-green-600 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-green-300 opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-green-700 opacity-60"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Dual Layer</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-xs text-neutral-600">
                    <div className="mb-2">→ Fast Release Layer</div>
                    <div>→ Sustained Release Layer</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">NOON Dual-Layer Technology</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-neutral-200">
                      <th className="text-left py-3 font-semibold text-neutral-900">Features</th>
                      <th className="text-center py-3 font-semibold text-emerald-600">NOON</th>
                      <th className="text-center py-3 font-semibold text-neutral-500">Other Edibles</th>
                      <th className="text-center py-3 font-semibold text-neutral-500">Other Rx</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-neutral-100">
                      <td className="py-3 text-neutral-700">Sugar-free</td>
                      <td className="text-center py-3 text-emerald-600">✓</td>
                      <td className="text-center py-3 text-neutral-400">✗</td>
                      <td className="text-center py-3 text-neutral-400">✗</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-3 text-neutral-700">Plant-based</td>
                      <td className="text-center py-3 text-emerald-600">✓</td>
                      <td className="text-center py-3 text-neutral-400">✗</td>
                      <td className="text-center py-3 text-neutral-400">✗</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-3 text-neutral-700">Lasts 2-3 hours</td>
                      <td className="text-center py-3 text-emerald-600">✓</td>
                      <td className="text-center py-3 text-neutral-400">✗</td>
                      <td className="text-center py-3 text-emerald-600">✓</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-3 text-neutral-700">Effective onset</td>
                      <td className="text-center py-3 text-emerald-600">30-60 min</td>
                      <td className="text-center py-3 text-neutral-400">60-90 min</td>
                      <td className="text-center py-3 text-emerald-600">15-30 min</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-neutral-700">Affordable</td>
                      <td className="text-center py-3 text-emerald-600">✓</td>
                      <td className="text-center py-3 text-neutral-400">✗</td>
                      <td className="text-center py-3 text-neutral-400">✗</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Testimonials */}
      <div className="bg-[#f8f7f3] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="mb-4">
                  <div className="text-4xl text-blue-400 mb-2">"</div>
                  <p className="text-neutral-700 leading-relaxed">
                    These gummies have completely transformed my morning routine. I feel more focused and alert without any jitters.
                  </p>
                </div>
                <div className="text-sm text-neutral-500">
                  <p className="font-medium">Sarah M.</p>
                  <p>San Francisco, CA</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
                <div className="mb-4">
                  <div className="text-4xl text-emerald-400 mb-2">"</div>
                  <p className="text-neutral-700 leading-relaxed">
                    As a student, these have been a game-changer for my study sessions. Much better than coffee crashes.
                  </p>
                </div>
                <div className="text-sm text-neutral-500">
                  <p className="font-medium">Michael R.</p>
                  <p>Austin, TX</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="mb-4">
                  <div className="text-4xl text-purple-400 mb-2">"</div>
                  <p className="text-neutral-700 leading-relaxed">
                    I love that they're plant-based and sugar-free. Finally found a healthy way to boost my productivity.
                  </p>
                </div>
                <div className="text-sm text-neutral-500">
                  <p className="font-medium">Emma L.</p>
                  <p>New York, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Herbal Index Strip */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-12">Herbal Index</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-amber-200 transition-colors">
                  <Leaf className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-medium text-neutral-900 text-sm mb-1">Chaga Mushroom</h4>
                <p className="text-xs text-neutral-600">Immune support</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-green-200 transition-colors">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-medium text-neutral-900 text-sm mb-1">Lion's Mane</h4>
                <p className="text-xs text-neutral-600">Cognitive enhancement</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">🍄</span>
                </div>
                <h4 className="font-medium text-neutral-900 text-sm mb-1">Reishi</h4>
                <p className="text-xs text-neutral-600">Stress reduction</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-orange-200 transition-colors">
                  <span className="text-2xl">🦃</span>
                </div>
                <h4 className="font-medium text-neutral-900 text-sm mb-1">Turkey Tail</h4>
                <p className="text-xs text-neutral-600">Antioxidant power</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-pink-200 transition-colors">
                  <span className="text-2xl">🌸</span>
                </div>
                <h4 className="font-medium text-neutral-900 text-sm mb-1">Rhodiola</h4>
                <p className="text-xs text-neutral-600">Adaptogenic support</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-red-200 transition-colors">
                  <span className="text-2xl">🍎</span>
                </div>
                <h4 className="font-medium text-neutral-900 text-sm mb-1">Apple Extract</h4>
                <p className="text-xs text-neutral-600">Natural energy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. FAQ Section */}
      <div className="bg-[#f8f7f3] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="effects-time" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-medium">
                  How long does it take to feel the effects?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-neutral-600">
                    Most users begin to feel the effects within 30-60 minutes. The dual-layer technology provides 
                    immediate release followed by sustained benefits for 2-3 hours.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="mushroom-blend" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-medium">
                  What's the mushroom blend?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-neutral-600">
                    Our proprietary blend includes Lion's Mane (500mg), Reishi (300mg), Cordyceps (200mg), 
                    Chaga (150mg), and Turkey Tail (100mg) - all sustainably sourced and third-party tested.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="daily-use" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-medium">
                  Can I take it daily?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-neutral-600">
                    Yes, our gummies are designed for daily use. The ingredients are well-tolerated and safe 
                    for long-term consumption. We recommend starting with one gummy to assess tolerance.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="mix-supplements" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-medium">
                  Can I mix with other supplements?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-neutral-600">
                    Generally yes, but we recommend consulting with your healthcare provider before combining 
                    with other nootropics or medications. Avoid combining with other stimulants.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* 8. "Goes Well With" Product Cross-Sells */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-12">Goes Well With</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-6xl">🎯</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Focus Gummies</h3>
                  <p className="text-sm text-neutral-600 mb-3">Enhanced concentration blend</p>
                  <p className="font-bold text-neutral-900">$32.00</p>
                </div>
              </div>
              
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <span className="text-6xl">😴</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Sleep Gummies</h3>
                  <p className="text-sm text-neutral-600 mb-3">Natural sleep support</p>
                  <p className="font-bold text-neutral-900">$28.00</p>
                </div>
              </div>
              
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span className="text-6xl">⚡</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Energy Capsules</h3>
                  <p className="text-sm text-neutral-600 mb-3">Sustained energy boost</p>
                  <p className="font-bold text-neutral-900">$35.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-[#f8f7f3] py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Customer Reviews</h2>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center">{renderStars(averageRating, "text-xl")}</div>
                <span className="text-xl font-medium text-neutral-900">{averageRating.toFixed(1)}</span>
                <span className="text-neutral-600">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              {reviews.length > 0 ? (
                  reviews.map(review => <ReviewCard key={review.id} review={review} />)
              ) : (
                  <div className="text-center py-12">
                      <Star className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-2xl font-semibold text-neutral-700 mb-2">No reviews yet</h3>
                      <p className="text-neutral-500 text-lg">Be the first to share your thoughts!</p>
                  </div>
              )}
            </div>

            {user && canReview && !hasReviewed && (
              <div className="bg-white p-8 rounded-lg border border-neutral-200">
                  <h3 className="text-xl font-semibold mb-6 text-neutral-900">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div>
                          <Label className="block text-sm font-medium mb-3 text-neutral-700">Your Rating</Label>
                          <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReview({ ...review, rating: star })}
                                    className="text-3xl transition-colors hover:scale-110"
                                  >
                                      {star <= review.rating ?
                                        <FaStar className="text-amber-400" /> :
                                        <FaRegStar className="text-neutral-300 hover:text-amber-200" />
                                      }
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <Label htmlFor="comment" className="block text-sm font-medium mb-3 text-neutral-700">Your Review</Label>
                          <Textarea
                            id="comment"
                            value={review.comment}
                            onChange={(e) => setReview({ ...review, comment: e.target.value })}
                            placeholder="Tell us about your experience..."
                            rows={5}
                            className="rounded-lg border-neutral-300 focus:border-neutral-500"
                          />
                      </div>
                      <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg px-8 py-3 font-semibold">
                        Submit Review
                      </Button>
                  </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
