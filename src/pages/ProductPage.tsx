import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // <-- This was the missing import
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaMinus, FaPlus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ChevronDown, Heart, Star, Minus, Plus } from "lucide-react";
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
            checkWishlist = supabase.from("wishlist_items").select("*").eq("user_id", user.id).eq("product_id", id).maybeSingle();
            checkReviewEligibility = supabase.rpc('check_user_can_review', { p_user_id: user.id, p_product_id: id });
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

        if (reviewsResult.error) console.error("Error fetching reviews:", reviewsResult.error);
        else setReviews(reviewsResult.data || []);

        if (wishlistResult && wishlistResult.data) setIsInWishlist(true);

        if (reviewEligibilityResult) {
            setCanReview(reviewEligibilityResult.data);
            if (!reviewEligibilityResult.data) {
                const { data: existingReview } = await supabase.from("reviews").select("id").eq("user_id", user!.id).eq("product_id", id).maybeSingle();
                if(existingReview) setHasReviewed(true);
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
      
      await supabase.rpc('award_review_points', {p_user_id: user.id});

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
            stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
        } else if (i - 0.5 <= rating) {
            stars.push(<FaStarHalfAlt key={i} className={`text-yellow-400 ${size}`} />);
        } else {
            stars.push(<FaRegStar key={i} className={`text-gray-300 ${size}`} />);
        }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-center py-24">
          <h2 className="text-3xl font-bold text-black mb-4">Product not found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-black hover:bg-gray-800 text-white">Go Back</Button>
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
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Left Side: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  ref={imageRef}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index ? "border-black" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">{renderStars(averageRating, "text-base")}</div>
                <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
              </div>
              <p className="text-gray-600 mt-4 text-lg">{product.description}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="grid grid-cols-2 gap-4">
                <RadioGroupItem value="one-time" id="one-time" className="peer sr-only" />
                <Label htmlFor="one-time" className="p-4 border-2 rounded-lg cursor-pointer text-center transition-all peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white peer-data-[state=checked]:border-black border-gray-200 hover:border-gray-400">
                  <span className="font-semibold block">One-time purchase</span>
                  <span className="text-sm">${basePrice.toFixed(2)}</span>
                </Label>
                
                <RadioGroupItem value="subscribe" id="subscribe" className="peer sr-only" />
                <Label htmlFor="subscribe" className="p-4 border-2 rounded-lg cursor-pointer text-center transition-all peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white peer-data-[state=checked]:border-black border-gray-200 hover:border-gray-400">
                  <span className="font-semibold block">Subscribe & Save 20%</span>
                  <span className="text-sm">${finalPrice.toFixed(2)}</span>
                </Label>
              </RadioGroup>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-full px-2">
                    <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 h-8 w-8 rounded-full"><Minus className="w-4 h-4" /></Button>
                    <span className="px-4 font-medium text-lg">{quantity}</span>
                    <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="p-2 h-8 w-8 rounded-full"><Plus className="w-4 h-4" /></Button>
                </div>
                <Button onClick={handleAddToCart} className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-medium rounded-full" disabled={isAnimating || product.stock_quantity === 0}>
                    {isAnimating ? "Adding..." : (product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock")}
                </Button>
                <Button variant="outline" onClick={handleToggleWishlist} size="icon" className="rounded-full h-12 w-12 border-gray-300">
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4 pt-4 border-t">
                <Collapsible>
                    <CollapsibleTrigger className="flex justify-between w-full font-semibold text-lg text-gray-800">
                        Product Details
                        <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 text-gray-600">
                    Our premium focus gummies are crafted with clinically-studied ingredients to help enhance cognitive performance and provide sustained energy without the crash. Made with natural flavors and colors, and zero added sugar.
                    </CollapsibleContent>
                </Collapsible>
                <Collapsible>
                    <CollapsibleTrigger className="flex justify-between w-full font-semibold text-lg text-gray-800">
                        Ingredients
                        <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 text-gray-600">
                        Active Ingredients: CBD (25mg per serving), L-Theanine (100mg), Caffeine (50mg), Ashwagandha Extract (300mg), Bacopa Monnieri (250mg). Other Ingredients: Organic Cane Sugar, Organic Tapioca Syrup, Natural Flavors, Pectin, Citric Acid.
                    </CollapsibleContent>
                </Collapsible>
            </motion.div>
            
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Customer Reviews</h2>
          <div className="mb-12">
            {reviews.length > 0 ? (
                reviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (
                <div className="text-center py-8">
                    <Star className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">No reviews yet</h3>
                    <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
                </div>
            )}
          </div>
          
          {user && canReview && !hasReviewed && (
            <div className="bg-white p-8 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium mb-2">Your Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setReview({ ...review, rating: star })} className="text-3xl">
                                    {star <= review.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="comment" className="block text-sm font-medium mb-2">Your Review</Label>
                        <Textarea id="comment" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Tell us about your experience..." rows={4} />
                    </div>
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800">Submit Review</Button>
                </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
