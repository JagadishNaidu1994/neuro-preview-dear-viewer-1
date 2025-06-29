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
        .limit(5);

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
    { icon: <FaUser size={24} />, label: "Profile Settings", path: "/account/profile" },
    { icon: <FaBox size={24} />, label: "Subscriptions", path: "/account/subscriptions" },
    { icon: <FaHistory size={24} />, label: "Order History", path: "/account/orders" },
    { icon: <FaCogs size={24} />, label: "Preferences", path: "/account/preferences" },
    { icon: <FaEnvelope size={24} />, label: "Contact Us", path: "/contact" },
    { icon: <FaLock size={24} />, label: "Security", path: "/account/security" },
    { icon: <FaAddressBook size={24} />, label: "Address Book", path: "/account/addresses" },
    { icon: <FaCreditCard size={24} />, label: "Payment Methods", path: "/account/payments" },
    { icon: <FaGift size={24} />, label: "Rewards", path: "/rewards" },
  ];

  if (isAdmin) {
    accountItems.unshift({
      icon: <FaShieldAlt size={24} />,
      label: "Admin Dashboard",
      path: "/admin",
    });
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Account Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-3xl font-bold mb-8 text-[#161616]">My Account</h1>
              <div className="space-y-3">
                {accountItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-5 p-4 bg-white rounded-xl border hover:bg-gray-50 transition-colors text-left hover:shadow-md"
                  >
                    <div className="text-[#514B3D]">{item.icon}</div>
                    <span className="text-base text-[#161616] font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 bg-[#514B3D] text-white rounded-xl hover:bg-[#3f3a2f] transition-colors font-medium"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Welcome back, {user?.user_metadata?.given_name || user?.email}!
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Manage your account settings, view your orders, and update your preferences.
              </p>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
              {loading ? (
                <div className="text-center py-12">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-6 border rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-lg">Order #{order.id.slice(0, 8)}...</p>
                        <p className="text-gray-600 mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${order.total_amount.toFixed(2)}</p>
                        <p className="text-gray-600 capitalize mt-1">{order.status}</p>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => navigate("/account/orders")}
                    className="w-full text-center py-3 text-[#514B3D] hover:underline font-medium"
                  >
                    View All Orders
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-6 text-lg">No orders yet</p>
                  <button
                    onClick={() => navigate("/shop-all")}
                    className="px-8 py-3 bg-[#514B3D] text-white rounded-xl hover:bg-[#3f3a2f] font-medium"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => navigate("/cart")}
                  className="p-6 border rounded-xl hover:bg-gray-50 text-center transition-colors"
                >
                  <FaBox className="mx-auto mb-3 text-[#514B3D] text-2xl" />
                  <span className="font-medium">View Cart</span>
                </button>
                <button
                  onClick={() => navigate("/shop-all")}
                  className="p-6 border rounded-xl hover:bg-gray-50 text-center transition-colors"
                >
                  <FaCogs className="mx-auto mb-3 text-[#514B3D] text-2xl" />
                  <span className="font-medium">Shop Products</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;