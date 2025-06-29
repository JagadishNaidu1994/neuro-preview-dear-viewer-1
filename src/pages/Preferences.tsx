import { useState } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    emailMarketing: true,
    smsMarketing: false,
    orderUpdates: true,
    productRecommendations: true,
    weeklyNewsletter: true,
    specialOffers: true,
    birthdayReminders: true,
    stockAlerts: false,
  });

  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // In a real app, you'd save these preferences to your backend
    console.log("Saving preferences:", preferences);
    alert("Preferences saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-semibold mb-8">Communication Preferences</h1>
          
          <div className="space-y-8">
            {/* Email Preferences */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Email Communications</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailMarketing" className="text-base font-medium">
                      Marketing Emails
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive emails about new products, promotions, and wellness tips
                    </p>
                  </div>
                  <Switch
                    id="emailMarketing"
                    checked={preferences.emailMarketing}
                    onCheckedChange={() => handleToggle('emailMarketing')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates" className="text-base font-medium">
                      Order Updates
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Essential emails about your orders and shipping
                    </p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={preferences.orderUpdates}
                    onCheckedChange={() => handleToggle('orderUpdates')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="productRecommendations" className="text-base font-medium">
                      Product Recommendations
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Personalized product suggestions based on your preferences
                    </p>
                  </div>
                  <Switch
                    id="productRecommendations"
                    checked={preferences.productRecommendations}
                    onCheckedChange={() => handleToggle('productRecommendations')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyNewsletter" className="text-base font-medium">
                      Weekly Newsletter
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Weekly wellness insights and cognitive health tips
                    </p>
                  </div>
                  <Switch
                    id="weeklyNewsletter"
                    checked={preferences.weeklyNewsletter}
                    onCheckedChange={() => handleToggle('weeklyNewsletter')}
                  />
                </div>
              </div>
            </div>

            {/* SMS Preferences */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-6">SMS Communications</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsMarketing" className="text-base font-medium">
                      SMS Marketing
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive text messages about exclusive offers and updates
                    </p>
                  </div>
                  <Switch
                    id="smsMarketing"
                    checked={preferences.smsMarketing}
                    onCheckedChange={() => handleToggle('smsMarketing')}
                  />
                </div>
              </div>
            </div>

            {/* Special Preferences */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-6">Special Notifications</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="specialOffers" className="text-base font-medium">
                      Special Offers
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Be the first to know about sales and limited-time offers
                    </p>
                  </div>
                  <Switch
                    id="specialOffers"
                    checked={preferences.specialOffers}
                    onCheckedChange={() => handleToggle('specialOffers')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="birthdayReminders" className="text-base font-medium">
                      Birthday Rewards
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive special birthday discounts and rewards
                    </p>
                  </div>
                  <Switch
                    id="birthdayReminders"
                    checked={preferences.birthdayReminders}
                    onCheckedChange={() => handleToggle('birthdayReminders')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stockAlerts" className="text-base font-medium">
                      Stock Alerts
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Get notified when out-of-stock items are available again
                    </p>
                  </div>
                  <Switch
                    id="stockAlerts"
                    checked={preferences.stockAlerts}
                    onCheckedChange={() => handleToggle('stockAlerts')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-8 mt-8 border-t">
            <Button
              onClick={handleSave}
              className="bg-[#514B3D] hover:bg-[#3f3a2f]"
            >
              Save Preferences
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;