
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaShieldAlt, 
  FaCog, 
  FaGift,
  FaHistory,
  FaSignOutAlt
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AccountPage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Section */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {userProfile?.first_name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}` : 'User'}
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                <Link
                  to="/account"
                  className="flex items-center px-4 py-3 text-white bg-slate-800 rounded-lg"
                >
                  <FaUser className="mr-3" />
                  Dashboard
                </Link>
                
                <Link
                  to="/account/orders"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FaHistory className="mr-3" />
                  Orders
                </Link>
                
                <Link
                  to="/account/addresses"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FaMapMarkerAlt className="mr-3" />
                  Addresses
                </Link>
                
                <Link
                  to="/account/payments"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FaCreditCard className="mr-3" />
                  Payments
                </Link>
                
                <Link
                  to="/account/rewards"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FaGift className="mr-3" />
                  Rewards
                </Link>
                
                <Link
                  to="/account/preferences"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FaCog className="mr-3" />
                  Preferences
                </Link>
                
                <Link
                  to="/account/security"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FaShieldAlt className="mr-3" />
                  Security
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
                <p className="text-gray-600">Here's your account overview</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 text-white p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaHistory className="text-2xl mr-4" />
                    <div>
                      <p className="text-sm opacity-80">Total Orders</p>
                      <p className="text-2xl font-bold">9</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaGift className="text-2xl mr-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Reward Points</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-2xl mr-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Saved Addresses</p>
                      <p className="text-2xl font-bold text-gray-900">6</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Name:</span>
                    <span className="font-medium">{userProfile?.first_name || 'Jagadish'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Name:</span>
                    <span className="font-medium">{userProfile?.last_name || 'Bondada'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user?.email || 'babblusrinivas1994@gmail.com'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{userProfile?.phone || '09160702031'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
