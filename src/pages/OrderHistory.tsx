
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { FaEye, FaDownload, FaRedo, FaTruck, FaBox } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartProvider";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: {
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image_url: string;
    };
  }[];
}

const OrderHistory = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          total_amount,
          status,
          created_at,
          order_items (
            quantity,
            price,
            products!order_items_product_id_fkey (
              id,
              name,
              image_url
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected structure
      const transformedData = (data || []).map(order => ({
        ...order,
        order_items: order.order_items.map(item => ({
          ...item,
          product: item.products
        }))
      }));
      
      setOrders(transformedData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      for (const item of order.order_items) {
        await addToCart(item.product.id, item.quantity);
      }
      navigate("/checkout");
    } catch (error) {
      console.error("Error reordering items:", error);
      alert("There was an error adding items to your cart. Please try again.");
    }
  };

  const handleViewProduct = (productId: string) => {
    window.open(`/product?id=${productId}`, '_blank');
  };

  const handleDownloadInvoice = (orderId: string) => {
    // Implement invoice download functionality
    console.log("Downloading invoice for order:", orderId);
    alert("Invoice download feature will be implemented soon!");
  };

  const handleTrackOrder = (orderId: string) => {
    // Implement order tracking functionality
    console.log("Tracking order:", orderId);
    alert(`Tracking Order ID: ${orderId.slice(0, 8)}...\n\nStatus: In Transit\nExpected Delivery: 2-3 business days\n\nTracking ID: TRK${orderId.slice(0, 6).toUpperCase()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-6">Order History</h1>
          <p className="text-gray-600 text-lg">
            View and track all your past orders.
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Order #{order.id.slice(0, 8)}...
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:items-end space-y-3 mt-4 lg:mt-0">
                    <div className="text-2xl font-semibold">₹{order.total_amount.toFixed(2)}</div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => console.log("View order details")}>
                        <FaEye className="mr-2" />
                        View Order
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(order.id)}>
                        <FaDownload className="mr-2" />
                        Invoice
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReorder(order)}>
                        <FaRedo className="mr-2" />
                        Re-Order
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleTrackOrder(order.id)}>
                        <FaTruck className="mr-2" />
                        Track
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewProduct(item.product.id)}
                        className="text-[#514B3D] hover:text-[#3f3a2f]"
                      >
                        <FaBox className="mr-2" />
                        View Product
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEye className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Button
              asChild
              className="bg-[#514B3D] hover:bg-[#3f3a2f]"
            >
              <Link to="/shop-all">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
