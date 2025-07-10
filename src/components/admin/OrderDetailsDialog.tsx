
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_email?: string;
  shipping_address?: any;
  items?: OrderItem[];
}

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog = ({ order, isOpen, onClose }: OrderDetailsDialogProps) => {
  if (!order) return null;

  const generateOrderNumber = (orderId: string, createdAt: string) => {
    const date = new Date(createdAt);
    const timestamp = Math.floor(date.getTime() / 1000);
    const orderNum = timestamp.toString().slice(-6);
    return String(parseInt(orderNum) % 1000000).padStart(6, '0');
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

  const mockItems = order.items || [
    { id: '1', name: 'Fjällräven - Foldsack No. 1 Backpack, Fits 15 Laptops', quantity: 1, price: 109.95, image_url: '/placeholder.svg' },
    { id: '2', name: 'Fjällräven - Foldsack No. 1 Backpack, Fits 15 Laptops', quantity: 1, price: 109.95, image_url: '/placeholder.svg' },
    { id: '3', name: 'Fjällräven - Foldsack No. 1 Backpack, Fits 15 Laptops', quantity: 1, price: 109.95, image_url: '/placeholder.svg' },
    { id: '4', name: 'Fjällräven - Foldsack No. 1 Backpack, Fits 15 Laptops', quantity: 1, price: 109.95, image_url: '/placeholder.svg' },
  ];

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
                    <p className="font-medium">{shippingAddress?.name || 'Jonathon Smith'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-blue-600">{order.user_email || 'customer1@domain.com'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="font-medium">{shippingAddress?.phone || '+1 215 547654732'}</p>
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
                    <p className="font-medium">{shippingAddress?.address_line_1 || '14 Anglesey Road'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Flat / Building Name</label>
                    <p className="font-medium">{shippingAddress?.address_line_2 || 'James Court'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Street Name</label>
                    <p className="font-medium">Anglesey Road</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Postcode</label>
                    <p className="font-medium">{shippingAddress?.pincode || 'En55hy'}</p>
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
                  <div className="col-span-8"></div>
                </div>
                {mockItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
                    <div className="col-span-1 text-center font-medium">x{item.quantity}</div>
                    <div className="col-span-1 font-medium">${item.price}</div>
                    <div className="col-span-2 font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="col-span-8 flex items-center gap-4">
                      <img 
                        src={item.image_url || '/placeholder.svg'} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Colors: Blue</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-xs text-gray-500">24 Nov 2022</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-gray-600">Shipped</p>
                    <p className="text-xs text-gray-500">20 Nov 2022</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-gray-600">Dispatch from warehouse</p>
                    <p className="text-xs text-gray-500">18 Nov 2022</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-gray-600">Pickup being Prepared</p>
                    <p className="text-xs text-gray-500">16 Nov 2022</p>
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
                  <span>Card - 65482</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(order.total_amount * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>$0.00</span>
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
