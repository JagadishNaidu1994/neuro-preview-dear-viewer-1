
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaShoppingBag, 
  FaGift, 
  FaCog, 
  FaShield,
  FaSignOutAlt,
  FaUsers
} from "react-icons/fa";

const AccountPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    rewardPoints: 0,
    addresses: 0,
    paymentMethods: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch orders count and total spent
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("user_id", user.id);

      // Fetch reward points
      const { data: rewards } = await supabase
        .from("user_rewards")
        .select("points_balance")
        .eq("user_id", user.id)
        .single();

      // Fetch addresses count
      const { data: addresses } = await supabase
        .from("user_addresses")
        .select("id")
        .eq("user_id", user.id);

      // Fetch payment methods count
      const { data: paymentMethods } = await supabase
        .from("user_payment_methods")
        .select("id")
        .eq("user_id", user.id);

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalOrders,
        totalSpent,
        rewardPoints: rewards?.points_balance || 0,
        addresses: addresses?.length || 0,
        paymentMethods: paymentMethods?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  };

  const getDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    if (userProfile?.first_name) {
      return userProfile.first_name;
    }
    return user?.email?.split('@')[0] || "User";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#514B3D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      icon: FaUser,
      title: "Profile Settings",
      description: "Update your personal information",
      path: "/profile-settings",
      count: null,
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address Book",
      description: "Manage your shipping addresses",
      path: "/address-book",
      count: stats.addresses,
    },
    {
      icon: FaCreditCard,
      title: "Payment Methods",
      description: "Manage your payment options",
      path: "/payment-methods",
      count: stats.paymentMethods,
    },
    {
      icon: FaShoppingBag,
      title: "Order History",
      description: "View your past orders",
      path: "/order-history",
      count: stats.totalOrders,
    },
    {
      icon: FaGift,
      title: "Rewards",
      description: "Check your reward points",
      path: "/rewards",
      count: stats.rewardPoints,
    },
    {
      icon: FaUsers,
      title: "Refer a Friend",
      description: "Share and earn rewards",
      path: "/refer-friend",
      count: null,
    },
    {
      icon: FaCog,
      title: "Preferences",
      description: "Manage your preferences",
      path: "/preferences",
      count: null,
    },
    {
      icon: FaShield,
      title: "Security",
      description: "Password and security settings",
      path: "/security",
      count: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {getAvatarUrl() ? (
                  <img 
                    src={getAvatarUrl()} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#514B3D] flex items-center justify-center text-white text-2xl font-semibold">
                    {getDisplayName()[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-semibold mb-2">Welcome back, {getDisplayName()}!</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                  <span>{stats.totalOrders} Orders</span>
                  <span>${stats.totalSpent.toFixed(2)} Total Spent</span>
                  <span>{stats.rewardPoints} Reward Points</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Account Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#514B3D] bg-opacity-10 rounded-xl flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
                    <item.icon className="w-6 h-6 text-[#514B3D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-[#514B3D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
                {item.count !== null && (
                  <span className="bg-[#514B3D] text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
