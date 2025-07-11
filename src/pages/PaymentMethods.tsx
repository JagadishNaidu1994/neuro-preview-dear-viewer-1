
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus, FaEdit, FaTrash, FaCreditCard } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  card_holder_name: string;
  card_last_four: string;
  card_type: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

const PaymentMethods = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    card_holder_name: "",
    card_number: "",
    card_last_four: "",
    card_type: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    is_default: false,
  });

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment methods:", error);
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive",
      });
    } else {
      setPaymentMethods(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let processedValue = value;
    
    // Process card number to extract last 4 digits and determine card type
    if (name === "card_number") {
      const cleanNumber = value.replace(/\D/g, "");
      processedValue = cleanNumber.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      
      // Update last four digits
      setFormData(prev => ({
        ...prev,
        card_last_four: cleanNumber.slice(-4),
        card_type: getCardType(cleanNumber),
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));
  };

  const getCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\D/g, "");
    if (cleanNumber.startsWith("4")) return "Visa";
    if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2")) return "Mastercard";
    if (cleanNumber.startsWith("3")) return "American Express";
    return "Unknown";
  };

  const resetForm = () => {
    setFormData({
      card_holder_name: "",
      card_number: "",
      card_last_four: "",
      card_type: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
      is_default: false,
    });
    setEditingMethod(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // If setting as default, update all others to non-default first
      if (formData.is_default) {
        await supabase
          .from("user_payment_methods")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      const paymentData = {
        card_holder_name: formData.card_holder_name,
        card_last_four: formData.card_last_four,
        card_type: formData.card_type,
        expiry_month: parseInt(formData.expiry_month),
        expiry_year: parseInt(formData.expiry_year),
        is_default: formData.is_default,
        user_id: user.id,
      };

      if (editingMethod) {
        // Update existing payment method
        const { error } = await supabase
          .from("user_payment_methods")
          .update(paymentData)
          .eq("id", editingMethod.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Payment method updated successfully",
        });
      } else {
        // Create new payment method
        const { error } = await supabase
          .from("user_payment_methods")
          .insert([paymentData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Payment method added successfully",
        });
      }

      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      card_holder_name: method.card_holder_name,
      card_number: `**** **** **** ${method.card_last_four}`,
      card_last_four: method.card_last_four,
      card_type: method.card_type,
      expiry_month: method.expiry_month.toString(),
      expiry_year: method.expiry_year.toString(),
      cvv: "",
      is_default: method.is_default,
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
        description: "Payment method deleted successfully",
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, set all payment methods to non-default
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
        description: "Default payment method updated",
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast({
        title: "Error",
        description: "Failed to update default payment method",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-semibold mb-4">Payment Methods</h1>
            <p className="text-gray-600 text-lg">
              Manage your payment methods for faster checkout.
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
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
            {paymentMethods.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No payment methods found</p>
                <p className="text-gray-400">Add your first payment method to get started</p>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div key={method.id} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <FaCreditCard className="text-[#514B3D]" />
                      <div>
                        <h3 className="font-semibold">{method.card_type}</h3>
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
                    <p className="font-medium text-gray-900">{method.card_holder_name}</p>
                    <p>**** **** **** {method.card_last_four}</p>
                    <p>Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}</p>
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
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-semibold mb-8">
              {editingMethod ? "Edit Payment Method" : "Add New Payment Method"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="card_holder_name">Cardholder Name</Label>
                <Input
                  id="card_holder_name"
                  name="card_holder_name"
                  value={formData.card_holder_name}
                  onChange={handleInputChange}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="card_number">Card Number</Label>
                <Input
                  id="card_number"
                  name="card_number"
                  value={formData.card_number}
                  onChange={handleInputChange}
                  className="mt-2"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required={!editingMethod}
                  disabled={!!editingMethod}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiry_month">Month</Label>
                  <select
                    id="expiry_month"
                    name="expiry_month"
                    value={formData.expiry_month}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="expiry_year">Year</Label>
                  <select
                    id="expiry_year"
                    name="expiry_year"
                    value={formData.expiry_year}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
                    required
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="mt-2"
                    placeholder="123"
                    maxLength={4}
                    required={!editingMethod}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="is_default">Set as default payment method</Label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#514B3D] hover:bg-[#3f3a2f]"
                >
                  {loading ? "Saving..." : (editingMethod ? "Update Payment Method" : "Add Payment Method")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
