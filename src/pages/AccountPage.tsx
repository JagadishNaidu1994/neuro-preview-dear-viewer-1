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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  FaSave,
  FaPaypal,
  FaGooglePay,
  FaCalendarAlt,
} from "react-icons/fa";
import jsPDF from 'jspdf';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: any;
  tracking_link?: string;
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

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
      setProfileData({
        firstName: user.user_metadata?.given_name || "",
        lastName: user.user_metadata?.family_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        dateOfBirth: user.user_metadata?.date_of_birth || "",
        gender: user.user_metadata?.gender || "",
      });
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    try {
      // Fetch orders with tracking_link
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

      // Add sample payment methods for demonstration
      setPaymentMethods([
        {
          id: "1",
          card_type: "Visa",
          card_last_four: "4242",
          card_holder_name: "John Doe",
          expiry_month: 12,
          expiry_year: 2025,
          is_default: true,
        },
        {
          id: "2",
          card_type: "PayPal",
          card_last_four: "",
          card_holder_name: "john.doe@example.com",
          expiry_month: 0,
          expiry_year: 0,
          is_default: false,
        },
      ]);

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

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          given_name: profileData.firstName,
          family_name: profileData.lastName,
          phone: profileData.phone,
          date_of_birth: profileData.dateOfBirth,
          gender: profileData.gender,
        },
      });

      if (error) throw error;
      
      // Also update the users table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          date_of_birth: profileData.dateOfBirth,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;
      
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setProfileLoading(false);
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

  const handleDownloadInvoice = async (order: Order) => {
    try {
      console.log("Generating invoice for order:", order.id);
      
      const doc = new jsPDF();
      
      // Header with brand info
      doc.setFillColor(52, 152, 219);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('INVOICE', 20, 25);
      
      doc.setFontSize(12);
      doc.text('DearNeuro', 150, 20);
      doc.text('www.dearneuro.com', 150, 30);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Invoice details
      doc.setFontSize(14);
      doc.text(`Invoice Number: ${order.id.slice(0, 8).toUpperCase()}`, 20, 60);
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 70);
      doc.text(`Status: ${order.status.toUpperCase()}`, 20, 80);
      
      // Bill to section
      doc.setFontSize(16);
      doc.text('Bill To:', 20, 100);
      
      doc.setFontSize(12);
      const shippingAddress = order.shipping_address;
      if (shippingAddress) {
        doc.text(`${shippingAddress.name || 'Customer'}`, 20, 110);
        doc.text(`${shippingAddress.address_line_1 || ''}`, 20, 120);
        if (shippingAddress.address_line_2) {
          doc.text(`${shippingAddress.address_line_2}`, 20, 130);
        }
        doc.text(`${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.pincode || ''}`, 20, 140);
        if (shippingAddress.phone) {
          doc.text(`Phone: ${shippingAddress.phone}`, 20, 150);
        }
      }
      
      // Items table header
      let yPosition = 170;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, 170, 10, 'F');
      
      doc.setFontSize(12);
      doc.text('Description', 25, yPosition + 7);
      doc.text('Qty', 100, yPosition + 7);
      doc.text('Rate', 130, yPosition + 7);
      doc.text('Amount', 160, yPosition + 7);
      
      yPosition += 15;
      
      // Items
      let subtotal = 0;
      if (order.order_items) {
        order.order_items.forEach((item) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          
          doc.text(item.products.name, 25, yPosition);
          doc.text(item.quantity.toString(), 100, yPosition);
          doc.text(`$${item.price.toFixed(2)}`, 130, yPosition);
          doc.text(`$${itemTotal.toFixed(2)}`, 160, yPosition);
          
          yPosition += 10;
        });
      }
      
      // Totals
      yPosition += 10;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      doc.text('Subtotal:', 130, yPosition);
      doc.text(`$${subtotal.toFixed(2)}`, 160, yPosition);
      
      yPosition += 10;
      doc.text('Tax:', 130, yPosition);
      doc.text('$0.00', 160, yPosition);
      
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Total:', 130, yPosition);
      doc.text(`$${order.total_amount.toFixed(2)}`, 160, yPosition);
      
      // Footer
      yPosition += 30;
      doc.setFontSize(10);
      doc.text('Thank you for your business!', 20, yPosition);
      doc.text('Please pay invoice within 15 days.', 20, yPosition + 10);
      
      // Save the PDF
      doc.save(`invoice-${order.id.slice(0, 8)}.pdf`);
      
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Error generating invoice. Please try again.");
    }
  };

  const handleTrackOrder = (order: Order) => {
    if (order.tracking_link) {
      window.open(order.tracking_link, '_blank');
    } else {
      alert("Tracking information not available yet.");
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product?id=${productId}`);
  };

  const getAvatarImage = () => {
    const firstName = profileData.firstName || user?.user_metadata?.given_name || '';
    const lastName = profileData.lastName || user?.user_metadata?.family_name || '';
    
    // Simple gender detection based on common names (this is a basic implementation)
    const maleNames = ['john', 'james', 'robert', 'michael', 'william', 'david', 'richard', 'charles', 'joseph', 'thomas'];
    const femaleNames = ['mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen'];
    
    const firstNameLower = firstName.toLowerCase();
    
    if (maleNames.includes(firstNameLower)) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    }
    
    if (femaleNames.includes(firstNameLower)) {
      return "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face";
    }
    
    // Default professional avatar
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
  };

  const PaymentMethodIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
      case 'paypal':
        return <FaPaypal className="text-blue-600 text-2xl" />;
      case 'googlepay':
        return <FaGooglePay className="text-green-600 text-2xl" />;
      default:
        return <FaCreditCard className="text-[#192a3a] text-2xl" />;
    }
  };

  const sidebarItems = [
    { id: "dashboard", icon: <FaUser />, label: "Dashboard" },
    { id: "orders", icon: <FaBox />, label: "Orders" },
    { id: "subscriptions", icon: <FaBox />, label: "Subscriptions" },
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

  const userDisplayName = `${user?.user_metadata?.given_name || ''} ${user?.user_metadata?.family_name || ''}`.trim() || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 w-full">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-center mb-8">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={getAvatarImage()} alt={userDisplayName} />
                  <AvatarFallback className="bg-[#192a3a] text-white text-2xl">
                    <FaUser />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-[#192a3a]">
                  {userDisplayName}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                    {/* Profile Edit Section */}
                    <Card className="mt-6">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl text-[#192a3a]">Profile Information</CardTitle>
                          {!isEditingProfile && (
                            <Button
                              onClick={() => setIsEditingProfile(true)}
                              variant="outline"
                              className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                            >
                              <FaEdit className="mr-2" />
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isEditingProfile ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                  id="firstName"
                                  value={profileData.firstName}
                                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                  id="lastName"
                                  value={profileData.lastName}
                                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                value={profileData.email}
                                disabled
                                className="mt-1 bg-gray-100"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dateOfBirth">Date of Birth</Label>
                              <Input
                                id="dateOfBirth"
                                type="date"
                                value={profileData.dateOfBirth}
                                onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="gender">Gender</Label>
                              <Select
                                value={profileData.gender}
                                onValueChange={(value) => setProfileData({...profileData, gender: value})}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={handleProfileUpdate}
                                disabled={profileLoading}
                                className="bg-[#192a3a] hover:bg-[#0f1a26] text-white"
                              >
                                <FaSave className="mr-2" />
                                {profileLoading ? "Saving..." : "Save Changes"}
                              </Button>
                              <Button
                                onClick={() => setIsEditingProfile(false)}
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">First Name:</span>
                              <span className="font-medium">{profileData.firstName || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Name:</span>
                              <span className="font-medium">{profileData.lastName || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">{profileData.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{profileData.phone || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date of Birth:</span>
                              <span className="font-medium">{profileData.dateOfBirth || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gender:</span>
                              <span className="font-medium">{profileData.gender || 'Not set'}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
                                  onClick={() => handleDownloadInvoice(order)}
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
                                {order.status === 'shipped' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleTrackOrder(order)}
                                    className="border-[#192a3a] text-[#192a3a] hover:bg-[#192a3a] hover:text-white"
                                  >
                                    <FaTruck className="mr-2" />
                                    Track
                                  </Button>
                                )}
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
                    <Button onClick={() => navigate("/shop-all")}  className="bg-[#192a3a] hover:bg-[#0f1a26] text-white">
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
                    <Button 
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-[#192a3a] hover:bg-[#0f1a26] text-white"
                    >
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
                            <PaymentMethodIcon type={method.card_type} />
                            <div>
                              <h3 className="font-semibold text-[#192a3a]">
                                {method.card_type === 'PayPal' 
                                  ? 'PayPal'
                                  : `${method.card_type} •••• ${method.card_last_four}`
                                }
                              </h3>
                              <p className="text-sm text-gray-600">{method.card_holder_name}</p>
                            </div>
                          </div>
                          {method.is_default && (
                            <Badge className="bg-[#192a3a] text-white">Default</Badge>
                          )}
                        </div>
                        {method.card_type !== 'PayPal' && (
                          <p className="text-gray-600 mb-4">
                            Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                          </p>
                        )}
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

      {/* Add Payment Method Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-[#192a3a]"
              >
                <FaCreditCard className="text-2xl" />
                <span>Card</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-600"
              >
                <FaPaypal className="text-2xl text-blue-600" />
                <span>PayPal</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-green-600"
              >
                <FaGooglePay className="text-2xl text-green-600" />
                <span>Google Pay</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-purple-600"
              >
                <div className="text-2xl">💳</div>
                <span>UPI</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-[#192a3a] hover:bg-[#0f1a26] text-white"
                onClick={() => {
                  setShowPaymentModal(false);
                  alert("Payment method added successfully!");
                }}
              >
                Add Payment Method
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                  onClick={() => handleDownloadInvoice(selectedOrder)}
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
                  onClick={() => handleTrackOrder(selectedOrder)}
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
