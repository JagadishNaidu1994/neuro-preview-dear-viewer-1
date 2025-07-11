
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaShieldAlt, 
  FaCog, 
  FaGift,
  FaHistory,
  FaUserFriends,
  FaNewspaper,
  FaCamera
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AccountPage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  // Sleek avatar options based on gender
  const avatarOptions = {
    male: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face"
    ],
    female: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b4e0?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    ],
    neutral: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    ]
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
      setSelectedAvatar(data?.avatar_url || avatarOptions.neutral[0]);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const menuItems = [
    {
      icon: FaUser,
      title: "Profile Settings",
      description: "Update your personal information",
      link: "/profile-settings",
      color: "text-blue-600"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address Book",
      description: "Manage your delivery addresses",
      link: "/address-book",
      color: "text-green-600"
    },
    {
      icon: FaHistory,
      title: "Order History",
      description: "View your past orders and track shipments",
      link: "/order-history",
      color: "text-purple-600"
    },
    {
      icon: FaCreditCard,
      title: "Payment Methods",
      description: "Manage your payment options",
      link: "/payment-methods",
      color: "text-orange-600"
    },
    {
      icon: FaShieldAlt,
      title: "Security",
      description: "Password and security settings",
      link: "/security",
      color: "text-red-600"
    },
    {
      icon: FaCog,
      title: "Preferences",
      description: "Notification and language settings",
      link: "/preferences",
      color: "text-gray-600"
    },
    {
      icon: FaGift,
      title: "Rewards",
      description: "View your rewards and points",
      link: "/rewards",
      color: "text-yellow-600"
    },
    {
      icon: FaUserFriends,
      title: "Refer a Friend",
      description: "Invite friends and earn rewards",
      link: "/refer-friend",
      color: "text-pink-600"
    },
    {
      icon: FaNewspaper,
      title: "Subscriptions",
      description: "Manage your subscriptions",
      link: "/subscriptions",
      color: "text-indigo-600"
    }
  ];

  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleAvatarChange = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setShowAvatarSelector(false);
    // In a real app, you would save this to the database
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="absolute bottom-2 right-2 bg-[#514B3D] text-white p-2 rounded-full hover:bg-[#3f3a2f] transition-colors"
              >
                <FaCamera className="text-sm" />
              </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {userProfile?.first_name || 'User'} {userProfile?.last_name || ''}
              </h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(userProfile?.created_at || new Date()).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>

          {/* Avatar Selector */}
          {showAvatarSelector && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(avatarOptions).map(([gender, avatars]) => (
                  <div key={gender}>
                    <h4 className="text-sm font-medium mb-2 capitalize text-gray-600">{gender}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {avatars.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => handleAvatarChange(avatar)}
                          className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent hover:border-[#514B3D] transition-colors"
                        >
                          <img
                            src={avatar}
                            alt={`${gender} avatar ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors`}>
                  <item.icon className={`text-xl ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 group-hover:text-[#514B3D] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-[#514B3D] mb-2">5</div>
            <div className="text-gray-600 text-sm">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">₹2,450</div>
            <div className="text-gray-600 text-sm">Total Spent</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">120</div>
            <div className="text-gray-600 text-sm">Reward Points</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">2</div>
            <div className="text-gray-600 text-sm">Referrals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
