import { useState, useEffect } from "react";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { useCouponContext } from "@/context/CouponProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Truck, CreditCard, Tag, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { appliedCoupon, pointsToUse, discount, setAppliedCoupon, setPointsToUse, setDiscount } = useCouponContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchShippingMethods();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
      
      // Auto-select default address
      const defaultAddr = data?.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchShippingMethods = async () => {
    try {
      const { data, error } = await supabase
        .from("shipping_methods")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      setShippingMethods(data || []);
      
      // Auto-select first shipping method
      if (data && data.length > 0) {
        setSelectedShipping(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .insert([
          {
            ...newAddress,
            user_id: user.id,
            is_default: addresses.length === 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      setShowAddressForm(false);
      setNewAddress({
        name: "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress || !selectedShipping) return;

    setLoading(true);
    try {
      const selectedShippingMethod = shippingMethods.find(method => method.id === selectedShipping);
      const shippingCost = selectedShippingMethod?.price || 0;
      
      // Calculate final total with discounts
      const subtotal = totalPrice + shippingCost;
      const couponDiscount = appliedCoupon ? 
        (appliedCoupon.discount_type === 'percentage' ? 
          (totalPrice * appliedCoupon.discount_value) / 100 : 
          Math.min(appliedCoupon.discount_value, totalPrice)) : 0;
      const pointsDiscount = Math.min(pointsToUse || 0, totalPrice - couponDiscount);
      const finalTotal = Math.max(0, subtotal - couponDiscount - pointsDiscount);
      
      const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: finalTotal,
          status: "pending",
          shipping_address: selectedAddressData as any,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Update coupon usage if coupon was applied
      if (appliedCoupon) {
        // Increment coupon used_count
        await supabase
          .from('coupon_codes')
          .update({ used_count: appliedCoupon.used_count + 1 })
          .eq('id', appliedCoupon.id);

        // Update user coupon usage tracking
        const { data: existingUsage } = await supabase
          .from('coupon_usage')
          .select('used_count')
          .eq('user_id', user.id)
          .eq('coupon_id', appliedCoupon.id)
          .single();

        await supabase
          .from('coupon_usage')
          .upsert({
            user_id: user.id,
            coupon_id: appliedCoupon.id,
            used_count: (existingUsage?.used_count || 0) + 1
          }, {
            onConflict: 'user_id,coupon_id',
            ignoreDuplicates: false
          });
      }

      // Update reward points if used
      if (pointsToUse && pointsToUse > 0) {
        const { data: currentRewards } = await supabase
          .from('user_rewards')
          .select('points_balance, utilized_points')
          .eq('user_id', user.id)
          .single();

        if (currentRewards) {
          await supabase
            .from('user_rewards')
            .update({
              points_balance: currentRewards.points_balance - pointsToUse,
              utilized_points: (currentRewards.utilized_points || 0) + pointsToUse
            })
            .eq('user_id', user.id);
        }
      }

      // Create order items and subscriptions
      const orderItems = [];
      const subscriptions = [];
      for (const item of items) {
        orderItems.push({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
        });
        if (item.is_subscription) {
          subscriptions.push({
            user_id: user.id,
            product_id: item.product_id,
            status: 'active',
            next_delivery_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            frequency: 'monthly',
          });
        }
      }

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);
        if (itemsError) throw itemsError;
      }

      if (subscriptions.length > 0) {
        const { error: subsError } = await supabase
          .from("subscriptions")
          .insert(subscriptions);
        if (subsError) throw subsError;
      }

      // Clear cart and context
      await clearCart();
      setAppliedCoupon(null);
      setPointsToUse(0);
      setDiscount(0);

      // Redirect to success page
      navigate(`/order-success?orderId=${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/shop-all")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const selectedShippingMethod = shippingMethods.find(method => method.id === selectedShipping);
  const shippingCost = selectedShippingMethod?.price || 0;
  
  // Calculate discounts
  const couponDiscount = appliedCoupon ? 
    (appliedCoupon.discount_type === 'percentage' ? 
      (totalPrice * appliedCoupon.discount_value) / 100 : 
      Math.min(appliedCoupon.discount_value, totalPrice)) : 0;
  const pointsDiscount = Math.min(pointsToUse || 0, totalPrice - couponDiscount);
  const finalTotal = Math.max(0, totalPrice + shippingCost - couponDiscount - pointsDiscount);

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address & Shipping */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              {!showAddressForm ? (
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={address.id} className="cursor-pointer">
                          <div className="font-medium">{address.name}</div>
                          <div className="text-sm text-gray-600">{address.phone}</div>
                          <div className="text-sm text-gray-600">
                            {address.address_line_1}
                            {address.address_line_2 && `, ${address.address_line_2}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.pincode}
                          </div>
                          {address.is_default && (
                            <span className="text-xs bg-[#514B3D] text-white px-2 py-1 rounded-full mt-1 inline-block">
                              Default
                            </span>
                          )}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address_line_1">Address Line 1</Label>
                    <Input
                      id="address_line_1"
                      value={newAddress.address_line_1}
                      onChange={(e) => setNewAddress({...newAddress, address_line_1: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                    <Input
                      id="address_line_2"
                      value={newAddress.address_line_2}
                      onChange={(e) => setNewAddress({...newAddress, address_line_2: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-[#514B3D] hover:bg-[#3f3a2f]">
                      Save Address
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Shipping Methods */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Options
              </h2>
              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                {shippingMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                            <div className="text-sm text-gray-600">{method.estimated_days}</div>
                          </div>
                          <div className="font-semibold">
                            {method.price === 0 ? "Free" : `₹${method.price}`}
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {appliedCoupon.code} Discount:
                  </span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pointsToUse > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Points Used ({pointsToUse}):
                  </span>
                  <span>-₹{pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              className="w-full bg-[#514B3D] hover:bg-[#3f3a2f] mt-6"
              disabled={loading || !selectedAddress || !selectedShipping}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
