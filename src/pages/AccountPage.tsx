import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FaUser, FaBox, FaHeart, FaMapMarkerAlt, FaCreditCard, FaCog, FaShield, FaGift, FaCalendar, FaPause, FaPlay, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    name: string;
    price: number;
    image_url: string;
    is_active: boolean;
    stock_quantity: number;
  };
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface PaymentMethod {
  id: string;
  card_type: string;
  card_last_four: string;
  card_holder_name: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

interface Subscription {
  id: string;
  product_id: string;
  quantity: number;
  frequency_weeks: number;
  next_delivery_date: string | null;
  status: string;
  created_at: string;
  discount_percentage: number | null;
  products: {
    name: string;
    price: number;
    image_url: string;
  };
}

interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  newsletter_subscription: boolean;
  language: string;
  timezone: string;
}

interface UserSecurity {
  two_factor_enabled: boolean;
  login_notifications: boolean;
  last_password_change: string | null;
}

interface UserRewards {
  points_balance: number;
  total_earned: number;
  total_redeemed: number;
}

const AccountPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [security, setSecurity] = useState<UserSecurity | null>(null);
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(profileData);

      // Fetch orders with order items
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setOrders(ordersData || []);

      // Fetch wishlist items
      const { data: wishlistData } = await supabase
        .from("wishlist_items")
        .select(`
          *,
          products (name, price, image_url, is_active, stock_quantity)
        `)
        .eq("user_id", user.id);
      
      setWishlist(wishlistData || []);

      // Fetch addresses
      const { data: addressesData } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id);
      
      setAddresses(addressesData || []);

      // Fetch payment methods
      const { data: paymentData } = await supabase
        .from("user_payment_methods")
        .select("*")
        .eq("user_id", user.id);
      
      setPaymentMethods(paymentData || []);

      // Fetch subscriptions
      const { data: subscriptionsData } = await supabase
        .from("subscriptions")
        .select(`
          *,
          products (name, price, image_url)
        `)
        .eq("user_id", user.id);
      
      setSubscriptions(subscriptionsData || []);

      // Fetch preferences
      const { data: preferencesData } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      setPreferences(preferencesData);

      // Fetch security settings
      const { data: securityData } = await supabase
        .from("user_security")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      setSecurity(securityData);

      // Fetch rewards
      const { data: rewardsData } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      setRewards(rewardsData);

    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("users")
        .update(updatedProfile)
        .eq("id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateSubscription = async (subscriptionId: string, updates: { status?: string; frequency_weeks?: number; next_delivery_date?: string }) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", subscriptionId);

      if (error) throw error;

      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, ...updates }
            : sub
        )
      );

      toast({
        title: "Subscription updated",
        description: "Your subscription has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", subscriptionId);

      if (error) throw error;

      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: "cancelled" }
            : sub
        )
      );

      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#514B3D]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumb />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your brain health journey and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-8 bg-white">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FaBox className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <FaCalendar className="w-4 h-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <FaHeart className="w-4 h-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <FaCreditCard className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <FaCog className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <FaGift className="w-4 h-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.first_name || ""}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, first_name: e.target.value } : null)}
                        onBlur={() => updateProfile({ first_name: profile.first_name })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.last_name || ""}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                        onBlur={() => updateProfile({ last_name: profile.last_name })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ""}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        onBlur={() => updateProfile({ phone: profile.phone })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile.date_of_birth || ""}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, date_of_birth: e.target.value } : null)}
                        onBlur={() => updateProfile({ date_of_birth: profile.date_of_birth })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your brain supplement orders and track their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBox className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-4">Start your brain health journey with our premium supplements</p>
                    <Button onClick={() => window.location.href = "/shop-all"}>Browse Products</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-gray-500">
                              {format(new Date(order.created_at), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                              {order.status}
                            </Badge>
                            <p className="text-lg font-semibold mt-1">₹{order.total_amount}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              <img
                                src={item.products.image_url}
                                alt={item.products.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.products.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">₹{item.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Brain Health Subscriptions</CardTitle>
                <CardDescription>
                  Manage your recurring cognitive support supplement deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCalendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscriptions</h3>
                    <p className="text-gray-500 mb-4">Subscribe to your favorite brain supplements and save 15%</p>
                    <Button onClick={() => window.location.href = "/subscriptions"}>View Subscription Options</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={subscription.products.image_url}
                              alt={subscription.products.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-semibold">{subscription.products.name}</h3>
                              <p className="text-sm text-gray-500">
                                Every {subscription.frequency_weeks} weeks • Qty: {subscription.quantity}
                              </p>
                              <p className="text-sm text-gray-500">
                                Next delivery: {subscription.next_delivery_date ? 
                                  format(new Date(subscription.next_delivery_date), "MMM dd, yyyy") : 
                                  "Not scheduled"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                              {subscription.status}
                            </Badge>
                            <p className="text-lg font-semibold mt-1">
                              ₹{subscription.products.price * subscription.quantity}
                              {subscription.discount_percentage && (
                                <span className="text-sm text-green-600 ml-2">
                                  ({subscription.discount_percentage}% off)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {subscription.status === "active" ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateSubscription(subscription.id, { status: "paused" })}
                            >
                              <FaPause className="mr-2 h-4 w-4" />
                              Pause
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateSubscription(subscription.id, { status: "active" })}
                            >
                              <FaPlay className="mr-2 h-4 w-4" />
                              Resume
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <FaEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <FaTrash className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this subscription? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => cancelSubscription(subscription.id)}>
                                  Yes, cancel subscription
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>
                  Your saved brain health supplements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <FaHeart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-4">Save your favorite cognitive supplements for later</p>
                    <Button onClick={() => window.location.href = "/shop-all"}>Browse Products</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h3 className="font-semibold mb-2">{item.products.name}</h3>
                        <p className="text-lg font-bold text-[#514B3D] mb-4">₹{item.products.price}</p>
                        <Button 
                          className="w-full" 
                          disabled={!item.products.is_active || item.products.stock_quantity === 0}
                        >
                          {item.products.is_active && item.products.stock_quantity > 0 
                            ? "Add to Cart" 
                            : "Out of Stock"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Addresses</CardTitle>
                <CardDescription>
                  Manage your shipping addresses for supplement deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-500 mb-4">Add a delivery address to get started</p>
                    <Button>
                      <FaPlus className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{address.name}</h3>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-600">
                              {address.address_line_1}
                              {address.address_line_2 && `, ${address.address_line_2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                            {address.is_default && (
                              <Badge variant="outline" className="mt-2">Default</Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods for supplement purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods saved</h3>
                    <p className="text-gray-500 mb-4">Add a payment method for faster checkout</p>
                    <Button>
                      <FaPlus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs font-semibold">{method.card_type.toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-semibold">**** **** **** {method.card_last_four}</p>
                              <p className="text-sm text-gray-600">{method.card_holder_name}</p>
                              <p className="text-sm text-gray-600">
                                Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                              </p>
                              {method.is_default && (
                                <Badge variant="outline" className="mt-2">Default</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your brain health supplement experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {preferences && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive updates about your orders and supplements</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={preferences.email_notifications}
                            onChange={(e) => setPreferences(prev => prev ? { ...prev, email_notifications: e.target.checked } : null)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-gray-600">Get updates on new brain health products and offers</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={preferences.marketing_emails}
                            onChange={(e) => setPreferences(prev => prev ? { ...prev, marketing_emails: e.target.checked } : null)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter Subscription</p>
                            <p className="text-sm text-gray-600">Brain health tips and cognitive wellness content</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={preferences.newsletter_subscription}
                            onChange={(e) => setPreferences(prev => prev ? { ...prev, newsletter_subscription: e.target.checked } : null)}
                          />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => prev ? { ...prev, language: value } : null)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => prev ? { ...prev, timezone: value } : null)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Rewards Program</CardTitle>
                <CardDescription>
                  Earn points with every brain supplement purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rewards ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-[#514B3D]/5 rounded-lg">
                        <h3 className="text-2xl font-bold text-[#514B3D]">{rewards.points_balance}</h3>
                        <p className="text-sm text-gray-600">Available Points</p>
                      </div>
                      <div className="text-center p-6 bg-green-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-green-600">{rewards.total_earned}</h3>
                        <p className="text-sm text-gray-600">Total Earned</p>
                      </div>
                      <div className="text-center p-6 bg-blue-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-blue-600">{rewards.total_redeemed}</h3>
                        <p className="text-sm text-gray-600">Total Redeemed</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">How to Earn Points</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Purchase brain supplements</span>
                          <span className="font-semibold">1 point per ₹10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Refer a friend</span>
                          <span className="font-semibold">100 points</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Write a product review</span>
                          <span className="font-semibold">25 points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaGift className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards data</h3>
                    <p className="text-gray-500">Start purchasing to earn rewards points</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
