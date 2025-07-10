
import React from "react";
import { ArrowLeft, MoreHorizontal, MapPin, Package, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_email?: string;
  shipping_address?: any;
}

interface DetailedOrderViewProps {
  order: Order | null;
  onBack: () => void;
}

const DetailedOrderView = ({ order, onBack }: DetailedOrderViewProps) => {
  if (!order) return null;

  const generateOrderNumber = (orderId: string, createdAt: string) => {
    const date = new Date(createdAt);
    const timestamp = Math.floor(date.getTime() / 1000);
    const orderNum = timestamp.toString().slice(-6);
    return String(parseInt(orderNum) % 1000000).padStart(6, '0');
  };

  const orderNumber = generateOrderNumber(order.id, order.created_at);
  const orderDate = new Date(order.created_at);

  const mockItems = [
    { id: 1, name: "Fabrikam - FabGuide No. 1 Backpack, Fits 15 Laptops", qty: 1, price: 109.95, image: "/api/placeholder/60/60" },
    { id: 2, name: "Fabrikam - FabGuide No. 1 Backpack, Fits 15 Laptops", qty: 1, price: 109.95, image: "/api/placeholder/60/60" },
    { id: 3, name: "Fabrikam - FabGuide No. 1 Backpack, Fits 15 Laptops", qty: 1, price: 109.95, image: "/api/placeholder/60/60" },
    { id: 4, name: "Fabrikam - FabGuide No. 1 Backpack, Fits 15 Laptops", qty: 1, price: 109.95, image: "/api/placeholder/60/60" }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-color-2 text-color-8';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-color-2">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-color-12">Order Number #{orderNumber}</h1>
            <div className="flex items-center space-x-4 text-sm text-color-5 mt-1">
              <span>Order Created</span>
              <span>{orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>{orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <select className="bg-color-2 border border-color-3 rounded px-3 py-1 text-sm">
            <option>Mark As Picked</option>
            <option>Mark As Shipped</option>
            <option>Mark As Delivered</option>
            <option>Cancel Order</option>
          </select>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Customer Details */}
            <div className="bg-white rounded-lg border border-color-2 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-color-12">Customer Details</h3>
                <MapPin className="h-4 w-4 text-color-4" />
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-color-5">Name</span>
                  <p className="text-color-12">{order.shipping_address?.name || 'Customer Name'}</p>
                </div>
                <div>
                  <span className="text-color-5">Email</span>
                  <p className="text-color-12">{order.user_email || 'customer@example.com'}</p>
                </div>
                <div>
                  <span className="text-color-5">Phone</span>
                  <p className="text-color-12">{order.shipping_address?.phone || '+1 234 567-890'}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border border-color-2 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-color-12">Delivery Address</h3>
                <MapPin className="h-4 w-4 text-color-4" />
              </div>
              <div className="text-sm text-color-12">
                <p>{order.shipping_address?.address_line_1 || '14 Mockingbird Road'}</p>
                <p>{order.shipping_address?.city || 'City'}, {order.shipping_address?.state || 'State'}</p>
                <p>{order.shipping_address?.pincode || '12345'}</p>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg border border-color-2 p-4">
              <h3 className="font-medium text-color-12 mb-3">Order History</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-color-12">Delivered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-color-3 rounded-full"></div>
                  <span className="text-sm text-color-5">Shipped</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-color-3 rounded-full"></div>
                  <span className="text-sm text-color-5">Dispatched from warehouse</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-color-3 rounded-full"></div>
                  <span className="text-sm text-color-5">Package Being Prepared</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item Summary */}
          <div className="bg-white rounded-lg border border-color-2">
            <div className="p-4 border-b border-color-2">
              <h3 className="font-medium text-color-12">Item Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-color-1">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-color-8">Item</th>
                    <th className="text-center p-4 text-sm font-medium text-color-8">QTY</th>
                    <th className="text-right p-4 text-sm font-medium text-color-8">Price</th>
                    <th className="text-right p-4 text-sm font-medium text-color-8">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {mockItems.map((item) => (
                    <tr key={item.id} className="border-b border-color-2">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded bg-color-2" />
                          <span className="text-sm text-color-12">{item.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-4 text-sm text-color-12">x{item.qty}</td>
                      <td className="text-right p-4 text-sm text-color-12">${item.price}</td>
                      <td className="text-right p-4 text-sm text-color-12">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-color-1 p-6">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-color-2 p-4">
              <h3 className="font-medium text-color-12 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-color-5">Payment</span>
                  <span className="text-color-12">Card •••42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-color-5">Subtotal</span>
                  <span className="text-color-12">${(order.total_amount * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-color-5">Discount</span>
                  <span className="text-color-12">$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-color-5">Delivery Fee</span>
                  <span className="text-color-12">$20.00</span>
                </div>
                <div className="border-t border-color-2 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-color-12">Total</span>
                    <span className="text-color-12">${order.total_amount}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-color-5">Platinum Fee</span>
                  <span className="text-color-12">3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-color-5">Credit Card Charge</span>
                  <span className="text-color-12">2%</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-color-12">Eligible</span>
                  <span className="text-color-12">${order.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedOrderView;
