
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FaUser,
  FaBox,
  FaAddressBook,
  FaCreditCard,
  FaShieldAlt,
  FaGift,
  FaCogs,
  FaSignOutAlt,
  FaEye,
  FaDownload,
  FaRedo,
  FaTruck,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: any;
  order_items?: {
    id: string;
    quantity: number;
    price: number;
    products: {
      id: string;
      name: string;
      image_url: string;
    };
  }[];
}

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

interface PaymentMethod {
  id: string;
  card_type: string;
  card_last_four: string;
  card_holder_name: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

interface UserReward {
  points_balance: number;
  total_earned: number;
  total_redeemed: number;
}

interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  newsletter_subscription: boolean;
}

interface UserSecurity {
  two_factor_enabled: boolean;
  login_notifications: boolean;
  last_password_change: string;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [rewards, setRewards] = useState<UserReward | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [security, setSecurity] = useState<UserSecurity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/orders')) setActiveTab('orders');
    else if (path.includes('/profile')) setActiveTab('profile');
    else if (path.includes('/addresses')) setActiveTab('addresses');
    else if (path.includes('/payments')) setActiveTab('payments');
    else if (path.includes('/rewards')) setActiveTab('rewards');
    else if (path.includes('/preferences')) setActiveTab('preferences');
    else if (path.includes('/security')) setActiveTab('security');
    else setActiveTab('dashboard');
  }, [location]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch addresses
      const { data: addressesData, error: addressesError } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (addressesError) throw addressesError;
      setAddresses(addressesData || []);

      // Fetch payment methods
      const { data: paymentData, error: paymentError } = await supabase
        .from("user_payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (paymentError) throw paymentError;
      setPaymentMethods(paymentData || []);

      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (rewardsError && rewardsError.code !== 'PGRST116') throw rewardsError;
      setRewards(rewardsData);

      // Fetch preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') throw preferencesError;
      setPreferences(preferencesData);

      // Fetch security settings
      const { data: securityData, error: securityError } = await supabase
        .from("user_security")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (securityError && securityError.code !== 'PGRST116') throw securityError;
      setSecurity(securityData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      navigate("/");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newPath = tab === 'dashboard' ? '/account' : `/account/${tab}`;
    window.history.pushState({}, '', newPath);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleReorder = (order: Order) => {
    console.log("Reordering:", order.id);
    alert("Items have been added to your cart!");
  };

  const handleDownloadInvoice = (orderId: string) => {
    console.log("Downloading invoice for:", orderId);
    alert("Invoice download started!");
  };

  const handleTrackOrder = (orderId: string) => {
    console.log("Tracking order:", orderId);
    alert(`Tracking order: ${orderId.slice(0, 8)}...`);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product?id=${productId}`);
  };

  const sidebarItems = [
    { id: "dashboard", icon: <FaUser />, label: "Dashboard" },
    { id: "orders", icon: <FaBox />, label: "Orders" },
    { id: "addresses", icon: <FaAddressBook />, label: "Addresses" },
    { id: "payments", icon: <FaCreditCard />, label: "Payments" },
    { id: "rewards", icon: <FaGift />, label: "Rewards" },
    { id: "preferences", icon: <FaCogs />, label: "Preferences" },
    { id: "security", icon: <FaShieldAlt />, label: "Security" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#192a3a]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 w-full">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#192a3a] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUser className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#192a3a]">
                  {user?.user_metadata?.given_name || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
              
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-[#192a3a] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 mt-6"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl text-[#192a3a]">Welcome back!</CardTitle>
                    <p className="text-gray-600">Here's your account overview</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-[#192a3a] text-white rounded-xl">
                        <div className="flex items-center gap-4">
                          <FaBox className="text-2xl" />
                          <div>
                            <p className="text-sm opacity-80">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-gray-100 rounded-xl">
                        <div className="flex items-center gap-4">
                          <FaGift className="text-2xl text-[#192a3a]" />
                          <div>
                            <p className="text-sm text-gray-600">Reward Points</p>
                            <p className="text-2xl font-bold text-[#192a3a]">{rewards?.points_balance || 0}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-gray-100 rounded-xl">
                        <div className="flex items-center gap-4">
                          <FaAddressBook className="text-2xl text-[#192a3a]" />
                          <div>
                            <p className="text-sm text-gray-600">Saved Addresses</p>
                            <p className="text-2xl font-bold text-[#192a3a]">{addresses.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-[#192a3a]">Your Orders ({orders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-xl p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-[#192a3a] mb-2">
                                Order #{order.id.slice(0, 8)}...
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </span>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-col lg:items-end gap-3">
                              <div className="text-2xl font-bold text-[#192a3a]">₹{order.total_amount.toFixed(2)}</div>
                              <div className="flex flex-wrap gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedOrder(order)}
                                  className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                                >
                                  <FaEye className="mr-2" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownloadInvoice(order.id)}
                                  className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                                >
                                  <FaDownload className="mr-2" />
                                  Invoice
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleReorder(order)}
                                  className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                                >
                                  <FaRedo className="mr-2" />
                                  Reorder
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleTrackOrder(order.id)}
                                  className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                                >
                                  <FaTruck className="mr-2" />
                                  Track
                                </Button>
                              </div>
                            </div>
                          </div>

                          {order.order_items && order.order_items.length > 0 && (
                            <div className="space-y-3 mt-4">
                              {order.order_items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                  <img
                                    src={item.products.image_url}
                                    alt={item.products.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-[#192a3a]">{item.products.name}</h4>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-[#192a3a]">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleViewProduct(item.products.id)}
                                      className="text-[#192a3a] hover:text-[#0f1a26] p-0 h-auto"
                                    >
                                      View Product
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <FaBox className="mx-auto text-6xl text-gray-400 mb-6" />
                      <h3 className="text-2xl font-semibold text-[#192a3a] mb-4">No orders yet</h3>
                      <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
                      <Button onClick={() => navigate("/shop-all")} className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Addresses */}
            {activeTab === "addresses" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl text-[#192a3a]">Saved Addresses</CardTitle>
                    <Button className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                      <FaPlus className="mr-2" />
                      Add Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-[#192a3a]">{address.name}</h3>
                          {address.is_default && (
                            <Badge className="bg-[#192a3a] text-white">Default</Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-gray-600 mb-4">
                          <p>{address.address_line_1}</p>
                          {address.address_line_2 && <p>{address.address_line_2}</p>}
                          <p>{address.city}, {address.state} {address.pincode}</p>
                          <p>{address.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white">
                            <FaEdit className="mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            <FaTrash className="mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Methods */}
            {activeTab === "payments" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl text-[#192a3a]">Payment Methods</CardTitle>
                    <Button className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                      <FaPlus className="mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <FaCreditCard className="text-2xl text-[#192a3a]" />
                            <div>
                              <h3 className="font-semibold text-[#192a3a]">
                                {method.card_type} •••• {method.card_last_four}
                              </h3>
                              <p className="text-sm text-gray-600">{method.card_holder_name}</p>
                            </div>
                          </div>
                          {method.is_default && (
                            <Badge className="bg-[#192a3a] text-white">Default</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">
                          Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white">
                            <FaEdit className="mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            <FaTrash className="mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rewards */}
            {activeTab === "rewards" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-[#192a3a]">Rewards Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-[#192a3a] text-white rounded-xl">
                      <FaGift className="text-3xl mx-auto mb-2" />
                      <p className="text-sm opacity-80">Points Balance</p>
                      <p className="text-3xl font-bold">{rewards?.points_balance || 0}</p>
                    </div>
                    <div className="text-center p-6 bg-gray-100 rounded-xl">
                      <p className="text-sm text-gray-600">Total Earned</p>
                      <p className="text-3xl font-bold text-[#192a3a]">{rewards?.total_earned || 0}</p>
                    </div>
                    <div className="text-center p-6 bg-gray-100 rounded-xl">
                      <p className="text-sm text-gray-600">Total Redeemed</p>
                      <p className="text-3xl font-bold text-[#192a3a]">{rewards?.total_redeemed || 0}</p>
                    </div>
                  </div>
                  <div className="border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#192a3a] mb-4">How to Earn Points</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Make a purchase - 1 point per ₹1 spent</li>
                      <li>• Refer a friend - 100 bonus points</li>
                      <li>• Write a product review - 25 points</li>
                      <li>• Birthday bonus - 50 points annually</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-[#192a3a]">Communication Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive order updates and account notifications</p>
                      </div>
                      <Switch checked={preferences?.email_notifications || false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Receive text messages for important updates</p>
                      </div>
                      <Switch checked={preferences?.sms_notifications || false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Marketing Emails</Label>
                        <p className="text-sm text-gray-600">Receive promotional emails and special offers</p>
                      </div>
                      <Switch checked={preferences?.marketing_emails || false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Newsletter Subscription</Label>
                        <p className="text-sm text-gray-600">Stay updated with our latest news and tips</p>
                      </div>
                      <Switch checked={preferences?.newsletter_subscription || false} />
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-[#192a3a]">Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-[#192a3a] mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <Label>Current Password</Label>
                          <Input type="password" className="mt-1" />
                        </div>
                        <div>
                          <Label>New Password</Label>
                          <Input type="password" className="mt-1" />
                        </div>
                        <div>
                          <Label>Confirm New Password</Label>
                          <Input type="password" className="mt-1" />
                        </div>
                        <Button className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-8">
                      <h3 className="text-lg font-semibold text-[#192a3a] mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-gray-600">Add extra security with SMS verification</p>
                        </div>
                        <Switch checked={security?.two_factor_enabled || false} />
                      </div>
                    </div>

                    <div className="border-t pt-8">
                      <h3 className="text-lg font-semibold text-[#192a3a] mb-4">Login Notifications</h3>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Email Login Alerts</p>
                          <p className="text-sm text-gray-600">Get notified of new device logins</p>
                        </div>
                        <Switch checked={security?.login_notifications || false} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#192a3a]">
                  Order Details #{selectedOrder.id.slice(0, 8)}...
                </h3>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="text-gray-600 hover:text-[#192a3a]">
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm mb-1">Order Date</p>
                  <p className="font-medium text-[#192a3a]">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm mb-1">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-[#192a3a]">₹{selectedOrder.total_amount.toFixed(2)}</p>
                </div>
              </div>

              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-[#192a3a] mb-4 text-lg">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.order_items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-[#192a3a]">{item.products.name}</h5>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#192a3a]">₹{(item.quantity * item.price).toFixed(2)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedOrder(null);
                              handleViewProduct(item.products.id);
                            }}
                            className="text-[#192a3a] hover:text-[#0f1a26] p-0 h-auto"
                          >
                            View Product
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => handleDownloadInvoice(selectedOrder.id)}
                  className="bg-[#192a3a] hover:bg-[#0f1a26] text-white"
                >
                  <FaDownload className="mr-2" />
                  Download Invoice
                </Button>
                <Button 
                  onClick={() => {
                    handleReorder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  variant="outline"
                  className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                >
                  <FaRedo className="mr-2" />
                  Reorder Items
                </Button>
                <Button 
                  onClick={() => handleTrackOrder(selectedOrder.id)}
                  variant="outline"
                  className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                >
                  <FaTruck className="mr-2" />
                  Track Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
