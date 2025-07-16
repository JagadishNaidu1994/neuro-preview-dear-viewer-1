import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FaBox, FaCalendar, FaPause, FaPlay, FaTrash, FaEdit, FaCreditCard, FaForward } from "react-icons/fa";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  frequency_weeks: number;
  status: string;
  next_delivery_date: string | null;
  discount_percentage: number | null;
  skipped_deliveries: any;
  created_at: string;
  product: {
    name: string;
    price: number;
    image_url: string;
  };
}

const Subscriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [newFrequency, setNewFrequency] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: subscriptionsData, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          product:products(name, price, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(subscriptionsData || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePauseResume = async (subscriptionId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', subscriptionId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Subscription ${newStatus === 'active' ? 'resumed' : 'paused'} successfully`,
      });
      
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const handleSkipDelivery = async (subscriptionId: string) => {
    try {
      const subscription = subscriptions.find(s => s.id === subscriptionId);
      if (!subscription) return;

      const currentSkipped = Array.isArray(subscription.skipped_deliveries) ? subscription.skipped_deliveries : [];
      const nextSkipDate = new Date();
      nextSkipDate.setDate(nextSkipDate.getDate() + subscription.frequency_weeks * 7);

      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          skipped_deliveries: [...currentSkipped, nextSkipDate.toISOString()],
          next_delivery_date: new Date(nextSkipDate.getTime() + (subscription.frequency_weeks * 7 * 24 * 60 * 60 * 1000)).toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Next delivery skipped successfully",
      });
      
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error skipping delivery:', error);
      toast({
        title: "Error",
        description: "Failed to skip delivery",
        variant: "destructive",
      });
    }
  };

  const handleEditFrequency = async () => {
    if (!selectedSubscription || !newFrequency) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ frequency_weeks: parseInt(newFrequency) })
        .eq('id', selectedSubscription.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Subscription frequency updated successfully",
      });
      
      setEditDialogOpen(false);
      setSelectedSubscription(null);
      setNewFrequency("");
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error updating frequency:', error);
      toast({
        title: "Error",
        description: "Failed to update frequency",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Subscription cancelled successfully",
      });
      
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const getFrequencyText = (weeks: number) => {
    if (weeks === 1) return "Weekly";
    if (weeks === 2) return "Bi-weekly";
    if (weeks === 4) return "Monthly";
    if (weeks === 8) return "Every 2 months";
    if (weeks === 12) return "Every 3 months";
    return `Every ${weeks} weeks`;
  };

  const calculateDiscountedPrice = (price: number, discount: number | null) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">Loading subscriptions...</div>
        </div>
      </div>
    );
  }

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
            {subscriptions.filter(sub => sub.status !== 'cancelled').map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={subscription.product.image_url}
                      alt={subscription.product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{subscription.product.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaCalendar className="mr-2" />
                          {getFrequencyText(subscription.frequency_weeks)}
                        </div>
                        <div className="flex items-center">
                          <FaBox className="mr-2" />
                          Qty: {subscription.quantity}
                        </div>
                        {subscription.next_delivery_date && (
                          <div className="flex items-center">
                            <FaCalendar className="mr-2" />
                            Next: {new Date(subscription.next_delivery_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status === 'active' ? 'Active' : 'Paused'}
                        </Badge>
                        {subscription.discount_percentage && (
                          <Badge variant="outline">
                            {subscription.discount_percentage}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end space-y-4">
                    <div className="text-2xl font-semibold">
                      ₹{calculateDiscountedPrice(subscription.product.price, subscription.discount_percentage).toFixed(2)}
                      {subscription.discount_percentage && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{subscription.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePauseResume(subscription.id, subscription.status)}
                      >
                        {subscription.status === 'active' ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                        {subscription.status === 'active' ? 'Pause' : 'Resume'}
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSkipDelivery(subscription.id)}
                        disabled={subscription.status !== 'active'}
                      >
                        <FaForward className="mr-2" />
                        Skip Next
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          setNewFrequency(subscription.frequency_weeks.toString());
                          setEditDialogOpen(true);
                        }}
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleCancel(subscription.id)}
                      >
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

      {/* Edit Frequency Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription Frequency</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSubscription && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedSubscription.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current frequency: {getFrequencyText(selectedSubscription.frequency_weeks)}
                </p>
              </div>
            )}
            <Select value={newFrequency} onValueChange={setNewFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select new frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Weekly</SelectItem>
                <SelectItem value="2">Bi-weekly</SelectItem>
                <SelectItem value="4">Monthly</SelectItem>
                <SelectItem value="8">Every 2 months</SelectItem>
                <SelectItem value="12">Every 3 months</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditFrequency}>
                Update Frequency
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;