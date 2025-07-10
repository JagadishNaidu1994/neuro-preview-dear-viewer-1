import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaUser,
  FaBox,
  FaHistory,
  FaCogs,
  FaEnvelope,
  FaLock,
  FaAddressBook,
  FaCreditCard,
  FaShieldAlt,
  FaGift,
  FaChartBar,
  FaSignOutAlt,
  FaEye,
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

interface UserReward {
  points_balance: number;
  total_earned: number;
  total_redeemed: number;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [rewards, setRewards] = useState<UserReward | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Get active tab from URL
    const path = location.pathname;
    if (path.includes('/orders')) setActiveTab('orders');
    else if (path.includes('/profile')) setActiveTab('profile');
    else if (path.includes('/subscriptions')) setActiveTab('subscriptions');
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
      // Fetch orders with order items
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

      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (rewardsError && rewardsError.code !== 'PGRST116') throw rewardsError;
      setRewards(rewardsData);

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
    // Update URL without page reload
    const newPath = tab === 'dashboard' ? '/account' : `/account/${tab}`;
    window.history.pushState({}, '', newPath);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const sidebarItems = [
    { 
      id: "dashboard", 
      icon: <FaChartBar size={20} />, 
      label: "Dashboard"
    },
    { 
      id: "orders", 
      icon: <FaBox size={20} />, 
      label: "Orders"
    },
    { 
      id: "profile", 
      icon: <FaUser size={20} />, 
      label: "Profile Settings"
    },
    { 
      id: "subscriptions", 
      icon: <FaHistory size={20} />, 
      label: "Subscriptions"
    },
    { 
      id: "addresses", 
      icon: <FaAddressBook size={20} />, 
      label: "Address Book"
    },
    { 
      id: "payments", 
      icon: <FaCreditCard size={20} />, 
      label: "Payment Methods"
    },
    { 
      id: "rewards", 
      icon: <FaGift size={20} />, 
      label: "Rewards"
    },
    { 
      id: "preferences", 
      icon: <FaCogs size={20} />, 
      label: "Preferences"
    },
    { 
      id: "security", 
      icon: <FaLock size={20} />, 
      label: "Security"
    },
  ];

  if (isAdmin) {
    sidebarItems.unshift({
      id: "admin",
      icon: <FaShieldAlt size={20} />,
      label: "Admin Dashboard"
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-full mx-auto px-4 py-8">
        <Breadcrumb />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 w-full">
            <Card className="bg-[#514B3D] text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">DearNeuro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-4 ${
                      activeTab === item.id
                        ? "bg-white text-[#514B3D] hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                ))}
                
                <div className="pt-4 border-t border-white/20">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-4 text-white hover:bg-white/10"
                  >
                    <FaSignOutAlt size={20} />
                    <span className="hidden sm:inline">Log Out</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl">Welcome back, {user?.user_metadata?.given_name || user?.email}!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                          <p className="text-3xl font-bold">{orders.length}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
                          <p className="text-3xl font-bold">
                            ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2">Reward Points</h3>
                          <p className="text-3xl font-bold">{rewards?.points_balance || 0}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Orders ({orders.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id} className="border">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-4">
                                    <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                  <p className="font-semibold text-lg">${order.total_amount.toFixed(2)}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <FaEye className="mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaBox className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                        <Button onClick={() => navigate("/shop-all")}>
                          Start Shopping
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Address Book</CardTitle>
                    <Button>
                      <FaPlus className="mr-2" />
                      Add Address
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {addresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <Card key={address.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{address.name}</h4>
                                    {address.is_default && (
                                      <Badge variant="secondary">Default</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{address.phone}</p>
                                  <p className="text-sm">
                                    {address.address_line_1}
                                    {address.address_line_2 && `, ${address.address_line_2}`}
                                  </p>
                                  <p className="text-sm">
                                    {address.city}, {address.state} {address.pincode}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <FaEdit />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <FaTrash />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaAddressBook className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
                        <p className="text-gray-600 mb-4">Add an address for faster checkout</p>
                        <Button>
                          <FaPlus className="mr-2" />
                          Add Address
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rewards Tab */}
              <TabsContent value="rewards" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                        <CardContent className="p-6 text-center">
                          <h3 className="text-lg font-semibold mb-2">Available Points</h3>
                          <p className="text-3xl font-bold">{rewards?.points_balance || 0}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
                        <CardContent className="p-6 text-center">
                          <h3 className="text-lg font-semibold mb-2">Total Earned</h3>
                          <p className="text-3xl font-bold">{rewards?.total_earned || 0}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-r from-red-400 to-red-500 text-white">
                        <CardContent className="p-6 text-center">
                          <h3 className="text-lg font-semibold mb-2">Total Redeemed</h3>
                          <p className="text-3xl font-bold">{rewards?.total_redeemed || 0}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-4">How to Earn Points</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Shop & Earn</h4>
                          <p className="text-sm text-gray-600">Earn 1 point for every $1 spent</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Refer Friends</h4>
                          <p className="text-sm text-gray-600">Get 100 points for each referral</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Write Reviews</h4>
                          <p className="text-sm text-gray-600">Earn 25 points per review</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs with placeholder content */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Profile settings functionality will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscriptions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Subscriptions management will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Payment methods management will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>User preferences will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Security settings will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Details #{selectedOrder.id.slice(0, 8)}</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Order Date</p>
                  <p>{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold">Total Amount</p>
                  <p className="text-xl font-bold">${selectedOrder.total_amount.toFixed(2)}</p>
                </div>
              </div>

              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-2 border rounded">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold">{item.products.name}</h5>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.shipping_address && (
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <div className="p-3 bg-gray-50 rounded">
                    <p>{selectedOrder.shipping_address.address_line_1}</p>
                    {selectedOrder.shipping_address.address_line_2 && (
                      <p>{selectedOrder.shipping_address.address_line_2}</p>
                    )}
                    <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
