
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_email?: string;
  shipping_address?: any;
}

interface OrderViewDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderViewDialog = ({ order, isOpen, onClose }: OrderViewDialogProps) => {
  if (!order) return null;

  // Generate consistent order number based on creation date
  const generateOrderNumber = (orderId: string, createdAt: string) => {
    const date = new Date(createdAt);
    const timestamp = Math.floor(date.getTime() / 1000);
    const orderNum = timestamp.toString().slice(-6); // Last 6 digits of timestamp
    return String(parseInt(orderNum) % 1000).padStart(3, '0');
  };

  const orderNumber = generateOrderNumber(order.id, order.created_at);
  const shippingAddress = order.shipping_address;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details #{orderNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Order Date</h3>
              <p className="text-gray-600">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-2">Customer</h3>
            <p className="text-gray-600">{order.user_email || 'N/A'}</p>
          </div>

          {/* Total Amount */}
          <div>
            <h3 className="font-semibold mb-2">Total Amount</h3>
            <p className="text-2xl font-bold">${order.total_amount}</p>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{shippingAddress.name}</p>
                <p>{shippingAddress.address_line_1}</p>
                {shippingAddress.address_line_2 && <p>{shippingAddress.address_line_2}</p>}
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                <p className="text-gray-600">{shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline">
                📋 Download Invoice
              </Button>
              <Button variant="outline">
                🔄 Reorder Items
              </Button>
              <Button variant="outline">
                📦 Track Order
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewDialog;
