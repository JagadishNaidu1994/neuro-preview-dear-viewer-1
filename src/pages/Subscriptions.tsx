
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { FaBox, FaCalendar, FaPause, FaPlay, FaTrash, FaBrain, FaMemory, FaLightbulb } from "react-icons/fa";

const Subscriptions = () => {
  // Sample subscription data for brain supplements
  const subscriptions = [
    {
      id: "1",
      product: "Lion's Mane Focus Capsules",
      frequency: "Every 30 days",
      nextDelivery: "2025-02-15",
      price: 32.00,
      status: "active",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"
    },
    {
      id: "2",
      product: "Bacopa Memory Booster",
      frequency: "Every 45 days",
      nextDelivery: "2025-02-20",
      price: 28.00,
      status: "paused",
      image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-6 flex items-center gap-3">
            <FaBrain className="text-purple-600" />
            My Brain Health Subscriptions
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your recurring cognitive supplement deliveries and never run out of your brain-boosting essentials.
          </p>
        </div>

        {subscriptions.length > 0 ? (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
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
                    <div className="text-2xl font-semibold">₹{subscription.price.toFixed(2)}</div>
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
            <FaBrain className="mx-auto text-6xl text-purple-300 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No Active Subscriptions</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Set up a subscription to save 20% on your favorite brain supplements and never run out of cognitive support.
            </p>
            <Button
              onClick={() => window.location.href = "/shop-all"}
              className="bg-[#514B3D] hover:bg-[#3f3a2f]"
            >
              Browse Brain Supplements
            </Button>
          </div>
        )}

        {/* Subscription Benefits */}
        <div className="bg-white rounded-2xl p-10 shadow-sm mt-12">
          <h2 className="text-2xl font-semibold mb-8 text-center">Brain Health Subscription Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">20%</span>
              </div>
              <h3 className="font-semibold mb-2">Save on Every Order</h3>
              <p className="text-gray-600 text-sm">Get 20% off your brain supplement subscriptions automatically</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendar className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">Choose delivery frequency that matches your cognitive routine</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPause className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Easy Management</h3>
              <p className="text-gray-600 text-sm">Pause, modify, or cancel your brain supplement deliveries anytime</p>
            </div>
          </div>
        </div>

        {/* Brain Health Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-10 mt-12">
          <h2 className="text-2xl font-semibold mb-8 text-center">Why Consistent Brain Support Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMemory className="text-purple-700 text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Memory Enhancement</h3>
              <p className="text-gray-600 text-sm">Regular supplementation supports long-term memory formation and recall</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-blue-700 text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Sustained Focus</h3>
              <p className="text-gray-600 text-sm">Consistent intake helps maintain optimal cognitive performance throughout the day</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBrain className="text-green-700 text-xl" />
              </div>
              <h3 className="font-semibold mb-2">Neuroprotection</h3>
              <p className="text-gray-600 text-sm">Long-term brain health support with antioxidants and neuroprotective compounds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
