import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FaUser,
  FaBox,
  FaHistory,
  FaCogs,
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
  FaDownload,
  FaRedo,
  FaTruck,
  FaShoppingBag,
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

      const { data: addressesData, error: addressesError } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (addressesError) throw addressesError;
      setAddresses(addressesData || []);

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
    { id: "dashboard", icon: <FaChartBar />, label: "Dashboard", color: "from-blue-500 to-cyan-500" },
    { id: "orders", icon: <FaBox />, label: "Orders", color: "from-purple-500 to-pink-500" },
    { id: "profile", icon: <FaUser />, label: "Profile", color: "from-emerald-500 to-teal-500" },
    { id: "addresses", icon: <FaAddressBook />, label: "Addresses", color: "from-orange-500 to-red-500" },
    { id: "payments", icon: <FaCreditCard />, label: "Payments", color: "from-indigo-500 to-purple-500" },
    { id: "rewards", icon: <FaGift />, label: "Rewards", color: "from-yellow-500 to-orange-500" },
    { id: "preferences", icon: <FaCogs />, label: "Settings", color: "from-gray-500 to-slate-500" },
    { id: "security", icon: <FaShieldAlt />, label: "Security", color: "from-red-500 to-pink-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#192a3a] to-slate-800">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#192a3a] to-slate-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Futuristic Sidebar */}
          <div className="lg:w-80 w-full">
            <div className="bg-gradient-to-br from-slate-800/50 to-[#192a3a]/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUser className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {user?.user_metadata?.given_name || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
              
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 mt-6"
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
                <div className="bg-gradient-to-br from-slate-800/50 to-[#192a3a]/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    Welcome back!
                  </h1>
                  <p className="text-slate-400 mb-8">Here's your account overview</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <FaBox className="text-white" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Total Orders</p>
                          <p className="text-2xl font-bold text-white">{orders.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                          <FaShoppingBag className="text-white" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Total Spent</p>
                          <p className="text-2xl font-bold text-white">
                            ₹{orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <FaGift className="text-white" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Reward Points</p>
                          <p className="text-2xl font-bold text-white">{rewards?.points_balance || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <div className="bg-gradient-to-br from-slate-800/50 to-[#192a3a]/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
                  Your Orders ({orders.length})
                </h2>
                
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/50">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              Order #{order.id.slice(0, 8)}...
                            </h3>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-slate-400">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                              <Badge className={`${getStatusColor(order.status)} border`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex flex-col lg:items-end gap-3">
                            <div className="text-2xl font-bold text-white">₹{order.total_amount.toFixed(2)}</div>
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                                className="bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                              >
                                <FaEye className="mr-2" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownloadInvoice(order.id)}
                                className="bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
                              >
                                <FaDownload className="mr-2" />
                                Invoice
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleReorder(order)}
                                className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
                              >
                                <FaRedo className="mr-2" />
                                Reorder
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleTrackOrder(order.id)}
                                className="bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30"
                              >
                                <FaTruck className="mr-2" />
                                Track
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.order_items && order.order_items.length > 0 && (
                          <div className="space-y-3 mt-4">
                            {order.order_items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-slate-600/30 rounded-xl">
                                <img
                                  src={item.products.image_url}
                                  alt={item.products.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-white">{item.products.name}</h4>
                                  <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewProduct(item.products.id)}
                                    className="text-cyan-400 hover:text-cyan-300 p-0 h-auto"
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
                    <FaBox className="mx-auto text-6xl text-slate-600 mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-4">No orders yet</h3>
                    <p className="text-slate-400 mb-8">Start shopping to see your orders here</p>
                    <Button onClick={() => navigate("/shop-all")} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                      Start Shopping
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Other tabs with placeholder content */}
            {activeTab !== "dashboard" && activeTab !== "orders" && (
              <div className="bg-gradient-to-br from-slate-800/50 to-[#192a3a]/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-slate-400">This section is under development. Full functionality coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-[#192a3a] rounded-3xl border border-slate-700/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Order Details #{selectedOrder.id.slice(0, 8)}...
                </h3>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-700/30 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Order Date</p>
                  <p className="text-white font-medium">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
                <div className="bg-slate-700/30 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div className="bg-slate-700/30 rounded-2xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-white">₹{selectedOrder.total_amount.toFixed(2)}</p>
                </div>
              </div>

              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-4 text-lg">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.order_items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-2xl">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{item.products.name}</h5>
                          <p className="text-sm text-slate-400">
                            Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">₹{(item.quantity * item.price).toFixed(2)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedOrder(null);
                              handleViewProduct(item.products.id);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 p-0 h-auto"
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
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  <FaDownload className="mr-2" />
                  Download Invoice
                </Button>
                <Button 
                  onClick={() => {
                    handleReorder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <FaRedo className="mr-2" />
                  Reorder Items
                </Button>
                <Button 
                  onClick={() => handleTrackOrder(selectedOrder.id)}
                  className="bg-gradient-to-r from-orange-500 to-red-500"
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
