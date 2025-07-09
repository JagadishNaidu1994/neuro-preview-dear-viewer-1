import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaCopy, FaGift, FaUsers, FaShare } from "react-icons/fa";

const ReferFriend = () => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pendingRewards: 0,
    totalRewards: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      generateReferralCode();
      fetchReferralStats();
    }
  }, [user]);

  const generateReferralCode = () => {
    if (user) {
      // Generate a unique referral code based on user ID
      const code = `DEAR${user.id.slice(0, 8).toUpperCase()}`;
      setReferralCode(code);
    }
  };

  const fetchReferralStats = async () => {
    if (!user) return;

    try {
      // In a real app, you'd fetch actual referral data from your database
      // For now, we'll use sample data
      setReferralStats({
        totalReferrals: 3,
        pendingRewards: 200,
        totalRewards: 500
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = "Join DearNeuro and get ₹100 off your first order!";
    const body = `Hey! I've been loving DearNeuro's cognitive wellness products and thought you'd be interested too. 

Use my referral link to get ₹100 off your first order: ${window.location.origin}/?ref=${referralCode}

DearNeuro creates amazing mushroom gummies and supplements that actually work for focus, stress relief, and better sleep. Plus, when you make your first purchase, I'll get some reward points too!

Check them out - I think you'll love them as much as I do!`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Please sign in to access referrals</h1>
          <Button onClick={() => window.location.href = "/"}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold mb-8 text-[#161616]">
            Refer a Friend
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Share the benefits of cognitive wellness with your friends and earn rewards together!
          </p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShare className="text-[#514B3D] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">1. Share Your Link</h3>
            <p className="text-gray-600">
              Send your unique referral link to friends and family who would benefit from cognitive wellness.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-[#514B3D] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">2. Friend Places Order</h3>
            <p className="text-gray-600">
              Your friend gets ₹100 off their first order when they use your referral link.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGift className="text-[#514B3D] text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">3. You Earn Rewards</h3>
            <p className="text-gray-600">
              Receive 100 reward points (worth ₹100) for each successful referral.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Referral Link Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Your Referral Link</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Referral Code</label>
                <div className="flex gap-3">
                  <Input
                    value={referralCode}
                    readOnly
                    className="flex-1 font-mono"
                  />
                  <Button
                    onClick={copyReferralLink}
                    variant="outline"
                    className="px-6"
                  >
                    <FaCopy className="mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Full Referral Link</label>
                <div className="flex gap-3">
                  <Input
                    value={`${window.location.origin}/?ref=${referralCode}`}
                    readOnly
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={copyReferralLink}
                    variant="outline"
                    className="px-6"
                  >
                    <FaCopy className="mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={shareViaEmail}
                  className="flex-1 bg-[#514B3D] hover:bg-[#3f3a2f]"
                >
                  Share via Email
                </Button>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Join DearNeuro",
                        text: "Get ₹100 off your first order at DearNeuro!",
                        url: `${window.location.origin}/?ref=${referralCode}`
                      });
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Your Referral Stats</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="font-medium">Total Referrals</span>
                <span className="text-2xl font-bold text-[#514B3D]">{referralStats.totalReferrals}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="font-medium">Pending Rewards</span>
                <span className="text-2xl font-bold text-orange-600">{referralStats.pendingRewards} pts</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="font-medium">Total Rewards Earned</span>
                <span className="text-2xl font-bold text-green-600">{referralStats.totalRewards} pts</span>
              </div>

              <div className="mt-8 p-6 bg-[#514B3D]/5 rounded-xl">
                <h3 className="font-semibold mb-2">Reward Points Value</h3>
                <p className="text-sm text-gray-600">
                  100 points = ₹100 discount on your next order
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mt-12">
          <h2 className="text-2xl font-semibold mb-6">Terms & Conditions</h2>
          <div className="space-y-4 text-gray-600">
            <p>• Referral rewards are credited after the referred friend's first successful order.</p>
            <p>• The referred friend must be a new customer to DearNeuro.</p>
            <p>• Reward points expire after 12 months of inactivity.</p>
            <p>• Referral codes cannot be combined with other promotional offers.</p>
            <p>• DearNeuro reserves the right to modify or terminate the referral program at any time.</p>
            <p>• Fraudulent referrals will result in account suspension and forfeiture of rewards.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferFriend;