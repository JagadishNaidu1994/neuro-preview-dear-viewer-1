import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import {
  FaUser,
  FaBox,
  FaHistory,
  FaCogs,
  FaEnvelope,
  FaLock,
  FaAddressBook,
  FaCreditCard,
  FaShield,
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
    { icon: <FaUser size={24} />, label: "Profile Settings", action: () => {} },
    { icon: <FaBox size={24} />, label: "Subscriptions", action: () => {} },
    { icon: <FaHistory size={24} />, label: "Order History", action: () => {} },
    { icon: <FaCogs size={24} />, label: "Preferences", action: () => {} },
    { icon: <FaEnvelope size={24} />, label: "Contact Us", action: () => {} },
    { icon: <FaLock size={24} />, label: "Security", action: () => {} },
    { icon: <FaAddressBook size={24} />, label: "Address Book", action: () => {} },
    { icon: <FaCreditCard size={24} />, label: "Payment Methods", action: () => {} },
  ];

  if (isAdmin) {
    accountItems.unshift({
      icon: <FaShield size={24} />,
      label: "Admin Dashboard",
      action: () => navigate("/admin"),
    });
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6 text-[#161616]">My Account</h1>
              <div className="space-y-2">
                {accountItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="text-[#514B3D]">{item.icon}</div>
                    <span className="text-sm text-[#161616] font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-[#514B3D] text-white rounded-lg hover:bg-[#3f3a2f] transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                Welcome back, {user?.user_metadata?.given_name || user?.email}!
              </h2>
              <p className="text-gray-600">
                Manage your account settings, view your orders, and update your preferences.
              </p>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              {loading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}...</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full text-center py-2 text-[#514B3D] hover:underline">
                    View All Orders
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <button
                    onClick={() => navigate("/shop-all")}
                    className="px-4 py-2 bg-[#514B3D] text-white rounded-lg hover:bg-[#3f3a2f]"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/cart")}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-center"
                >
                  <FaBox className="mx-auto mb-2 text-[#514B3D]" />
                  <span className="text-sm font-medium">View Cart</span>
                </button>
                <button
                  onClick={() => navigate("/shop-all")}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-center"
                >
                  <FaCogs className="mx-auto mb-2 text-[#514B3D]" />
                  <span className="text-sm font-medium">Shop Products</span>
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