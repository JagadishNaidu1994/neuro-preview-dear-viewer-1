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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FaMinus,
  FaPlus,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import {
  ChevronDown,
  Package,
  Clock,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
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

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
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
          .eq("is_approved", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setReviews(data || []);
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
      alert("Review submitted for approval! You earned 25 points!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
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
              <p className="text-gray-600 mb-2">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={servings} onValueChange={setServings}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 servings</SelectItem>
                  <SelectItem value="60">60 servings</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20"
              />
              <Button onClick={handleAddToCart} className="w-full">
                Add To Cart - ${finalPrice.toFixed(2)}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>Free Shipping over $50</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>14 Days Returns</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>100% Natural</span>
              </div>
            </div>

            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="delivery-returns">
                  Delivery & Returns
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <p>
                  Pure Balance is formulated to nourish and refresh your skin
                  without stripping away natural oils. Its lightweight texture
                  absorbs quickly and leaves your skin feeling clean, soft, and
                  radiant.
                </p>
              </TabsContent>
              <TabsContent value="how-to-use">
                <p>
                  Apply a small amount to damp skin and gently massage in
                  circular motions. Rinse thoroughly with lukewarm water and
                  pat dry. Use morning and night.
                </p>
              </TabsContent>
              <TabsContent value="ingredients">
                <p>
                  Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Camellia
                  Sinensis Extract, Panthenol, Tocopherol, Allantoin, Citric
                  Acid, Sodium Hyaluronate.
                </p>
              </TabsContent>
              <TabsContent value="delivery-returns">
                <p>
                  We offer fast and climate-conscious shipping across Europe.
                  Most orders arrive within 2–5 business days. Need to make a
                  return? You have 14 days to send it back—simple and
                  hassle-free.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                <span className="font-medium">
                  What skin types are your products suitable for?
                </span>
                <ChevronDown className="w-5 h-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                <p className="text-gray-700">
                  Our products are designed to suit all skin types, including
                  sensitive, oily, dry, and combination skin. Each product
                  includes detailed information to help you find the perfect
                  match for your needs.
                </p>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                <span className="font-medium">
                  Are your products cruelty-free and vegan?
                </span>
                <ChevronDown className="w-5 h-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                <p className="text-gray-700">
                  Yes! All our products are 100% cruelty-free, and many are
                  vegan. Check the product description for specific vegan
                  certifications.
                </p>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                <span className="font-medium">
                  How do I use this product for the best results?
                </span>
                <ChevronDown className="w-5 h-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                <p className="text-gray-700">
                  Each product comes with step-by-step usage instructions. For
                  optimal results, follow the recommended routine and pair it
                  with complementary products from our range.
                </p>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                <span className="font-medium">
                  What ingredients are in this product?
                </span>
                <ChevronDown className="w-5 h-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                <p className="text-gray-700">
                  We prioritize natural, high-quality ingredients. You can
                  find a complete list of ingredients on the product page
                  under “Ingredients.”
                </p>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg text-left">
                <span className="font-medium">
                  Can I use this product if I have sensitive skin?
                </span>
                <ChevronDown className="w-5 h-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                <p className="text-gray-700">
                  Absolutely. Our products are formulated to be gentle and
                  effective for sensitive skin. We recommend patch-testing new
                  products to ensure compatibility with your unique skin.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* You might like */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            You might like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 border"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={relatedProduct.image_url}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-medium mb-2 hover:text-[#514B3D] transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      (window.location.href = `/product?id=${relatedProduct.id}`)
                    }
                  >
                    View Product
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;