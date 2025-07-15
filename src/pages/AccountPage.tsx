import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, CreditCard, Package, Settings, User, Shield, Gift, Star, Bell } from "lucide-react";

interface Subscription {
  id?: string;
  created_at?: string;
  product_id?: string;
  user_id?: string;
  quantity?: number;
  frequency?: string;
  frequency_weeks?: number;
  next_delivery_date?: string;
  status?: string;
  updated_at?: string;
  discount_percentage?: number;
}

export default function AccountPage() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState("monthly");
  const [frequencyWeeks, setFrequencyWeeks] = useState(4);
  const [nextDeliveryDate, setNextDeliveryDate] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setSubscriptions(data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error fetching subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setQuantity(subscription.quantity || 1);
    setFrequency(subscription.frequency || "monthly");
    setFrequencyWeeks(subscription.frequency_weeks || 4);
    setNextDeliveryDate(subscription.next_delivery_date || "");
    setDiscountPercentage(subscription.discount_percentage || 0);
  };

  const handleUpdateSubscription = async (subscriptionId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          ...updates,
          discount_percentage: updates.discount_percentage || updates.discount // Fix: use discount_percentage instead of discount
        })
        .eq("id", subscriptionId);

      if (error) throw error;
      toast({
        title: "Subscription updated successfully",
      });
      fetchSubscriptions();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error updating subscription",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", subscriptionId);

      if (error) throw error;
      toast({
        title: "Subscription cancelled successfully",
      });
      fetchSubscriptions();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error cancelling subscription",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Your Account</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList>
                    <TabsTrigger value="profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="subscriptions">
                      <Package className="mr-2 h-4 w-4" />
                      Subscriptions
                    </TabsTrigger>
                    <TabsTrigger value="billing">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>View and update your personal details.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="John Doe" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue="john.doe@example.com" disabled />
                        </div>
                        <Button>Update Profile</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="subscriptions">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Subscriptions</CardTitle>
                        <CardDescription>Manage your active subscriptions.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div>Loading subscriptions...</div>
                        ) : subscriptions.length === 0 ? (
                          <div>No active subscriptions found.</div>
                        ) : (
                          <div className="grid gap-4">
                            {subscriptions.map((subscription) => (
                              <div
                                key={subscription.id}
                                className="border rounded-md p-4 cursor-pointer hover:shadow-md transition-shadow duration-300"
                                onClick={() => handleSubscriptionClick(subscription)}
                              >
                                <h3 className="text-lg font-semibold">Subscription ID: {subscription.id}</h3>
                                <p>Product ID: {subscription.product_id}</p>
                                <p>Quantity: {subscription.quantity}</p>
                                <p>Frequency: {subscription.frequency}</p>
                                <p>Next Delivery: {subscription.next_delivery_date}</p>
                                <Badge variant="secondary">{subscription.status}</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {selectedSubscription && (
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle>Edit Subscription</CardTitle>
                          <CardDescription>Update your subscription details.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <select
                              id="frequency"
                              className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                              value={frequency}
                              onChange={(e) => setFrequency(e.target.value)}
                            >
                              <option value="weekly">Weekly</option>
                              <option value="biweekly">Bi-Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          {frequency === "biweekly" && (
                            <div className="space-y-2">
                              <Label htmlFor="frequencyWeeks">Frequency Weeks</Label>
                              <Input
                                id="frequencyWeeks"
                                type="number"
                                value={frequencyWeeks}
                                onChange={(e) => setFrequencyWeeks(Number(e.target.value))}
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="nextDeliveryDate">Next Delivery Date</Label>
                            <Input
                              id="nextDeliveryDate"
                              type="date"
                              value={nextDeliveryDate}
                              onChange={(e) => setNextDeliveryDate(e.target.value)}
                            />
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor="discountPercentage">Discount Percentage</Label>
                            <Input
                              id="discountPercentage"
                              type="number"
                              value={discountPercentage}
                              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                            />
                          </div>
                          <Button
                            onClick={() =>
                              handleUpdateSubscription(selectedSubscription.id as string, {
                                quantity: quantity,
                                frequency: frequency,
                                frequency_weeks: frequencyWeeks,
                                next_delivery_date: nextDeliveryDate,
                                discount_percentage: discountPercentage
                              })
                            }
                          >
                            Update Subscription
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelSubscription(selectedSubscription.id as string)}
                          >
                            Cancel Subscription
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  <TabsContent value="billing">
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>View your billing details and payment history.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>No billing information available.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="settings">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account settings and preferences.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>No settings available.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
