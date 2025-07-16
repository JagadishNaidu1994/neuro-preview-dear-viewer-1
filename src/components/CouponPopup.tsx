import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Tag, Clock, Percent, DollarSign } from "lucide-react";
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
  description?: string;
}

interface UserCoupon {
  id: string;
  coupon_id: string;
  is_used: boolean;
  assigned_at: string;
  coupon: Coupon;
}

interface CouponPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
  appliedCoupon?: string;
}

export const CouponPopup: React.FC<CouponPopupProps> = ({
  isOpen,
  onClose,
  onApplyCoupon,
  appliedCoupon
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generalCoupons, setGeneralCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string>("");

  useEffect(() => {
    if (isOpen && user) {
      fetchCoupons();
    }
  }, [isOpen, user]);

  const fetchCoupons = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch general active coupons (not expired and not assigned to specific users)
      const { data: generalData, error: generalError } = await supabase
        .from("coupon_codes")
        .select("*")
        .eq("is_active", true)
        .is("assigned_users", null)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      if (generalError) throw generalError;

      // Filter out coupons that have reached usage limit for this user
      const filteredGeneralCoupons = [];
      if (generalData) {
        for (const coupon of generalData) {
          if (coupon.max_uses) {
            const { data: usage } = await supabase
              .from('coupon_usage')
              .select('used_count')
              .eq('user_id', user.id)
              .eq('coupon_id', coupon.id)
              .single();
            
            if (usage && usage.used_count >= coupon.max_uses) {
              continue; // Skip this coupon
            }
          }
          filteredGeneralCoupons.push(coupon);
        }
      }

      // Fetch user-specific coupons (active, not expired, assigned to this user)
      const { data: userSpecificData, error: userSpecificError } = await supabase
        .from("coupon_codes")
        .select("*")
        .eq("is_active", true)
        .not("assigned_users", "is", null)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      if (userSpecificError) throw userSpecificError;

      // Filter user-specific coupons for this user
      const filteredUserSpecificCoupons = [];
      if (userSpecificData && user?.email) {
        for (const coupon of userSpecificData) {
          // Check if user's email is in assigned_users
          if (coupon.assigned_users && 
              coupon.assigned_users.split(',').map(email => email.trim().toLowerCase()).includes(user.email.toLowerCase())) {
            
            // Check if user has reached usage limit
            if (coupon.max_uses) {
              const { data: usage } = await supabase
                .from('coupon_usage')
                .select('used_count')
                .eq('user_id', user.id)
                .eq('coupon_id', coupon.id)
                .single();
              
              if (usage && usage.used_count >= coupon.max_uses) {
                continue; // Skip this coupon
              }
            }
            filteredUserSpecificCoupons.push(coupon);
          }
        }
      }

      setGeneralCoupons(filteredGeneralCoupons);
      // Convert user-specific coupons to UserCoupon format for compatibility
      const userCouponsFormatted = filteredUserSpecificCoupons.map(coupon => ({
        id: `user-${coupon.id}`,
        coupon_id: coupon.id,
        is_used: false,
        assigned_at: new Date().toISOString(),
        coupon: coupon
      }));
      setUserCoupons(userCouponsFormatted);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Copied!",
        description: `Coupon code ${code} copied to clipboard`,
      });
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy coupon code",
        variant: "destructive",
      });
    }
  };

  const handleApplyCoupon = (code: string) => {
    onApplyCoupon(code);
    onClose();
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatDiscount = (type: string, value: number) => {
    return type === "percentage" ? `${value}% OFF` : `₹${value} OFF`;
  };

  const CouponCard = ({ coupon, isUserSpecific = false }: { coupon: Coupon; isUserSpecific?: boolean }) => (
    <Card className="relative overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <code className="bg-primary/10 px-2 py-1 rounded text-sm font-mono font-semibold">
              {coupon.code}
            </code>
          </div>
          <Badge variant={isUserSpecific ? "default" : "secondary"} className="text-xs">
            {isUserSpecific ? "Personal" : "General"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-lg text-green-600">
              {formatDiscount(coupon.discount_type, coupon.discount_value)}
            </span>
          </div>
          
          {coupon.minimum_order_amount > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>Min order: ₹{coupon.minimum_order_amount}</span>
            </div>
          )}
          
          {coupon.expires_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => copyToClipboard(coupon.code)}
            disabled={isExpired(coupon.expires_at)}
          >
            {copiedCode === coupon.code ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <Copy className="h-3 w-3 mr-1" />
            )}
            Copy
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleApplyCoupon(coupon.code)}
            disabled={isExpired(coupon.expires_at) || appliedCoupon === coupon.code}
          >
            {appliedCoupon === coupon.code ? "Applied" : "Apply"}
          </Button>
        </div>

        {isExpired(coupon.expires_at) && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">Expired</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Available Coupons</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User-specific coupons */}
          {userCoupons.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Your Personal Coupons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userCoupons.map((userCoupon) => (
                  <CouponCard
                    key={userCoupon.id}
                    coupon={userCoupon.coupon}
                    isUserSpecific={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* General coupons */}
          {generalCoupons.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">General Offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generalCoupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {generalCoupons.length === 0 && userCoupons.length === 0 && !loading && (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No coupons available</p>
              <p className="text-muted-foreground">Check back later for amazing deals!</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading coupons...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};