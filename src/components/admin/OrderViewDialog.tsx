
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: {
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
  user_email?: string;
}

interface OrderViewDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderViewDialog = ({ order, isOpen, onClose }: OrderViewDialogProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      fetchOrderItems();
    }
  }, [order, isOpen]);

  const fetchOrderItems = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      const { data: items, error } = await supabase
        .from("order_items")
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .eq("order_id", order.id);

      if (error) throw error;
      setOrderItems(items || []);
    } catch (error) {
      console.error("Error fetching order items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  const shippingAddress = order.shipping_address || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - #{order.id.slice(0, 8)}</span>
            <Badge variant={
              order.status === "delivered" ? "default" : 
              order.status === "shipped" ? "secondary" : 
              order.status === "processing" ? "outline" : 
              "destructive"
            }>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-semibold">Order ID:</Label>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <Label className="font-semibold">Customer Email:</Label>
              <p>{order.user_email || "N/A"}</p>
            </div>
            <div>
              <Label className="font-semibold">Order Date:</Label>
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div>
              <Label className="font-semibold">Total Amount:</Label>
              <p className="text-lg font-bold">${order.total_amount}</p>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && Object.keys(shippingAddress).length > 0 && (
            <div className="space-y-2">
              <Label className="font-semibold text-lg">Shipping Address:</Label>
              <div className="p-4 bg-blue-50 border rounded">
                <p><strong>Name:</strong> {shippingAddress.name || "N/A"}</p>
                <p><strong>Phone:</strong> {shippingAddress.phone || "N/A"}</p>
                <p><strong>Address:</strong></p>
                <p>{shippingAddress.address_line_1 || "N/A"}</p>
                {shippingAddress.address_line_2 && <p>{shippingAddress.address_line_2}</p>}
                <p>{shippingAddress.city || "N/A"}, {shippingAddress.state || "N/A"} {shippingAddress.pincode || "N/A"}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-2">
            <Label className="font-semibold text-lg">Order Items:</Label>
            {loading ? (
              <p>Loading order items...</p>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product?.name || "Product"}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ${item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Shipping Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border rounded">
              <Label className="font-semibold">Payment Details:</Label>
              <p className="text-sm mt-2">Payment Method: Card Payment</p>
              <p className="text-sm">Status: Completed</p>
              <p className="text-sm">Amount: ${order.total_amount}</p>
            </div>
            
            <div className="p-4 bg-orange-50 border rounded">
              <Label className="font-semibold">Shipping Details:</Label>
              <p className="text-sm mt-2">Method: Standard Shipping</p>
              <p className="text-sm">Estimated: 3-5 business days</p>
              <p className="text-sm">Tracking: TRK{order.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewDialog;
