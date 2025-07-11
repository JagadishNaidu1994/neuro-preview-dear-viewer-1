
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url?: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address?: any;
  order_items?: OrderItem[];
  user_email?: string;
}

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog = ({ order, isOpen, onClose }: OrderDetailsDialogProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      fetchOrderDetails();
    }
  }, [order, isOpen]);

  const fetchOrderDetails = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      // Fetch order items with product details
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .eq("order_id", order.id);

      if (itemsError) throw itemsError;
      setOrderItems(items || []);

      // Fetch user email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("id", order.user_id)
        .single();

      if (userError) throw userError;
      setUserEmail(userData?.email || "");

    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  const generateOrderNumber = (orderId: string, createdAt: string) => {
    const date = new Date(createdAt);
    const timestamp = Math.floor(date.getTime() / 1000);
    return String(timestamp).slice(-6);
  };

  const orderNumber = generateOrderNumber(order.id, order.created_at);
  const shippingAddress = order.shipping_address;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 5.00;
  const deliveryFee = 0.00;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">
              Order Number #{orderNumber}
            </DialogTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Order Created</span>
              <span>
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span>
                {new Date(order.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📋</span> Customer Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-medium">{shippingAddress?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-blue-600">{userEmail || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="font-medium">{shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📍</span> Delivery Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Address Line</label>
                    <p className="font-medium">{shippingAddress?.address_line_1 || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Flat / Building Name</label>
                    <p className="font-medium">{shippingAddress?.address_line_2 || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <p className="font-medium">{shippingAddress?.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Postcode</label>
                    <p className="font-medium">{shippingAddress?.pincode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Item Summary</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                  <div className="col-span-1">QTY</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-2">Total Price</div>
                  <div className="col-span-8">Product</div>
                </div>
                {loading ? (
                  <div className="p-4 text-center">Loading items...</div>
                ) : orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
                      <div className="col-span-1 text-center font-medium">x{item.quantity}</div>
                      <div className="col-span-1 font-medium">${item.price}</div>
                      <div className="col-span-2 font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="col-span-8 flex items-center gap-4">
                        <img 
                          src={item.products?.image_url || '/placeholder.svg'} 
                          alt={item.products?.name || 'Product'}
                          className="w-12 h-12 object-cover rounded bg-gray-100"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.products?.name || 'Unknown Product'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No items found</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order History & Summary */}
          <div className="space-y-6">
            {/* Order History */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order History</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className={`font-medium ${order.status === 'delivered' ? 'text-black' : 'text-gray-600'}`}>Delivered</p>
                    <p className="text-xs text-gray-500">
                      {order.status === 'delivered' ? new Date(order.created_at).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className={`${['shipped', 'delivered'].includes(order.status) ? 'text-black' : 'text-gray-600'}`}>Shipped</p>
                    <p className="text-xs text-gray-500">
                      {['shipped', 'delivered'].includes(order.status) ? new Date(order.created_at).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className={`${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-black' : 'text-gray-600'}`}>Processing</p>
                    <p className="text-xs text-gray-500">
                      {['processing', 'shipped', 'delivered'].includes(order.status) ? new Date(order.created_at).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div>
                    <p className="text-black">Order Placed</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span>Card - ****</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span>$${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.total_amount}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>-5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Card Charge</span>
                    <span>-4.5%</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Eligible</span>
                  <span className="text-green-600">${(order.total_amount * 0.9).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
