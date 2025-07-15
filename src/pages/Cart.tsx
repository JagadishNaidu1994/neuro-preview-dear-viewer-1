import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Gift, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CouponPopup } from "@/components/CouponPopup";
import { useCouponContext } from "@/context/CouponProvider";
import { useToast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
}

const Cart = () => {
  const { items, loading, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use coupon context for persistence
  const { 
    appliedCoupon, 
    setAppliedCoupon, 
    pointsToUse, 
    setPointsToUse,
    discount: savedDiscount,
    setDiscount: setSavedDiscount
  } = useCouponContext();
  
  // Local state
  const [couponCode, setCouponCode] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [isCouponPopupOpen, setIsCouponPopupOpen] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  // Fetch user rewards on component mount
  useEffect(() => {
    if (user) {
      fetchUserRewards();
    }
  }, [user]);

  const fetchUserRewards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("user_rewards")
        .select("points_balance")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching rewards:", error);
        return;
      }

      setRewardPoints(data?.points_balance || 0);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const validateCoupon = async (code: string): Promise<Coupon | null> => {
    setCouponLoading(true);
    try {
      // First check general coupons (active and not expired)
      const { data: generalCoupon, error: generalError } = await supabase
        .from('coupon_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .is('assigned_users', null)
        .single();

      if (!generalError && generalCoupon) {
        // Check expiry
        if (generalCoupon.expires_at && new Date(generalCoupon.expires_at) < new Date()) {
          return null;
        }
        
        // Check user usage limit
        if (user && generalCoupon.max_uses) {
          const { data: usage } = await supabase
            .from('coupon_usage')
            .select('used_count')
            .eq('user_id', user.id)
            .eq('coupon_id', generalCoupon.id)
            .single();
          
          if (usage && usage.used_count >= generalCoupon.max_uses) {
            return null;
          }
        }
        
        return generalCoupon;
      }

      // Then check user-specific coupons
      if (user?.email) {
        const { data: userCoupons, error: userError } = await supabase
          .from('coupon_codes')
          .select('*')
          .eq('code', code.toUpperCase())
          .eq('is_active', true)
          .not('assigned_users', 'is', null);

        if (!userError && userCoupons) {
          // Check if user's email is in the assigned_users list
          const userCoupon = userCoupons.find(coupon => 
            coupon.assigned_users && 
            coupon.assigned_users.split(',').map(email => email.trim().toLowerCase()).includes(user.email!.toLowerCase())
          );
          
          if (userCoupon) {
            // Check expiry
            if (userCoupon.expires_at && new Date(userCoupon.expires_at) < new Date()) {
              return null;
            }
            
            // Check user usage limit
            if (userCoupon.max_uses) {
              const { data: usage } = await supabase
                .from('coupon_usage')
                .select('used_count')
                .eq('user_id', user.id)
                .eq('coupon_id', userCoupon.id)
                .single();
              
              if (usage && usage.used_count >= userCoupon.max_uses) {
                return null;
              }
            }
            
            return userCoupon;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error validating coupon:', error);
      return null;
    } finally {
      setCouponLoading(false);
    }
  };

  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    const coupon = await validateCoupon(code);
    
    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid or has expired",
        variant: "destructive",
      });
      return;
    }

    // Check minimum order amount
    if (coupon.minimum_order_amount > 0 && totalPrice < coupon.minimum_order_amount) {
      toast({
        title: "Minimum Order Not Met",
        description: `This coupon requires a minimum order of ₹${coupon.minimum_order_amount}`,
        variant: "destructive",
      });
      return;
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      toast({
        title: "Expired Coupon",
        description: "This coupon has expired",
        variant: "destructive",
      });
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCode(code);
    toast({
      title: "Coupon Applied!",
      description: `You saved ${coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setSavedDiscount(0);
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order",
    });
  };

  // Calculate discounts
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discount_type === 'percentage') {
      return (totalPrice * appliedCoupon.discount_value) / 100;
    } else {
      return Math.min(appliedCoupon.discount_value, totalPrice);
    }
  };

  const couponDiscount = calculateCouponDiscount();
  const pointsDiscount = Math.min(pointsToUse, totalPrice - couponDiscount);
  const subtotal = totalPrice;
  const finalTotal = Math.max(0, subtotal - couponDiscount - pointsDiscount);

  // Update saved discount when calculated discount changes
  useEffect(() => {
    const totalDiscount = couponDiscount + pointsDiscount;
    setSavedDiscount(totalDiscount);
  }, [couponDiscount, pointsDiscount, setSavedDiscount]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your cart</h1>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl">Loading cart...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to get started!</p>
          <Link to="/shop-all">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop-all">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <div className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        {item.is_subscription && (
                          <Badge className="absolute -top-2 -right-2 text-xs">
                            Subscription
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {item.is_subscription ? "Monthly delivery" : "One-time purchase"}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Coupons & Offers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => applyCoupon(couponCode)}
                    disabled={couponLoading || !couponCode.trim()}
                  >
                    {couponLoading ? "Validating..." : "Apply"}
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCouponPopupOpen(true)}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  View All Available Coupons
                </Button>

                {appliedCoupon && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          {appliedCoupon.code} Applied
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeCoupon}>
                        Remove
                      </Button>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      You saved ₹{couponDiscount.toFixed(2)}!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rewards Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reward Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    You have <span className="font-bold">{rewardPoints}</span> reward points
                  </p>
                  <p className="text-xs text-blue-600">1 point = ₹1</p>
                </div>
                
                {rewardPoints > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Use Points (Max: {Math.min(rewardPoints, finalTotal + pointsDiscount)})</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter points to use"
                        value={pointsToUse || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          const maxPoints = Math.min(rewardPoints, subtotal - couponDiscount);
                          setPointsToUse(Math.min(value, maxPoints));
                        }}
                        min="0"
                        max={Math.min(rewardPoints, subtotal - couponDiscount)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const maxPoints = Math.min(rewardPoints, subtotal - couponDiscount);
                          setPointsToUse(maxPoints);
                        }}
                      >
                        Use All
                      </Button>
                    </div>
                    {pointsToUse > 0 && (
                      <p className="text-sm text-green-600">
                        You'll save ₹{pointsDiscount.toFixed(2)} with {pointsToUse} points
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount:</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Points Discount:</span>
                    <span>-₹{pointsDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
                
                {(couponDiscount > 0 || pointsDiscount > 0) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-medium">
                      You saved ₹{(couponDiscount + pointsDiscount).toFixed(2)} on this order!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg" 
                disabled={finalTotal <= 0}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Popup */}
      <CouponPopup
        isOpen={isCouponPopupOpen}
        onClose={() => setIsCouponPopupOpen(false)}
        onApplyCoupon={applyCoupon}
        appliedCoupon={appliedCoupon?.code}
      />
    </div>
  );
};

export default Cart;