import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ChevronDown, Heart, Star, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "@/components/ReviewCard";
import { useToast } from "@/hooks/use-toast";

// Interface definitions (keep these as they are)
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
  const [purchaseType, setPurchaseType] = useState("subscribe");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: "" });
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

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (productError || !productData) {
        console.error("Error fetching product:", productError);
        setLoading(false);
        return;
      }
      setProduct(productData);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`*, users (email)`)
        .eq("product_id", id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (reviewsError) console.error("Error fetching reviews:", reviewsError);
      else setReviews(reviewsData || []);

      if (user) {
        const { data: wishlistData } = await supabase
          .from("wishlist_items")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", id)
          .maybeSingle();
        setIsInWishlist(!!wishlistData);

        const { data: canReviewData, error: canReviewError } = await supabase.rpc('check_user_can_review', { p_user_id: user.id, p_product_id: id });
        if(canReviewError) console.error("Error checking review eligibility:", canReviewError);
        else setCanReview(canReviewData);
        
        if (!canReviewData) {
            const { data: hasReviewedData } = await supabase.from("reviews").select("id").eq("user_id", user.id).eq("product_id", id).maybeSingle();
            setHasReviewed(!!hasReviewedData);
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
    setTimeout(() => setIsAnimating(false), 1000); // Animation duration
  };

  const handleToggleWishlist = async () => {
    if (!user || !product) {
        toast({ title: "Please sign in to add to wishlist", variant: "destructive"});
        return;
    }
    if (isInWishlist) {
      await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", product.id);
      setIsInWishlist(false);
      toast({ title: "Removed from wishlist" });
    } else {
      await supabase.from("wishlist_items").insert([{ user_id: user.id, product_id: product.id }]);
      setIsInWishlist(true);
      toast({ title: "Added to wishlist" });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product || !canReview || hasReviewed || review.rating === 0) {
        toast({title: "Please provide a rating.", variant: "destructive"});
        return;
    };

    const { error } = await supabase.from("reviews").insert([
      { product_id: product.id, user_id: user.id, rating: review.rating, comment: review.comment },
    ]);

    if (error) {
        toast({ title: "Error submitting review.", variant: "destructive" });
    } else {
        await supabase.rpc('award_review_points', { p_user_id: user.id });
        toast({ title: "Success!", description: "Review submitted for approval. You earned 25 points!" });
        setReview({ rating: 0, comment: "" });
        setHasReviewed(true);
        setCanReview(false);
    }
  };

  const getAverageRating = () => reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
  const averageRating = getAverageRating();

  const renderStars = (rating: number, size = "text-base") => [...Array(5)].map((_, i) => (
    <FaStar key={i} className={i < Math.round(rating) ? `text-yellow-400 ${size}` : `text-gray-300 ${size}`} />
  ));
  
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white text-center py-24"><h2 className="text-3xl font-bold">Product not found</h2></div>
  );

  const productImages = [
    product.image_url,
    "https://framerusercontent.com/images/7PrGzN5G7FNOl4aIONdYwfdZEjI.jpg",
    "https://framerusercontent.com/images/fC1GN0dWOebGJtoNP7yCPwHf654.png",
    "https://framerusercontent.com/images/7PrGzN5G7FNOl4aIONdYwfdZEjI.jpg",
  ];
  
  const finalPrice = product.price * (purchaseType === "subscribe" ? 0.8 : 1);

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img key={selectedImage} src={productImages[selectedImage]} alt={product.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover" />
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button key={index} onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-black" : "border-transparent hover:border-gray-300"}`}>
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">{renderStars(averageRating)}</div>
                <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
              </div>
              <p className="text-gray-600 mt-4 text-lg leading-relaxed">{product.description}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RadioGroupItem value="one-time" id="one-time" className="peer sr-only" />
                <Label htmlFor="one-time" className="p-4 border-2 rounded-lg cursor-pointer text-center transition-all peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white peer-data-[state=checked]:border-black border-gray-200 hover:border-gray-400">
                  <span className="font-semibold block">One-time purchase</span>
                  <span className="text-sm">${product.price.toFixed(2)}</span>
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
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"><Minus className="w-4 h-4" /></button>
                    <span className="px-4 font-medium text-lg w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-2 h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"><Plus className="w-4 h-4" /></button>
                </div>
                <Button onClick={handleAddToCart} className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-medium rounded-full" disabled={isAnimating || product.stock_quantity === 0}>
                    {isAnimating ? "Adding..." : (product.stock_quantity > 0 ? `Add to Cart - $${(finalPrice * quantity).toFixed(2)}` : "Out of Stock")}
                </Button>
                <Button variant="outline" onClick={handleToggleWishlist} size="icon" className="rounded-full h-12 w-12 flex-shrink-0 border-gray-300">
                    <Heart className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-gray-600"><p>Free shipping on orders over $50</p> <p>30-day money-back guarantee</p></div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Customer Reviews</h2>
          <div className="max-w-4xl mx-auto">
            {reviews.length > 0 ? reviews.map(r => <ReviewCard key={r.id} review={r} />) : 
              <div className="text-center py-8"><Star className="w-12 h-12 mx-auto text-gray-300 mb-4" /><h3 className="text-xl font-semibold text-gray-700">No reviews yet</h3><p className="text-gray-500 mt-2">Be the first to share your thoughts!</p></div>
            }

            {user && (canReview || hasReviewed) && (
            <div className="bg-gray-50 p-8 rounded-lg mt-12">
                <h3 className="text-xl font-semibold mb-4">{hasReviewed ? "You've already reviewed this product" : "Write a Review"}</h3>
                {!hasReviewed && (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium mb-2">Your Rating</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} type="button" onClick={() => setReview({ ...review, rating: star })} className="text-3xl transition-transform hover:scale-110">
                                        {star <= review.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="comment" className="block text-sm font-medium mb-2">Your Review</Label>
                            <Textarea id="comment" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Tell us about your experience..." rows={4} className="bg-white" />
                        </div>
                        <Button type="submit" className="bg-black text-white hover:bg-gray-800">Submit Review</Button>
                    </form>
                )}
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
