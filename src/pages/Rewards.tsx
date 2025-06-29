import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { FaGift, FaStar, FaUsers, FaShoppingCart } from "react-icons/fa";

const Rewards = () => {
  const { user } = useAuth();
  const [rewardData, setRewardData] = useState({
    totalPoints: 750,
    availableRewards: 650,
    pendingPoints: 100,
    referralPoints: 300,
    purchasePoints: 450
  });

  const rewardTiers = [
    { name: "Bronze", minPoints: 0, benefits: ["5% off orders", "Early access to sales"] },
    { name: "Silver", minPoints: 500, benefits: ["10% off orders", "Free shipping", "Birthday rewards"] },
    { name: "Gold", minPoints: 1000, benefits: ["15% off orders", "Priority support", "Exclusive products"] },
    { name: "Platinum", minPoints: 2000, benefits: ["20% off orders", "Personal wellness consultant", "VIP events"] }
  ];

  const getCurrentTier = () => {
    for (let i = rewardTiers.length - 1; i >= 0; i--) {
      if (rewardData.totalPoints >= rewardTiers[i].minPoints) {
        return { ...rewardTiers[i], index: i };
      }
    }
    return { ...rewardTiers[0], index: 0 };
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    if (currentTier.index < rewardTiers.length - 1) {
      return rewardTiers[currentTier.index + 1];
    }
    return null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Please sign in to view rewards</h1>
          <button
            onClick={() => window.location.href = "/"}
            className="px-8 py-3 bg-[#514B3D] text-white rounded-xl hover:bg-[#3f3a2f] transition-colors font-medium"
          >
            Go to Home
          </button>
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
            Rewards Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Earn points with every purchase and referral. Unlock exclusive benefits and discounts.
          </p>
        </div>

        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaStar className="text-[#514B3D] text-2xl" />
            </div>
            <h3 className="text-3xl font-bold mb-2 text-[#514B3D]">{rewardData.totalPoints}</h3>
            <p className="text-gray-600">Total Points Earned</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGift className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-3xl font-bold mb-2 text-green-600">{rewardData.availableRewards}</h3>
            <p className="text-gray-600">Available to Redeem</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-orange-600 text-2xl" />
            </div>
            <h3 className="text-3xl font-bold mb-2 text-orange-600">{rewardData.pendingPoints}</h3>
            <p className="text-gray-600">Pending Points</p>
          </div>
        </div>

        {/* Current Tier Status */}
        <div className="bg-white rounded-2xl p-10 shadow-sm mb-12">
          <h2 className="text-3xl font-semibold mb-8">Your Status: {currentTier.name}</h2>
          
          {nextTier && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Progress to {nextTier.name}</span>
                <span className="font-semibold">
                  {rewardData.totalPoints} / {nextTier.minPoints} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-[#514B3D] h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((rewardData.totalPoints / nextTier.minPoints) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {nextTier.minPoints - rewardData.totalPoints} points until {nextTier.name}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4">Your Current Benefits:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTier.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#514B3D] rounded-full"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white rounded-2xl p-10 shadow-sm mb-12">
          <h2 className="text-3xl font-semibold mb-8">How to Earn Points</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingCart className="text-[#514B3D] text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Make Purchases</h3>
              <p className="text-gray-600 text-sm">Earn 1 point for every $1 spent</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-[#514B3D] text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Refer Friends</h3>
              <p className="text-gray-600 text-sm">Get 100 points per successful referral</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-[#514B3D] text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Write Reviews</h3>
              <p className="text-gray-600 text-sm">Earn 25 points for each product review</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGift className="text-[#514B3D] text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Birthday Bonus</h3>
              <p className="text-gray-600 text-sm">Get 50 points on your birthday</p>
            </div>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Points History */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Points Breakdown</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FaShoppingCart className="text-[#514B3D]" />
                  <span>Purchase Points</span>
                </div>
                <span className="font-semibold">{rewardData.purchasePoints} pts</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FaUsers className="text-[#514B3D]" />
                  <span>Referral Points</span>
                </div>
                <span className="font-semibold">{rewardData.referralPoints} pts</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FaStar className="text-[#514B3D]" />
                  <span>Review Points</span>
                </div>
                <span className="font-semibold">0 pts</span>
              </div>
            </div>
          </div>

          {/* Redeem Points */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Redeem Points</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-xl">
                <div>
                  <p className="font-medium">$5 Off Coupon</p>
                  <p className="text-sm text-gray-600">500 points</p>
                </div>
                <button 
                  className="px-4 py-2 bg-[#514B3D] text-white rounded-lg hover:bg-[#3f3a2f] transition-colors"
                  disabled={rewardData.availableRewards < 500}
                >
                  Redeem
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-xl">
                <div>
                  <p className="font-medium">$10 Off Coupon</p>
                  <p className="text-sm text-gray-600">1000 points</p>
                </div>
                <button 
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  disabled={rewardData.availableRewards < 1000}
                >
                  Redeem
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-xl">
                <div>
                  <p className="font-medium">$25 Off Coupon</p>
                  <p className="text-sm text-gray-600">2500 points</p>
                </div>
                <button 
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  disabled={rewardData.availableRewards < 2500}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="bg-white rounded-2xl p-10 shadow-sm mt-12">
          <h2 className="text-3xl font-semibold mb-8">Membership Tiers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardTiers.map((tier, index) => (
              <div 
                key={tier.name}
                className={`p-6 rounded-xl border-2 ${
                  tier.name === currentTier.name 
                    ? 'border-[#514B3D] bg-[#514B3D]/5' 
                    : 'border-gray-200'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.minPoints}+ points</p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="text-sm text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-[#514B3D] rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;