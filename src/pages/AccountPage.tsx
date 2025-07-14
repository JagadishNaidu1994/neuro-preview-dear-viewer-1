
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Package, CreditCard, MapPin, Bell, Shield, Gift, Users, Star, Clock, Edit, Trash2, Plus, Eye } from "lucide-react";
import { format, addWeeks } from "date-fns";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
}

interface Address {
  id: string;
  name: string;
  address_line_1: string;
  address_line_2: string | null;
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
  next_delivery_date: string | null;
  status: string;
  discount_percentage: number | null;
  created_at: string;
  products?: {
    name: string;
    price: number;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: any;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url: string;
    };
  }[];
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [security, setSecurity] = useState<UserSecurity | null>(null);
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Editing states
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: ""
  });
  
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
    card_number: "",
    card_holder_name: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    is_default: false
  });
  
  const [subscriptionForm, setSubscriptionForm] = useState({
    product_id: "",
    quantity: 1,
    frequency_weeks: 4
  });

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchAddresses(),
      fetchPaymentMethods(),
      fetchSubscriptions(),
      fetchOrders(),
      fetchPreferences(),
      fetchSecurity(),
      fetchRewards()
    ]);
    setLoading(false);
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setProfileForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || ""
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setPreferences(data || {
        email_notifications: true,
        sms_notifications: false,
        marketing_emails: true,
        newsletter_subscription: true,
        language: 'en',
        timezone: 'UTC'
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchSecurity = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_security')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setSecurity(data || {
        two_factor_enabled: false,
        login_notifications: true,
        last_password_change: null
      });
    } catch (error) {
      console.error('Error fetching security:', error);
    }
  };

  const fetchRewards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setRewards(data || {
        points_balance: 0,
        total_earned: 0,
        total_redeemed: 0
      });
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const resetAddressForm = () => {
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
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      card_type: "",
      card_number: "",
      card_holder_name: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
      is_default: false
    });
  };

  const resetSubscriptionForm = () => {
    setSubscriptionForm({
      product_id: "",
      quantity: 1,
      frequency_weeks: 4
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          phone: profileForm.phone,
          date_of_birth: profileForm.date_of_birth
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const addressData = {
        ...addressForm,
        user_id: user.id
      };

      if (editingAddress) {
        const { error } = await supabase
          .from('user_addresses')
          .update(addressData)
          .eq('id', editingAddress.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Address updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('user_addresses')
          .insert([addressData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Address added successfully"
        });
      }

      setIsAddressModalOpen(false);
      setEditingAddress(null);
      resetAddressForm();
      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const paymentData = {
        user_id: user.id,
        card_type: paymentForm.card_type,
        card_last_four: paymentForm.card_number.slice(-4),
        card_holder_name: paymentForm.card_holder_name,
        expiry_month: parseInt(paymentForm.expiry_month),
        expiry_year: parseInt(paymentForm.expiry_year),
        is_default: paymentForm.is_default
      };

      if (editingPayment) {
        const { error } = await supabase
          .from('user_payment_methods')
          .update(paymentData)
          .eq('id', editingPayment.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Payment method updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('user_payment_methods')
          .insert([paymentData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Payment method added successfully"
        });
      }

      setIsPaymentModalOpen(false);
      setEditingPayment(null);
      resetPaymentForm();
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive"
      });
    }
  };

  const handleSubscriptionCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subscriptionForm.product_id) return;

    try {
      const nextDelivery = new Date();
      nextDelivery.setDate(nextDelivery.getDate() + (subscriptionForm.frequency_weeks * 7));

      const subscriptionData = {
        user_id: user.id,
        product_id: subscriptionForm.product_id,
        quantity: subscriptionForm.quantity,
        frequency_weeks: subscriptionForm.frequency_weeks,
        next_delivery_date: nextDelivery.toISOString().split('T')[0],
        discount_percentage: subscriptionForm.frequency_weeks === 2 ? 10 : 
                           subscriptionForm.frequency_weeks === 4 ? 20 : 
                           subscriptionForm.frequency_weeks === 8 ? 30 : 0,
        status: 'active'
      };

      const { error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription created successfully"
      });

      setIsSubscriptionModalOpen(false);
      resetSubscriptionForm();
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive"
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      is_default: address.is_default
    });
    setIsAddressModalOpen(true);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setPaymentForm({
      card_type: payment.card_type,
      card_number: `****${payment.card_last_four}`,
      card_holder_name: payment.card_holder_name,
      expiry_month: payment.expiry_month.toString(),
      expiry_year: payment.expiry_year.toString(),
      cvv: "",
      is_default: payment.is_default
    });
    setIsPaymentModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully"
      });

      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const { error } = await supabase
        .from('user_payment_methods')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment method deleted successfully"
      });

      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive"
      });
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription cancelled successfully"
      });

      await fetchSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profileForm.date_of_birth}
                      onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total_amount}</p>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          {order.order_items.length} item(s)
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Subscriptions</CardTitle>
                <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingSubscription(null);
                      resetSubscriptionForm();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Subscription</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubscriptionCreate} className="space-y-4">
                      <div>
                        <Label htmlFor="product_id">Product</Label>
                        <Input
                          id="product_id"
                          value={subscriptionForm.product_id}
                          onChange={(e) => setSubscriptionForm({ ...subscriptionForm, product_id: e.target.value })}
                          placeholder="Product ID"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={subscriptionForm.quantity}
                          onChange={(e) => setSubscriptionForm({ ...subscriptionForm, quantity: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="frequency">Delivery Frequency</Label>
                        <Select
                          value={subscriptionForm.frequency_weeks.toString()}
                          onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, frequency_weeks: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">Every 2 weeks (10% off)</SelectItem>
                            <SelectItem value="4">Every 4 weeks (20% off)</SelectItem>
                            <SelectItem value="8">Every 8 weeks (30% off)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsSubscriptionModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Subscription</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div key={subscription.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{subscription.products?.name}</h3>
                          <p className="text-sm text-gray-600">
                            Every {subscription.frequency_weeks} weeks
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {subscription.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                          {subscription.discount_percentage && (
                            <p className="text-sm text-green-600 mt-1">
                              {subscription.discount_percentage}% off
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Next delivery: {subscription.next_delivery_date ? new Date(subscription.next_delivery_date).toLocaleDateString() : 'N/A'}
                        </p>
                        {subscription.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelSubscription(subscription.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Saved Addresses</CardTitle>
                <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingAddress(null);
                      resetAddressForm();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address_line_1">Address Line 1</Label>
                        <Input
                          id="address_line_1"
                          value={addressForm.address_line_1}
                          onChange={(e) => setAddressForm({ ...addressForm, address_line_1: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                        <Input
                          id="address_line_2"
                          value={addressForm.address_line_2}
                          onChange={(e) => setAddressForm({ ...addressForm, address_line_2: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_default"
                          checked={addressForm.is_default}
                          onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                        />
                        <Label htmlFor="is_default">Set as default address</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddressModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAddress ? "Update" : "Add"} Address
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{address.name}</h3>
                          <p className="text-sm text-gray-600">
                            {address.address_line_1}
                            {address.address_line_2 && `, ${address.address_line_2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                          {address.is_default && (
                            <Badge variant="default" className="mt-2">Default</Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingPayment(null);
                      resetPaymentForm();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingPayment ? "Edit Payment Method" : "Add New Payment Method"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="card_holder_name">Cardholder Name</Label>
                        <Input
                          id="card_holder_name"
                          value={paymentForm.card_holder_name}
                          onChange={(e) => setPaymentForm({ ...paymentForm, card_holder_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="card_number">Card Number</Label>
                        <Input
                          id="card_number"
                          value={paymentForm.card_number}
                          onChange={(e) => setPaymentForm({ ...paymentForm, card_number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiry_month">Month</Label>
                          <Select
                            value={paymentForm.expiry_month}
                            onValueChange={(value) => setPaymentForm({ ...paymentForm, expiry_month: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                  {(i + 1).toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="expiry_year">Year</Label>
                          <Select
                            value={paymentForm.expiry_year}
                            onValueChange={(value) => setPaymentForm({ ...paymentForm, expiry_year: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="card_type">Card Type</Label>
                        <Select
                          value={paymentForm.card_type}
                          onValueChange={(value) => setPaymentForm({ ...paymentForm, card_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select card type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">Visa</SelectItem>
                            <SelectItem value="mastercard">Mastercard</SelectItem>
                            <SelectItem value="amex">American Express</SelectItem>
                            <SelectItem value="discover">Discover</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_default_payment"
                          checked={paymentForm.is_default}
                          onChange={(e) => setPaymentForm({ ...paymentForm, is_default: e.target.checked })}
                        />
                        <Label htmlFor="is_default_payment">Set as default payment method</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingPayment ? "Update" : "Add"} Payment Method
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold capitalize">{payment.card_type}</h3>
                          <p className="text-sm text-gray-600">
                            **** **** **** {payment.card_last_four}
                          </p>
                          <p className="text-sm text-gray-600">
                            {payment.card_holder_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires {payment.expiry_month}/{payment.expiry_year}
                          </p>
                          {payment.is_default && (
                            <Badge variant="default" className="mt-2">Default</Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPayment(payment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                {preferences && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive order updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.email_notifications}
                        onChange={(e) => setPreferences({ ...preferences, email_notifications: e.target.checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.sms_notifications}
                        onChange={(e) => setPreferences({ ...preferences, sms_notifications: e.target.checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing_emails}
                        onChange={(e) => setPreferences({ ...preferences, marketing_emails: e.target.checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Newsletter Subscription</h3>
                        <p className="text-sm text-gray-600">Receive our weekly newsletter</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.newsletter_subscription}
                        onChange={(e) => setPreferences({ ...preferences, newsletter_subscription: e.target.checked })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {security && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant={security.two_factor_enabled ? "destructive" : "default"}>
                        {security.two_factor_enabled ? "Disable" : "Enable"} 2FA
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Login Notifications</h3>
                        <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={security.login_notifications}
                        onChange={(e) => setSecurity({ ...security, login_notifications: e.target.checked })}
                      />
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Password</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Last changed: {security.last_password_change ? new Date(security.last_password_change).toLocaleDateString() : 'Never'}
                      </p>
                      <Button variant="outline">Change Password</Button>
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
                <CardTitle>Rewards & Loyalty</CardTitle>
              </CardHeader>
              <CardContent>
                {rewards && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <h3 className="text-2xl font-bold text-blue-600">{rewards.points_balance}</h3>
                        <p className="text-sm text-gray-600">Available Points</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <h3 className="text-2xl font-bold text-green-600">{rewards.total_earned}</h3>
                        <p className="text-sm text-gray-600">Total Earned</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <h3 className="text-2xl font-bold text-purple-600">{rewards.total_redeemed}</h3>
                        <p className="text-sm text-gray-600">Total Redeemed</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-4">How to Earn Points</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• Earn 1 point for every ₹1 spent</p>
                        <p>• Get 100 bonus points on your first order</p>
                        <p>• Earn 50 points for each friend you refer</p>
                        <p>• Get 25 points for writing a product review</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-4">Redeem Points</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Use your points to get discounts on future orders. 100 points = ₹10 off
                      </p>
                      <Button disabled={rewards.points_balance < 100}>
                        Redeem Points
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Details Modal */}
        <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Order Information</h3>
                    <p className="text-sm text-gray-600">Order ID: #{selectedOrder.id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Status: {selectedOrder.status}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Total Amount</h3>
                    <p className="text-lg font-bold">₹{selectedOrder.total_amount}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.products.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedOrder.shipping_address && (
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{selectedOrder.shipping_address.name}</p>
                      <p>{selectedOrder.shipping_address.address_line_1}</p>
                      {selectedOrder.shipping_address.address_line_2 && (
                        <p>{selectedOrder.shipping_address.address_line_2}</p>
                      )}
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}</p>
                      <p>Phone: {selectedOrder.shipping_address.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccountPage;
