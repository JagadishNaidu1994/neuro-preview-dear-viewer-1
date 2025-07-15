import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  avatar_url: string | null;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  auto_renew: boolean;
  discount_percentage: number | null;
  plan: {
    name: string;
    price: number;
    description: string | null;
  };
}

interface PaymentMethod {
  id: string;
  user_id: string;
  card_type: string;
  last_four: string;
  expiry_date: string;
  is_default: boolean;
}

const getAvatarImage = (user: any) => {
  if (user?.avatar_url) return user.avatar_url;
  return null;
};

const PaymentMethodIcon = ({ type }: { type: string }) => {
  // Add your payment method icon logic here
  return <span className="text-sm font-medium">{type.toUpperCase()}</span>;
};

const AccountPage = () => {
  const { user, session, loading: userLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [editingSubscription, setEditingSubscription] = useState<
    Subscription | null
  >(null);
  const [subscriptionForm, setSubscriptionForm] = useState({
    auto_renew: false,
    discount: "",
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadSubscriptions();
      loadPaymentMethods();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.user_metadata) {
      setProfileForm({
        first_name: user.user_metadata.first_name || "",
        last_name: user.user_metadata.last_name || "",
        phone_number: user.user_metadata.phone_number || "",
        address: user.user_metadata.address || "",
        city: user.user_metadata.city || "",
        state: user.user_metadata.state || "",
        zip_code: user.user_metadata.zip_code || "",
      });
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone || null,
          address: null,
          city: null,
          state: null,
          zip_code: null,
          avatar_url: null,
        };
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadSubscriptions = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      const transformedData = (data || []).map(sub => ({
        id: sub.id,
        user_id: sub.user_id,
        plan_id: sub.product_id,
        start_date: sub.created_at,
        end_date: sub.next_delivery_date,
        status: sub.status,
        auto_renew: true,
        discount_percentage: sub.discount_percentage,
        plan: {
          name: 'Subscription Plan',
          price: 0,
          description: 'Product subscription'
        }
      }));
      setSubscriptions(transformedData);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    }
  };

  const loadPaymentMethods = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("user_payment_methods")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      const transformedData = (data || []).map(pm => ({
        id: pm.id,
        user_id: pm.user_id,
        card_type: pm.card_type,
        last_four: pm.card_last_four,
        expiry_date: `${pm.expiry_month}/${pm.expiry_year}`,
        is_default: pm.is_default
      }));
      setPaymentMethods(transformedData);
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          phone_number: profileForm.phone_number,
          address: profileForm.address,
          city: profileForm.city,
          state: profileForm.state,
          zip_code: profileForm.zip_code,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setEditingProfile(false);
      await loadProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionUpdate = async (subscriptionId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          ...updates,
        })
        .eq("id", subscriptionId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
      
      await loadSubscriptions();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      const { error } = await supabase
        .from("user_payment_methods")
        .delete()
        .eq("id", paymentMethodId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });
      
      await loadPaymentMethods();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      });
    }
  };

  if (userLoading) {
    return (
      <PageWrapper>
        <div className="text-center">Loading...</div>
      </PageWrapper>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <PageWrapper>
      <div className="container mx-auto py-8">
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader className="flex flex-col items-start space-y-2">
            <CardTitle className="text-2xl font-bold">
              Account Information
            </CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={getAvatarImage(user)} />
                <AvatarFallback>
                  {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </h3>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profileForm.first_name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      first_name: e.target.value,
                    })
                  }
                  disabled={!editingProfile}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profileForm.last_name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      last_name: e.target.value,
                    })
                  }
                  disabled={!editingProfile}
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={profileForm.phone_number}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      phone_number: e.target.value,
                    })
                  }
                  disabled={!editingProfile}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email} disabled />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  disabled={!editingProfile}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, city: e.target.value })
                  }
                  disabled={!editingProfile}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profileForm.state}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, state: e.target.value })
                  }
                  disabled={!editingProfile}
                />
              </div>
              <div>
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  value={profileForm.zip_code}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, zip_code: e.target.value })
                  }
                  disabled={!editingProfile}
                />
              </div>
            </div>
            <div className="flex justify-end">
              {editingProfile ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingProfile(false);
                      setProfileForm({
                        first_name: user.user_metadata?.first_name || "",
                        last_name: user.user_metadata?.last_name || "",
                        phone_number: user.user_metadata?.phone_number || "",
                        address: user.user_metadata?.address || "",
                        city: user.user_metadata?.city || "",
                        state: user.user_metadata?.state || "",
                        zip_code: user.user_metadata?.zip_code || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleProfileUpdate} disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setEditingProfile(true)}>
                  <FaEdit className="mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-md mt-8">
          <CardHeader className="flex flex-col items-start space-y-2">
            <CardTitle className="text-2xl font-bold">Subscriptions</CardTitle>
            <CardDescription>Manage your active subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {subscriptions.length === 0 ? (
              <p>No active subscriptions found.</p>
            ) : (
              subscriptions.map((subscription) => (
                <Card
                  key={subscription.id}
                  className="bg-gray-50 border border-gray-200 rounded-md"
                >
                  <CardHeader className="flex flex-col items-start space-y-1">
                    <CardTitle className="text-lg font-semibold">
                      {subscription.plan.name}
                    </CardTitle>
                    <CardDescription>
                      {subscription.plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label>Start Date</Label>
                        <p>
                          {new Date(subscription.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <p>
                          {subscription.end_date
                            ? new Date(subscription.end_date).toLocaleDateString()
                            : "Ongoing"}
                        </p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <p>{subscription.status}</p>
                      </div>
                      <div>
                        <Label>Price</Label>
                        <p>${subscription.plan.price}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <Label htmlFor="auto_renew">Auto Renew</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="auto_renew"
                          checked={subscription.auto_renew}
                          onChange={(e) => {
                            setEditingSubscription(subscription);
                            setSubscriptionForm({
                              auto_renew: e.target.checked,
                              discount:
                                subscription.discount_percentage?.toString() ||
                                "",
                            });
                            handleSubscriptionUpdate(subscription.id, {
                              status: subscription.status,
                            });
                          }}
                        />
                        <span>
                          {subscription.auto_renew ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    {editingSubscription?.id === subscription.id && (
                      <div className="border-t pt-4">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            id="discount"
                            value={subscriptionForm.discount}
                            onChange={(e) =>
                              setSubscriptionForm({
                                ...subscriptionForm,
                                discount: e.target.value,
                              })
                            }
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              handleSubscriptionUpdate(subscription.id, {
                                discount_percentage: parseFloat(subscriptionForm.discount),
                              });
                              setEditingSubscription(null);
                            }}
                          >
                            Update Discount
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-md mt-8">
          <CardHeader className="flex flex-col items-start space-y-2">
            <CardTitle className="text-2xl font-bold">
              Payment Methods
            </CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {paymentMethods.length === 0 ? (
              <p>No payment methods found.</p>
            ) : (
              paymentMethods.map((paymentMethod) => (
                <Card
                  key={paymentMethod.id}
                  className="bg-gray-50 border border-gray-200 rounded-md"
                >
                  <CardHeader className="flex flex-col items-start space-y-1">
                    <CardTitle className="text-lg font-semibold">
                      <PaymentMethodIcon type={paymentMethod.card_type} />
                    </CardTitle>
                    <CardDescription>
                      Card ending in {paymentMethod.last_four}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label>Expiry Date</Label>
                        <p>{paymentMethod.expiry_date}</p>
                      </div>
                      <div>
                        <Label>Default</Label>
                        <p>{paymentMethod.is_default ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default AccountPage;
