
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FaPlus, FaEdit, FaTrash, FaCreditCard, FaPaypal, FaGooglePay } from "react-icons/fa";

interface PaymentMethod {
  id: string;
  card_type: string;
  card_last_four: string;
  card_holder_name: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

const PaymentMethods = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    card_type: "Visa",
    card_number: "",
    card_holder_name: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    is_default: false
  });

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from("user_payment_methods")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_default", { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payment methods",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "paypal":
        return <FaPaypal className="text-blue-600 text-2xl" />;
      case "google pay":
        return <FaGooglePay className="text-green-600 text-2xl" />;
      default:
        return <FaCreditCard className="text-[#514B3D] text-2xl" />;
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      card_type: method.card_type,
      card_number: `****${method.card_last_four}`,
      card_holder_name: method.card_holder_name,
      expiry_month: method.expiry_month.toString().padStart(2, '0'),
      expiry_year: method.expiry_year.toString(),
      cvv: "",
      is_default: method.is_default
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const { error } = await supabase
        .from("user_payment_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment method deleted successfully"
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, unset all default payment methods
      await supabase
        .from("user_payment_methods")
        .update({ is_default: false })
        .eq("user_id", user?.id);

      // Then set the selected payment method as default
      const { error } = await supabase
        .from("user_payment_methods")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Default payment method updated"
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast({
        title: "Error",
        description: "Failed to update default payment method",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const paymentData = {
        card_type: formData.card_type,
        card_last_four: formData.card_number.slice(-4),
        card_holder_name: formData.card_holder_name,
        expiry_month: parseInt(formData.expiry_month),
        expiry_year: parseInt(formData.expiry_year),
        is_default: formData.is_default,
        user_id: user.id
      };

      if (formData.is_default) {
        // Unset all other default payment methods first
        await supabase
          .from("user_payment_methods")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (editingMethod) {
        // Update existing payment method
        const { error } = await supabase
          .from("user_payment_methods")
          .update(paymentData)
          .eq("id", editingMethod.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Payment method updated successfully"
        });
      } else {
        // Create new payment method
        const { error } = await supabase
          .from("user_payment_methods")
          .insert([paymentData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Payment method added successfully"
        });
      }

      setShowForm(false);
      setEditingMethod(null);
      setFormData({
        card_type: "Visa",
        card_number: "",
        card_holder_name: "",
        expiry_month: "",
        expiry_year: "",
        cvv: "",
        is_default: false
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#514B3D]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-semibold mb-4">Payment Methods</h1>
            <p className="text-gray-600 text-lg">
              Manage your payment methods for faster and secure checkout.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingMethod(null);
              setFormData({
                card_type: "Visa",
                card_number: "",
                card_holder_name: "",
                expiry_month: "",
                expiry_year: "",
                cvv: "",
                is_default: false
              });
              setShowForm(true);
            }}
            className="bg-[#514B3D] hover:bg-[#3f3a2f]"
          >
            <FaPlus className="mr-2" />
            Add Payment Method
          </Button>
        </div>

        {!showForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {getPaymentIcon(method.card_type)}
                    <div>
                      <h3 className="font-semibold">
                        {method.card_type === "PayPal" 
                          ? "PayPal"
                          : `${method.card_type} •••• ${method.card_last_four}`
                        }
                      </h3>
                      {method.is_default && (
                        <span className="text-xs bg-[#514B3D] text-white px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(method)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(method.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600">
                  {method.card_type !== "PayPal" ? (
                    <p>Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}</p>
                  ) : (
                    <p>{method.card_holder_name}</p>
                  )}
                </div>

                {!method.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                    className="mt-4"
                  >
                    Set as Default
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-semibold mb-8">
              {editingMethod ? "Edit Payment Method" : "Add New Payment Method"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="card_type">Payment Type</Label>
                <select
                  id="card_type"
                  value={formData.card_type}
                  onChange={(e) => setFormData({...formData, card_type: e.target.value})}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Google Pay">Google Pay</option>
                </select>
              </div>

              <div>
                <Label htmlFor="card_number">Card Number</Label>
                <Input
                  id="card_number"
                  placeholder="1234 5678 9012 3456"
                  value={formData.card_number}
                  onChange={(e) => setFormData({...formData, card_number: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry_month">Expiry Month</Label>
                  <Input
                    id="expiry_month"
                    placeholder="MM"
                    value={formData.expiry_month}
                    onChange={(e) => setFormData({...formData, expiry_month: e.target.value})}
                    required
                    className="mt-2"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_year">Expiry Year</Label>
                  <Input
                    id="expiry_year"
                    placeholder="YYYY"
                    value={formData.expiry_year}
                    onChange={(e) => setFormData({...formData, expiry_year: e.target.value})}
                    required
                    className="mt-2"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                  required
                  className="mt-2"
                  maxLength={4}
                />
              </div>

              <div>
                <Label htmlFor="card_holder_name">Name on Card</Label>
                <Input
                  id="card_holder_name"
                  placeholder="John Doe"
                  value={formData.card_holder_name}
                  onChange={(e) => setFormData({...formData, card_holder_name: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({...formData, is_default: checked as boolean})}
                />
                <Label htmlFor="is_default">Set as default payment method</Label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-[#514B3D] hover:bg-[#3f3a2f]"
                >
                  {editingMethod ? "Update Payment Method" : "Add Payment Method"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-2xl p-8 mt-12">
          <h3 className="font-semibold mb-4 text-blue-800">Security & Privacy</h3>
          <div className="text-blue-700 text-sm space-y-2">
            <p>• All payment information is encrypted and securely stored</p>
            <p>• We never store your full credit card number or CVV</p>
            <p>• Your payment data is processed by our secure payment partners</p>
            <p>• You can remove payment methods at any time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
