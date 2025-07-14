
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FaUser, 
  FaBox, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaGift, 
  FaCog, 
  FaShield,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCheck
} from "react-icons/fa";

// Type definitions
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address?: any;
}

interface Address {
  id: string;
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
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
  next_delivery_date?: string;
  status: string;
  discount_percentage?: number;
  created_at: string;
}

interface Rewards {
  id: string;
  points_balance: number;
  total_earned: number;
  total_redeemed: number;
}

interface UserPreferences {
  id?: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  newsletter_subscription: boolean;
  sms_notifications: boolean;
  language: string;
  timezone: string;
}

interface SecuritySettings {
  id?: string;
  two_factor_enabled: boolean;
  login_notifications: boolean;
  last_password_change?: string;
  security_questions?: any;
}

const AccountPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [rewards, setRewards] = useState<Rewards | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    email_notifications: true,
    marketing_emails: true,
    newsletter_subscription: true,
    sms_notifications: false,
    language: "en",
    timezone: "UTC"
  });
  const [security, setSecurity] = useState<SecuritySettings>({
    two_factor_enabled: false,
    login_notifications: true
  });

  // Modal states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);

  // Form states
  const [addressForm, setAddressForm] = useState({
    name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    is_default: false
  });

  const [paymentForm, setPaymentForm] = useState({
    card_type: "",
    card_last_four: "",
    card_holder_name: "",
    expiry_month: 1,
    expiry_year: new Date().getFullYear(),
    is_default: false
  });

  // Set active tab based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) setActiveTab("dashboard");
    else if (path.includes("/orders")) setActiveTab("orders");
    else if (path.includes("/profile")) setActiveTab("profile");
    else if (path.includes("/subscriptions")) setActiveTab("subscriptions");
    else if (path.includes("/addresses")) setActiveTab("addresses");
    else if (path.includes("/payments")) setActiveTab("payments");
    else if (path.includes("/rewards")) setActiveTab("rewards");
    else if (path.includes("/preferences")) setActiveTab("preferences");
    else if (path.includes("/security")) setActiveTab("security");
    else setActiveTab("dashboard");
  }, [location.pathname]);

  // Handle tab changes with navigation
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/account/${tab}`);
  };

  // Load user data
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user profile
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) setUserProfile(profile);

      // Load addresses
      const { data: addressData, error: addressError } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id);

      if (addressError) {
        console.error("Error loading addresses:", addressError);
      } else {
        setAddresses((addressData as Address[]) || []);
      }

      // Load payment methods
      const { data: paymentData, error: paymentError } = await supabase
        .from("user_payment_methods")
        .select("*")
        .eq("user_id", user.id);

      if (paymentError) {
        console.error("Error loading payment methods:", paymentError);
      } else {
        setPaymentMethods((paymentData as PaymentMethod[]) || []);
      }

      // Load orders
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (orderData) setOrders(orderData);

      // Load subscriptions
      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id);

      if (subscriptionData) setSubscriptions(subscriptionData);

      // Load rewards
      const { data: rewardData } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (rewardData) setRewards(rewardData);

      // Load preferences
      const { data: prefData } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (prefData) setPreferences(prefData);

      // Load security settings
      const { data: securityData } = await supabase
        .from("user_security")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (securityData) setSecurity(securityData);

    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Profile update function
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
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

  // Address functions
  const saveAddress = async () => {
    if (!user) return;

    try {
      if (editingAddress) {
        const { error } = await supabase
          .from("user_addresses")
          .update(addressForm)
          .eq("id", editingAddress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_addresses")
          .insert({ ...addressForm, user_id: user.id });

        if (error) throw error;
      }

      loadUserData();
      setShowAddAddress(false);
      setEditingAddress(null);
      setAddressForm({
        name: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        is_default: false
      });

      toast({
        title: "Address saved",
        description: "Your address has been successfully saved.",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      loadUserData();
      toast({
        title: "Address deleted",
        description: "Your address has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Payment method functions
  const savePaymentMethod = async () => {
    if (!user) return;

    try {
      if (editingPayment) {
        const { error } = await supabase
          .from("user_payment_methods")
          .update(paymentForm)
          .eq("id", editingPayment.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_payment_methods")
          .insert({ ...paymentForm, user_id: user.id });

        if (error) throw error;
      }

      loadUserData();
      setShowAddPayment(false);
      setEditingPayment(null);
      setPaymentForm({
        card_type: "",
        card_last_four: "",
        card_holder_name: "",
        expiry_month: 1,
        expiry_year: new Date().getFullYear(),
        is_default: false
      });

      toast({
        title: "Payment method saved",
        description: "Your payment method has been successfully saved.",
      });
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_payment_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;

      loadUserData();
      toast({
        title: "Payment method deleted",
        description: "Your payment method has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Subscription functions
  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      loadUserData();
      toast({
        title: "Subscription updated",
        description: "Your subscription has been successfully updated.",
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

  const cancelSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;

      loadUserData();
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been successfully cancelled.",
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

  // Preferences functions
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({ ...preferences, ...updates, user_id: user.id });

      if (error) throw error;

      setPreferences(prev => ({ ...prev, ...updates }));
      toast({
        title: "Preferences updated",
        description: "Your preferences have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Security functions
  const updateSecurity = async (updates: Partial<SecuritySettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_security")
        .upsert({ ...security, ...updates, user_id: user.id });

      if (error) throw error;

      setSecurity(prev => ({ ...prev, ...updates }));
      toast({
        title: "Security settings updated",
        description: "Your security settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your account</h1>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-xl">Loading account...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-brand-blue-700">My Account</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-9 w-full mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <FaUser className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FaBox className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <FaUser className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <FaCalendar className="h-4 w-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <FaMapMarkerAlt className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <FaCreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <FaGift className="h-4 w-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <FaCog className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <FaShield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back!</CardTitle>
                  <CardDescription>
                    {userProfile?.first_name || "User"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage your account, track orders, and update preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reward Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{rewards?.points_balance || 0}</p>
                  <p className="text-sm text-muted-foreground">Available points</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total_amount}</p>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track all your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No orders found. Start shopping to see your orders here!
                    </p>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total_amount}</p>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                        {order.shipping_address && (
                          <div className="text-sm text-muted-foreground">
                            <p>Shipping to: {JSON.stringify(order.shipping_address)}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={userProfile?.first_name || ""}
                      onChange={(e) => setUserProfile(prev => prev ? {...prev, first_name: e.target.value} : null)}
                      onBlur={(e) => updateProfile({ first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={userProfile?.last_name || ""}
                      onChange={(e) => setUserProfile(prev => prev ? {...prev, last_name: e.target.value} : null)}
                      onBlur={(e) => updateProfile({ last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile?.email || ""}
                    onChange={(e) => setUserProfile(prev => prev ? {...prev, email: e.target.value} : null)}
                    onBlur={(e) => updateProfile({ email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userProfile?.phone || ""}
                    onChange={(e) => setUserProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                    onBlur={(e) => updateProfile({ phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={userProfile?.date_of_birth || ""}
                    onChange={(e) => setUserProfile(prev => prev ? {...prev, date_of_birth: e.target.value} : null)}
                    onBlur={(e) => updateProfile({ date_of_birth: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscriptions</CardTitle>
                <CardDescription>Manage your recurring orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No active subscriptions. Subscribe to products for regular deliveries!
                    </p>
                  ) : (
                    subscriptions.map((subscription) => (
                      <div key={subscription.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Subscription #{subscription.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Every {subscription.frequency_weeks} weeks
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {subscription.quantity}
                            </p>
                            {subscription.next_delivery_date && (
                              <p className="text-sm text-muted-foreground">
                                Next delivery: {new Date(subscription.next_delivery_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Badge variant="outline">{subscription.status}</Badge>
                            {subscription.status === "active" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => cancelSubscription(subscription.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your shipping and billing addresses</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddAddress(true)}>
                    <FaPlus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No addresses saved. Add an address to get started!
                    </p>
                  ) : (
                    addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.address_line_1}
                              {address.address_line_2 && `, ${address.address_line_2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.phone}</p>
                            {address.is_default && (
                              <Badge variant="outline" className="mt-1">Default</Badge>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingAddress(address);
                                setAddressForm(address);
                                setShowAddAddress(true);
                              }}
                            >
                              <FaEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteAddress(address.id)}
                            >
                              <FaTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add/Edit Address Modal */}
            {showAddAddress && (
              <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddAddress(false);
                        setEditingAddress(null);
                        setAddressForm({
                          name: "",
                          address_line_1: "",
                          address_line_2: "",
                          city: "",
                          state: "",
                          pincode: "",
                          phone: "",
                          is_default: false
                        });
                      }}
                    >
                      <FaTimes className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm(prev => ({...prev, name: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address_line_1">Address Line 1</Label>
                      <Input
                        id="address_line_1"
                        value={addressForm.address_line_1}
                        onChange={(e) => setAddressForm(prev => ({...prev, address_line_1: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                      <Input
                        id="address_line_2"
                        value={addressForm.address_line_2}
                        onChange={(e) => setAddressForm(prev => ({...prev, address_line_2: e.target.value}))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm(prev => ({...prev, city: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm(prev => ({...prev, state: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm(prev => ({...prev, pincode: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm(prev => ({...prev, phone: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_default"
                        checked={addressForm.is_default}
                        onChange={(e) => setAddressForm(prev => ({...prev, is_default: e.target.checked}))}
                      />
                      <Label htmlFor="is_default">Set as default address</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddAddress(false);
                        setEditingAddress(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveAddress}>
                      <FaCheck className="h-4 w-4 mr-2" />
                      Save Address
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddPayment(true)}>
                    <FaPlus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No payment methods saved. Add a payment method to get started!
                    </p>
                  ) : (
                    paymentMethods.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{payment.card_type} ending in {payment.card_last_four}</p>
                            <p className="text-sm text-muted-foreground">{payment.card_holder_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires {payment.expiry_month}/{payment.expiry_year}
                            </p>
                            {payment.is_default && (
                              <Badge variant="outline" className="mt-1">Default</Badge>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingPayment(payment);
                                setPaymentForm(payment);
                                setShowAddPayment(true);
                              }}
                            >
                              <FaEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deletePaymentMethod(payment.id)}
                            >
                              <FaTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add/Edit Payment Method Modal */}
            {showAddPayment && (
              <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      {editingPayment ? "Edit Payment Method" : "Add New Payment Method"}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddPayment(false);
                        setEditingPayment(null);
                        setPaymentForm({
                          card_type: "",
                          card_last_four: "",
                          card_holder_name: "",
                          expiry_month: 1,
                          expiry_year: new Date().getFullYear(),
                          is_default: false
                        });
                      }}
                    >
                      <FaTimes className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card_holder_name">Cardholder Name</Label>
                      <Input
                        id="card_holder_name"
                        value={paymentForm.card_holder_name}
                        onChange={(e) => setPaymentForm(prev => ({...prev, card_holder_name: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="card_type">Card Type</Label>
                      <Input
                        id="card_type"
                        value={paymentForm.card_type}
                        onChange={(e) => setPaymentForm(prev => ({...prev, card_type: e.target.value}))}
                        placeholder="Visa, Mastercard, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="card_last_four">Last Four Digits</Label>
                      <Input
                        id="card_last_four"
                        value={paymentForm.card_last_four}
                        onChange={(e) => setPaymentForm(prev => ({...prev, card_last_four: e.target.value}))}
                        maxLength={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry_month">Expiry Month</Label>
                        <Input
                          id="expiry_month"
                          type="number"
                          min="1"
                          max="12"
                          value={paymentForm.expiry_month}
                          onChange={(e) => setPaymentForm(prev => ({...prev, expiry_month: parseInt(e.target.value)}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiry_year">Expiry Year</Label>
                        <Input
                          id="expiry_year"
                          type="number"
                          min={new Date().getFullYear()}
                          value={paymentForm.expiry_year}
                          onChange={(e) => setPaymentForm(prev => ({...prev, expiry_year: parseInt(e.target.value)}))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_default_payment"
                        checked={paymentForm.is_default}
                        onChange={(e) => setPaymentForm(prev => ({...prev, is_default: e.target.checked}))}
                      />
                      <Label htmlFor="is_default_payment">Set as default payment method</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddPayment(false);
                        setEditingPayment(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={savePaymentMethod}>
                      <FaCheck className="h-4 w-4 mr-2" />
                      Save Payment Method
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reward Points</CardTitle>
                <CardDescription>Track and redeem your reward points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-brand-blue-700">{rewards?.points_balance || 0}</p>
                    <p className="text-sm text-muted-foreground">Available Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{rewards?.total_earned || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{rewards?.total_redeemed || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Redeemed</p>
                  </div>
                </div>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-semibold mb-4">How to earn points</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Earn 1 point for every $1 spent</li>
                    <li>• Get 100 bonus points for referring a friend</li>
                    <li>• Earn 50 points for writing a product review</li>
                    <li>• Get 200 points on your birthday</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive order updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.email_notifications}
                    onChange={(e) => updatePreferences({ email_notifications: e.target.checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and news</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing_emails}
                    onChange={(e) => updatePreferences({ marketing_emails: e.target.checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter Subscription</p>
                    <p className="text-sm text-muted-foreground">Stay updated with our latest content</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.newsletter_subscription}
                    onChange={(e) => updatePreferences({ newsletter_subscription: e.target.checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive text message updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.sms_notifications}
                    onChange={(e) => updatePreferences({ sms_notifications: e.target.checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Preferences</CardTitle>
                <CardDescription>Set your language and timezone</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => updatePreferences({ language: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={preferences.timezone}
                    onChange={(e) => updatePreferences({ timezone: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={security.two_factor_enabled}
                    onChange={(e) => updateSecurity({ two_factor_enabled: e.target.checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={security.login_notifications}
                    onChange={(e) => updateSecurity({ login_notifications: e.target.checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">Change Password</Button>
                {security.last_password_change && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Last changed: {new Date(security.last_password_change).toLocaleDateString()}
                  </p>
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
