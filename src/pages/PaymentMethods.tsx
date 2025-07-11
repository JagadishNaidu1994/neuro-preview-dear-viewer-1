
import { useState } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus, FaEdit, FaTrash, FaCreditCard, FaPaypal, FaGooglePay, FaAmazon } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "upi" | "netbanking";
  last4?: string;
  brand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  email?: string;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
}

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
    },
    {
      id: "2",
      type: "upi",
      upiId: "user@paytm",
      isDefault: false,
    },
    {
      id: "3",
      type: "netbanking",
      bankName: "State Bank of India",
      isDefault: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState("card");

  const getPaymentIcon = (type: string, brand?: string) => {
    if (type === "paypal") return <FaPaypal className="text-blue-600 text-2xl" />;
    if (type === "upi") return <FaGooglePay className="text-green-600 text-2xl" />;
    if (type === "netbanking") return <FaAmazon className="text-orange-600 text-2xl" />;
    return <FaCreditCard className="text-[#514B3D] text-2xl" />;
  };

  const getPaymentDisplay = (method: PaymentMethod) => {
    if (method.type === "card") return `${method.brand} •••• ${method.last4}`;
    if (method.type === "upi") return `UPI - ${method.upiId}`;
    if (method.type === "netbanking") return `Net Banking - ${method.bankName}`;
    return "PayPal";
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setSelectedPaymentType(method.type);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(methods => methods.filter(method => method.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => methods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleAddNew = () => {
    setEditingMethod(null);
    setSelectedPaymentType("card");
    setShowForm(true);
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
              Manage your payment methods for faster and secure checkout.
            </p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-[#514B3D] hover:bg-[#3f3a2f]"
          >
            <FaPlus className="mr-2" />
            Add Payment Method
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {getPaymentIcon(method.type, method.brand)}
                  <div>
                    <h3 className="font-semibold">
                      {getPaymentDisplay(method)}
                    </h3>
                    {method.isDefault && (
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
                {method.type === "card" && (
                  <p>Expires {method.expiryMonth}/{method.expiryYear}</p>
                )}
                {method.type === "upi" && (
                  <p>UPI ID: {method.upiId}</p>
                )}
                {method.type === "netbanking" && (
                  <p>Bank: {method.bankName}</p>
                )}
              </div>

              {!method.isDefault && (
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

        {/* Add Payment Method Modal */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? "Edit Payment Method" : "Add New Payment Method"}
              </DialogTitle>
            </DialogHeader>
            
            <form className="space-y-6">
              <div>
                <Label htmlFor="type">Payment Type</Label>
                <select
                  id="type"
                  value={selectedPaymentType}
                  onChange={(e) => setSelectedPaymentType(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {selectedPaymentType === "card" && (
                <>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {selectedPaymentType === "upi" && (
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    className="mt-2"
                  />
                </div>
              )}

              {selectedPaymentType === "netbanking" && (
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <select
                    id="bankName"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
                  >
                    <option value="">Select Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-[#514B3D] hover:bg-[#3f3a2f]"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Payment method would be added in a real implementation!");
                    setShowForm(false);
                  }}
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
          </DialogContent>
        </Dialog>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-2xl p-8">
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
