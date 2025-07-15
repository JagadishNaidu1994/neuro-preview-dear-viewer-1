import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { FaBox, FaCalendar, FaPause, FaPlay, FaTrash } from "react-icons/fa";

const Subscriptions = () => {
  // Sample subscription data
  const subscriptions = [
    {
      id: "1",
      product: "Focus Mushroom Gummy Delights",
      frequency: "Every 30 days",
      nextDelivery: "2025-02-15",
      price: 32.00,
      status: "active",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da"
    },
    {
      id: "2",
      product: "Chill Mushroom Gummy Delights",
      frequency: "Every 45 days",
      nextDelivery: "2025-02-20",
      price: 32.00,
      status: "paused",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-6">My Subscriptions</h1>
          <p className="text-gray-600 text-lg">
            Manage your recurring orders and never run out of your favorite products.
          </p>
        </div>

        {subscriptions.length > 0 ? (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={subscription.image}
                      alt={subscription.product}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{subscription.product}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaCalendar className="mr-2" />
                          {subscription.frequency}
                        </div>
                        <div className="flex items-center">
                          <FaBox className="mr-2" />
                          Next: {new Date(subscription.nextDelivery).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subscription.status === 'active' ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end space-y-4">
                    <div className="text-2xl font-semibold">${subscription.price.toFixed(2)}</div>
                    <div className="flex space-x-3">
                      {subscription.status === 'active' ? (
                        <Button size="sm" variant="outline">
                          <FaPause className="mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <FaPlay className="mr-2" />
                          Resume
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        <FaTrash className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 shadow-sm text-center">
            <FaBox className="mx-auto text-6xl text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No Active Subscriptions</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Set up a subscription to save 15% on your favorite products and never run out.
            </p>
            <Button
              onClick={() => window.location.href = "/shop-all"}
              className="bg-[#514B3D] hover:bg-[#3f3a2f]"
            >
              Browse Products
            </Button>
          </div>
        )}

        {/* Subscription Benefits */}
        <div className="bg-white rounded-2xl p-10 shadow-sm mt-12">
          <h2 className="text-2xl font-semibold mb-8">Subscription Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#514B3D] text-2xl font-bold">15%</span>
              </div>
              <h3 className="font-semibold mb-2">Save on Every Order</h3>
              <p className="text-gray-600 text-sm">Get 15% off your subscription orders automatically</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendar className="text-[#514B3D] text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">Choose delivery frequency that works for you</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPause className="text-[#514B3D] text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Easy Management</h3>
              <p className="text-gray-600 text-sm">Pause, modify, or cancel anytime with no fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;