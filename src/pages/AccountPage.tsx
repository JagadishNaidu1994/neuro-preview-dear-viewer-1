import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
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
  FaEllipsisV,
} from "react-icons/fa";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const accountItems = [
    { 
      id: "dashboard", 
      icon: <FaChartBar size={20} />, 
      label: "Dashboard", 
      path: "/account",
      onClick: () => setActiveTab("dashboard")
    },
    { 
      id: "orders", 
      icon: <FaBox size={20} />, 
      label: "Orders", 
      path: "/account/orders",
      onClick: () => setActiveTab("orders")
    },
    { 
      id: "profile", 
      icon: <FaUser size={20} />, 
      label: "Profile Settings", 
      path: "/account/profile",
      onClick: () => setActiveTab("profile")
    },
    { 
      id: "subscriptions", 
      icon: <FaHistory size={20} />, 
      label: "Subscriptions", 
      path: "/account/subscriptions",
      onClick: () => setActiveTab("subscriptions")
    },
    { 
      id: "preferences", 
      icon: <FaCogs size={20} />, 
      label: "Preferences", 
      path: "/account/preferences",
      onClick: () => setActiveTab("preferences")
    },
    { 
      id: "security", 
      icon: <FaLock size={20} />, 
      label: "Security", 
      path: "/account/security",
      onClick: () => setActiveTab("security")
    },
    { 
      id: "addresses", 
      icon: <FaAddressBook size={20} />, 
      label: "Address Book", 
      path: "/account/addresses",
      onClick: () => setActiveTab("addresses")
    },
    { 
      id: "payments", 
      icon: <FaCreditCard size={20} />, 
      label: "Payment Methods", 
      path: "/account/payments",
      onClick: () => setActiveTab("payments")
    },
    { 
      id: "rewards", 
      icon: <FaGift size={20} />, 
      label: "Rewards", 
      path: "/rewards",
      onClick: () => setActiveTab("rewards")
    },
    { 
      id: "contact", 
      icon: <FaEnvelope size={20} />, 
      label: "Contact Us", 
      path: "/contact",
      onClick: () => setActiveTab("contact")
    },
  ];

  if (isAdmin) {
    accountItems.unshift({
      id: "admin",
      icon: <FaShieldAlt size={20} />,
      label: "Admin Dashboard",
      path: "/admin",
      onClick: () => setActiveTab("admin")
    });
  }

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

  const getStatusDot = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb />
        
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 bg-[#514B3D] rounded-3xl p-8 h-fit">
            {/* Logo/Brand */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white">DearNeuro</h2>
            </div>

            {/* Navigation Items */}
            <div className="space-y-2">
              {accountItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? "bg-white text-[#514B3D] shadow-lg transform translate-x-2"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className={`transition-colors duration-300 ${
                    activeTab === item.id ? "text-[#514B3D]" : "text-white/80 group-hover:text-white"
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <FaSignOutAlt size={20} />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {activeTab === "orders" ? "Orders" : "Dashboard"}
                  </h1>
                  <p className="text-gray-600">
                    {activeTab === "orders" 
                      ? `${orders.length} orders found` 
                      : `Welcome back, ${user?.user_metadata?.given_name || user?.email}!`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                    <FaEye className="text-gray-600" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-[#514B3D] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.user_metadata?.given_name?.[0] || user?.email?.[0] || "U"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                {/* Tab Navigation */}
                <div className="px-8 pt-8 pb-4">
                  <div className="flex gap-8 border-b">
                    <button className="pb-4 px-2 text-[#514B3D] border-b-2 border-[#514B3D] font-medium">
                      All orders
                    </button>
                    <button className="pb-4 px-2 text-gray-500 hover:text-gray-700 transition-colors">
                      Dispatch
                    </button>
                    <button className="pb-4 px-2 text-gray-500 hover:text-gray-700 transition-colors">
                      Pending
                    </button>
                    <button className="pb-4 px-2 text-gray-500 hover:text-gray-700 transition-colors">
                      Completed
                    </button>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="px-8 pb-8">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="text-xl text-gray-500">Loading orders...</div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-3">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-500 border-b">
                        <div className="col-span-1">Id</div>
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Address</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-1">Price</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1">Action</div>
                      </div>

                      {/* Table Rows */}
                      {orders.map((order, index) => (
                        <div
                          key={order.id}
                          className={`grid grid-cols-12 gap-4 px-6 py-4 rounded-2xl transition-all duration-300 hover:shadow-md ${
                            index === 1 ? "bg-[#514B3D] text-white" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="col-span-1 font-medium">
                            #{order.id.slice(0, 4)}
                          </div>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {user?.user_metadata?.given_name?.[0] || "U"}
                              </span>
                            </div>
                            <span className="font-medium">
                              {user?.user_metadata?.given_name || "Customer"}
                            </span>
                          </div>
                          <div className="col-span-3 text-sm opacity-80">
                            123 Main Street, City, State
                          </div>
                          <div className="col-span-2 text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <div className="col-span-1 font-semibold">
                            ${order.total_amount.toFixed(2)}
                          </div>
                          <div className="col-span-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusDot(order.status)}`}></div>
                              <span className="text-sm capitalize">{order.status}</span>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <button className="p-2 rounded-lg hover:bg-black/10 transition-colors">
                              <FaEllipsisV className="text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBox className="text-gray-400 text-2xl" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                      <button
                        onClick={() => navigate("/shop-all")}
                        className="px-6 py-3 bg-[#514B3D] text-white rounded-xl hover:bg-[#3f3a2f] transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {orders.length > 0 && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t">
                      <div className="text-sm text-gray-500">
                        Showing 06-12 of {orders.length}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg border hover:bg-gray-50 flex items-center justify-center">
                          ‹
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-[#514B3D] text-white flex items-center justify-center">
                          2
                        </button>
                        <button className="w-8 h-8 rounded-lg border hover:bg-gray-50 flex items-center justify-center">
                          3
                        </button>
                        <button className="w-8 h-8 rounded-lg border hover:bg-gray-50 flex items-center justify-center">
                          4
                        </button>
                        <button className="w-8 h-8 rounded-lg border hover:bg-gray-50 flex items-center justify-center">
                          5
                        </button>
                        <button className="w-8 h-8 rounded-lg border hover:bg-gray-50 flex items-center justify-center">
                          ›
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dashboard Content */}
            {activeTab === "dashboard" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold">{orders.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
                    <p className="text-3xl font-bold">
                      ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Reward Points</h3>
                    <p className="text-3xl font-bold">1,250</p>
                  </div>
                </div>

                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold mb-4">Welcome to your account dashboard</h3>
                  <p className="text-gray-600">Manage your orders, profile, and preferences from the sidebar.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;