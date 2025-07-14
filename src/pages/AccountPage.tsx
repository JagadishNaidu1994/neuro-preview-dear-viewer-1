
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FaUser, FaMapMarkerAlt, FaCreditCard, FaCog, FaLock, FaShoppingBag, FaGift, FaPlus, FaEdit, FaTrash, FaHistory } from "react-icons/fa";

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

interface AddressForm {
  name: string;
  address_line_1: string;
  address_line_2: string;
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

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_link?: string;
}

interface Subscription {
  id: string;
  product_id: string;
  quantity: number;
  frequency_weeks: number;
  next_delivery_date?: string;
  status: string;
  discount_percentage?: number;
  products?: {
    name: string;
    price: number;
  };
}

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
}

interface UserPreferences {
  id?: string;
  user_id?: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  newsletter_subscription: boolean;
  marketing_emails: boolean;
  language: string;
  timezone: string;
}

interface UserSecurity {
  id?: string;
  user_id?: string;
  two_factor_enabled: boolean;
  login_notifications: boolean;
  last_password_change?: string;
}

interface UserRewards {
  id?: string;
  user_id?: string;
  points_balance: number;
  total_earned: number;
  total_redeemed: number;
}

const AccountPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: ""
  });

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>({
    name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    is_default: false
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    card_type: "",
    card_last_four: "",
    card_holder_name: "",
    expiry_month: "",
    expiry_year: ""
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    email_notifications: true,
    sms_notifications: false,
    newsletter_subscription: true,
    marketing_emails: true,
    language: "en",
    timezone: "UTC"
  });

  // Security state
  const [security, setSecurity] = useState<UserSecurity>({
    two_factor_enabled: false,
    login_notifications: true
  });

  // Rewards state
  const [rewards, setRewards] = useState<UserRewards>({
    points_balance: 0,
    total_earned: 0,
    total_redeemed: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);
      
      // Fetch all user data
      await Promise.all([
        fetchProfile(user.id),
        fetchAddresses(user.id),
        fetchPaymentMethods(user.id),
        fetchOrders(user.id),
        fetchSubscriptions(user.id),
        fetchPreferences(user.id),
        fetchSecurity(user.id),
        fetchRewards(user.id)
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load account data",
        variant: "destructive"
      });
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setProfile(data);
    }
  };

  const fetchAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching addresses:", error);
      return;
    }

    setAddresses(data || []);
  };

  const fetchPaymentMethods = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_payment_methods")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment methods:", error);
      return;
    }

    setPaymentMethods(data || []);
  };

  const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    setOrders(data || []);
  };

  const fetchSubscriptions = async (userId: string) => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        products (
          name,
          price
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return;
    }

    setSubscriptions(data || []);
  };

  const fetchPreferences = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching preferences:", error);
      return;
    }

    if (data) {
      setPreferences(data);
    }
  };

  const fetchSecurity = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_security")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching security settings:", error);
      return;
    }

    if (data) {
      setSecurity(data);
    }
  };

  const fetchRewards = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_rewards")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching rewards:", error);
      return;
    }

    if (data) {
      setRewards(data);
    }
  };

  // Profile functions
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Address functions
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

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const addressData = {
        user_id: user.id,
        ...addressForm
      };

      if (editingAddress) {
        const { error } = await supabase
          .from("user_addresses")
          .update(addressData)
          .eq("id", editingAddress.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address updated successfully"
        });
      } else {
        const { error } = await supabase
          .from("user_addresses")
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
      await fetchAddresses(user.id);
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", addressId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully"
      });

      if (user) {
        await fetchAddresses(user.id);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  // Payment method functions
  const resetPaymentForm = () => {
    setPaymentForm({
      card_type: "",
      card_last_four: "",
      card_holder_name: "",
      expiry_month: "",
      expiry_year: ""
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const paymentData = {
        user_id: user.id,
        card_type: paymentForm.card_type,
        card_last_four: paymentForm.card_last_four,
        card_holder_name: paymentForm.card_holder_name,
        expiry_month: parseInt(paymentForm.expiry_month),
        expiry_year: parseInt(paymentForm.expiry_year),
        is_default: false
      };

      if (editingPayment) {
        const { error } = await supabase
          .from("user_payment_methods")
          .update(paymentData)
          .eq("id", editingPayment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Payment method updated successfully"
        });
      } else {
        const { error } = await supabase
          .from("user_payment_methods")
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
      if (user) {
        await fetchPaymentMethods(user.id);
      }
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setPaymentForm({
      card_type: payment.card_type,
      card_last_four: payment.card_last_four,
      card_holder_name: payment.card_holder_name,
      expiry_month: payment.expiry_month.toString(),
      expiry_year: payment.expiry_year.toString()
    });
    setIsPaymentModalOpen(true);
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const { error } = await supabase
        .from("user_payment_methods")
        .delete()
        .eq("id", paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment method deleted successfully"
      });

      if (user) {
        await fetchPaymentMethods(user.id);
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive"
      });
    }
  };

  // Preferences functions
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          ...preferences
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Preferences updated successfully"
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Security functions
  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_security")
        .upsert({
          user_id: user.id,
          ...security
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Security settings updated successfully"
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Subscription functions
  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", subscriptionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription cancelled successfully"
      });

      if (user) {
        await fetchSubscriptions(user.id);
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSubscription = async (subscriptionId: string, updates: Partial<Subscription>) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", subscriptionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription updated successfully"
      });

      if (user) {
        await fetchSubscriptions(user.id);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <FaUser className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center space-x-2">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <FaCreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <FaShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center space-x-2">
              <FaHistory className="w-4 h-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <FaCog className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <FaLock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profile.first_name || ""}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profile.last_name || ""}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profile.date_of_birth || ""}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
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
                      <FaPlus className="mr-2" />
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
                        <Label htmlFor="name">Name</Label>
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
                        <Switch
                          id="is_default"
                          checked={addressForm.is_default}
                          onCheckedChange={(checked) => setAddressForm({ ...addressForm, is_default: checked })}
                        />
                        <Label htmlFor="is_default">Set as default address</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddressModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Address"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No addresses saved yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{address.name}</h3>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditAddress(address)}>
                              <FaEdit />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteAddress(address.id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.address_line_1}
                          {address.address_line_2 && <br />}
                          {address.address_line_2}
                          <br />
                          {address.city}, {address.state} {address.pincode}
                          <br />
                          Phone: {address.phone}
                        </p>
                        {address.is_default && (
                          <Badge variant="default" className="mt-2">Default</Badge>
                        )}
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingPayment(null);
                      resetPaymentForm();
                    }}>
                      <FaPlus className="mr-2" />
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
                        <Label htmlFor="card_holder_name">Card Holder Name</Label>
                        <Input
                          id="card_holder_name"
                          value={paymentForm.card_holder_name}
                          onChange={(e) => setPaymentForm({ ...paymentForm, card_holder_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="card_type">Card Type</Label>
                        <Select value={paymentForm.card_type} onValueChange={(value) => setPaymentForm({ ...paymentForm, card_type: value })}>
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
                      <div>
                        <Label htmlFor="card_last_four">Last 4 Digits</Label>
                        <Input
                          id="card_last_four"
                          value={paymentForm.card_last_four}
                          onChange={(e) => setPaymentForm({ ...paymentForm, card_last_four: e.target.value })}
                          maxLength={4}
                          required
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
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiry_month: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiry_year">Expiry Year</Label>
                          <Input
                            id="expiry_year"
                            type="number"
                            min={new Date().getFullYear()}
                            value={paymentForm.expiry_year}
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiry_year: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Payment Method"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No payment methods saved yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{payment.card_type.toUpperCase()}</h3>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditPayment(payment)}>
                              <FaEdit />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeletePayment(payment.id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          **** **** **** {payment.card_last_four}
                          <br />
                          Expires: {payment.expiry_month}/{payment.expiry_year}
                          <br />
                          {payment.card_holder_name}
                        </p>
                        {payment.is_default && (
                          <Badge variant="default" className="mt-2">Default</Badge>
                        )}
                      </div>
                    ))}
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
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Tracking</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">
                              {order.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>₹{order.total_amount}</TableCell>
                            <TableCell>
                              <Badge variant={
                                order.status === 'delivered' ? 'default' :
                                order.status === 'shipped' ? 'secondary' :
                                order.status === 'cancelled' ? 'destructive' : 'outline'
                              }>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.tracking_link ? (
                                <a 
                                  href={order.tracking_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Track Order
                                </a>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active subscriptions</p>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">
                              {subscription.products?.name || 'Product'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Quantity: {subscription.quantity} | 
                              Every {subscription.frequency_weeks} weeks |
                              {subscription.discount_percentage && ` ${subscription.discount_percentage}% discount`}
                            </p>
                            {subscription.next_delivery_date && (
                              <p className="text-sm text-gray-600">
                                Next delivery: {new Date(subscription.next_delivery_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Select
                              value={subscription.frequency_weeks.toString()}
                              onValueChange={(value) => handleUpdateSubscription(subscription.id, { frequency_weeks: parseInt(value) })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">Every 2 weeks</SelectItem>
                                <SelectItem value="4">Every 4 weeks</SelectItem>
                                <SelectItem value="8">Every 8 weeks</SelectItem>
                                <SelectItem value="12">Every 12 weeks</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelSubscription(subscription.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status}
                        </Badge>
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
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="email_notifications"
                          checked={preferences.email_notifications}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, email_notifications: checked })}
                        />
                        <Label htmlFor="email_notifications">Email notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sms_notifications"
                          checked={preferences.sms_notifications}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, sms_notifications: checked })}
                        />
                        <Label htmlFor="sms_notifications">SMS notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="newsletter_subscription"
                          checked={preferences.newsletter_subscription}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, newsletter_subscription: checked })}
                        />
                        <Label htmlFor="newsletter_subscription">Newsletter subscription</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="marketing_emails"
                          checked={preferences.marketing_emails}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, marketing_emails: checked })}
                        />
                        <Label htmlFor="marketing_emails">Marketing emails</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Regional Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Preferences"}
                  </Button>
                </form>
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
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="two_factor_enabled"
                        checked={security.two_factor_enabled}
                        onCheckedChange={(checked) => setSecurity({ ...security, two_factor_enabled: checked })}
                      />
                      <Label htmlFor="two_factor_enabled">Enable two-factor authentication</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Login Notifications</h3>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="login_notifications"
                        checked={security.login_notifications}
                        onCheckedChange={(checked) => setSecurity({ ...security, login_notifications: checked })}
                      />
                      <Label htmlFor="login_notifications">Notify me of new login attempts</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Get notified when someone logs into your account from a new device or location.
                    </p>
                  </div>

                  {security.last_password_change && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Password</h3>
                      <p className="text-sm text-gray-600">
                        Last changed: {new Date(security.last_password_change).toLocaleDateString()}
                      </p>
                      <Button type="button" variant="outline">
                        Change Password
                      </Button>
                    </div>
                  )}

                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Security Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
