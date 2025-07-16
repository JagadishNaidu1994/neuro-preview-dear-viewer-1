import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { useCouponContext } from "@/context/CouponProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, loading, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for quick coupon application
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  
  useEffect(() => {
    if (isOpen && user) {
      fetchQuickCoupons();
    }
  }, [isOpen, user]);

  const fetchQuickCoupons = async () => {
    if (!user) return;
    
    try {
      const { data: coupons, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .eq('is_active', true)
        .order('discount_value', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Filter out expired and max-usage coupons
      const now = new Date().toISOString();
      const validCoupons = [];

      for (const coupon of coupons || []) {
        // Check if expired
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
          continue;
        }

        // Check if max uses reached globally
        if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
          continue;
        }

        // Check user-specific assignment
        if (coupon.assigned_users) {
          const assignedEmails = coupon.assigned_users.split(',').map(email => email.trim());
          if (!assignedEmails.includes(user.email)) {
            continue;
          }
        }

        // Check user-specific usage limit (if max_uses exists)
        if (coupon.max_uses) {
          const { data: userUsage } = await supabase
            .from('coupon_usage')
            .select('used_count')
            .eq('coupon_id', coupon.id)
            .eq('user_id', user.id)
            .single();

          if (userUsage && userUsage.used_count >= coupon.max_uses) {
            continue;
          }
        }

        validCoupons.push(coupon);
      }

      setAvailableCoupons(validCoupons.slice(0, 2));
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const applyQuickCoupon = (coupon: any) => {
    setAppliedCoupon(coupon);
    toast({
      title: "Coupon Applied!",
      description: `${coupon.code} has been applied to your cart`,
    });
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discount_type === 'percentage') {
      return (totalPrice * appliedCoupon.discount_value) / 100;
    } else {
      return Math.min(appliedCoupon.discount_value, totalPrice);
    }
  };

  const discount = calculateDiscount();
  const finalTotal = Math.max(0, totalPrice - discount);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Cart ({totalItems})</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-8">Loading cart...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Add some products to get started!</p>
                <Button onClick={onClose} asChild>
                  <Link to="/shop-all">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-primary font-semibold">₹{item.product.price}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.product_id)}
                          className="ml-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Coupons Section */}
          {availableCoupons.length > 0 && items.length > 0 && (
            <div className="p-4 border-t">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Quick Apply Coupons
              </h3>
              <div className="space-y-2">
                {availableCoupons.slice(0, 2).map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex-1">
                      <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">
                        {coupon.code}
                      </code>
                      <p className="text-xs text-muted-foreground">
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}% OFF` 
                          : `₹${coupon.discount_value} OFF`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyQuickCoupon(coupon)}
                      disabled={appliedCoupon?.id === coupon.id}
                    >
                      {appliedCoupon?.id === coupon.id ? "Applied" : "Apply"}
                    </Button>
                  </div>
                ))}
              </div>
              
              {appliedCoupon && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      {appliedCoupon.code} Applied
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAppliedCoupon(null)}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-green-600">
                    You saved ₹{discount.toFixed(2)}!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-background">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Link to="/cart" onClick={onClose}>
                  <Button className="w-full">
                    View Cart & Checkout
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    clearCart();
                    onClose();
                  }}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;