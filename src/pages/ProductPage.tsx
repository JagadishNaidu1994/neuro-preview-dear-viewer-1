
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
            stars.push(<FaStar key={i} className={`text-amber-400 ${size}`} />);
        } else if (i - 0.5 <= rating) {
            stars.push(<FaStarHalfAlt key={i} className={`text-amber-400 ${size}`} />);
        } else {
            stars.push(<FaRegStar key={i} className={`text-gray-300 ${size}`} />);
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
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2 text-neutral-500">
              <li><a href="/" className="hover:text-neutral-900">Home</a></li>
              <li>/</li>
              <li><a href="/shop-all" className="hover:text-neutral-900">Shop</a></li>
              <li>/</li>
              <li className="text-neutral-900 font-medium">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side: Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
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
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Product Details */}
            <div className="space-y-8">
              {/* Product Header */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">{product.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">{renderStars(averageRating, "text-base")}</div>
                  <span className="text-sm text-neutral-600">({reviews.length} reviews)</span>
                </div>
                <p className="text-neutral-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Price Display */}
              <div className="py-6 border-y border-neutral-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-neutral-900">${finalPrice.toFixed(2)}</span>
                  {purchaseType === "subscribe" && (
                    <span className="text-lg text-neutral-500 line-through">${basePrice.toFixed(2)}</span>
                  )}
                </div>
                {purchaseType === "subscribe" && (
                  <p className="text-sm text-emerald-600 font-medium mt-1">Save 20% with subscription</p>
                )}
              </div>
              
              {/* Purchase Options */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Purchase Options</h3>
                  <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                        <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">One-time purchase</span>
                            <span className="font-semibold">${basePrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="subscribe" id="subscribe" />
                      <Label htmlFor="subscribe" className="flex-1 cursor-pointer">
                        <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors relative">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">Subscribe & Save</span>
                              <div className="text-sm text-emerald-600">Save 20% • Free shipping</div>
                            </div>
                            <span className="font-semibold">${finalPrice.toFixed(2)}</span>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                            Best Value
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <label className="text-sm font-medium text-neutral-700 mr-4">Quantity:</label>
                      <div className="flex items-center border border-neutral-300 rounded-lg">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                          className="h-10 w-10 rounded-l-lg rounded-r-none border-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setQuantity(quantity + 1)} 
                          className="h-10 w-10 rounded-r-lg rounded-l-none border-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleAddToCart} 
                      className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-4 text-base font-medium rounded-xl h-auto" 
                      disabled={isAnimating || product.stock_quantity === 0}
                    >
                      {isAnimating ? "Adding..." : (product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock")}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleToggleWishlist} 
                      className="rounded-xl h-auto py-4 px-4 border-neutral-300"
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-neutral-600'}`} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Details Accordion */}
              <div className="space-y-3 pt-6 border-t border-neutral-200">
                <Collapsible>
                  <CollapsibleTrigger className="flex justify-between w-full py-4 text-left font-semibold text-lg text-neutral-900 hover:text-neutral-700 transition-colors">
                    Product Details
                    <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-neutral-600 leading-relaxed">
                    Our premium focus gummies are crafted with clinically-studied ingredients to help enhance cognitive performance and provide sustained energy without the crash. Made with natural flavors and colors, and zero added sugar.
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible>
                  <CollapsibleTrigger className="flex justify-between w-full py-4 text-left font-semibold text-lg text-neutral-900 hover:text-neutral-700 transition-colors">
                    Ingredients
                    <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-neutral-600 leading-relaxed">
                    Active Ingredients: CBD (25mg per serving), L-Theanine (100mg), Caffeine (50mg), Ashwagandha Extract (300mg), Bacopa Monnieri (250mg). Other Ingredients: Organic Cane Sugar, Organic Tapioca Syrup, Natural Flavors, Pectin, Citric Acid.
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex justify-between w-full py-4 text-left font-semibold text-lg text-neutral-900 hover:text-neutral-700 transition-colors">
                    Shipping & Returns
                    <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-4 text-neutral-600 leading-relaxed">
                    Free shipping on all orders over $50. Standard delivery takes 3-5 business days. We offer a 30-day money-back guarantee on all products.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Customer Reviews</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center">{renderStars(averageRating, "text-lg")}</div>
              <span className="text-lg font-medium text-neutral-900">{averageRating.toFixed(1)}</span>
              <span className="text-neutral-600">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            {reviews.length > 0 ? (
                reviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (
                <div className="text-center py-12">
                    <Star className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 mb-2">No reviews yet</h3>
                    <p className="text-neutral-500">Be the first to share your thoughts!</p>
                </div>
            )}
          </div>
          
          {user && canReview && !hasReviewed && (
            <div className="bg-white p-8 rounded-2xl border border-neutral-200">
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
                                  className="text-2xl transition-colors hover:scale-110"
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
                          rows={4}
                          className="rounded-xl border-neutral-300 focus:border-neutral-500"
                        />
                    </div>
                    <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl px-8 py-3">
                      Submit Review
                    </Button>
                </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
