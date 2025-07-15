import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/Confetti";
import { Sparkles, Gift, Heart, Star } from "lucide-react";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/shop-all">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 overflow-hidden relative">
      <Header />
      <Confetti />
      
      {/* Floating Icons Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[Gift, Heart, Star, Sparkles].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 15}%`,
            }}
            initial={{ y: 0, opacity: 0.3, scale: 0.5 }}
            animate={{ 
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.5, 1, 0.5],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
          >
            <Icon className="text-purple-400" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden"
        >
          {/* Animated Background Pattern */}
          {/* <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #FFD700 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #FF69B4 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />  */}

          {/* Success Icon with Pulsing Ring */}
          <div className="relative mb-8">
             {/*<motion.div
              className="absolute inset-0 border-0 border-white rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            /> */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
              }}
              className="relative z-10"
            >  
              <FaCheckCircle className="text-green-500 text-8xl mx-auto drop-shadow-lg" />
            </motion.div>
          </div> 

          {/* Animated Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
          >
            🎉 Order Confirmed! 🎉
          </motion.h1>

          {/* Celebration Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-xl text-gray-700 mb-4 font-medium">
              Thank you for your amazing purchase! ✨
            </p>
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-lg text-gray-600"
            >
              Your order has been successfully placed and our team is already working on it!
            </motion.p>
          </motion.div>

          {/* Enhanced Order Details */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-purple-100"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
              <Gift className="text-purple-500" />
              Order Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <motion.div 
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-medium text-gray-600">Order ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {order.id.slice(0, 8)}...
                </span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-medium text-gray-600">Total Amount:</span>
                <span className="font-bold text-green-600 text-lg">₹{order.total_amount.toFixed(2)}</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-medium text-gray-600">Status:</span>
                <span className="capitalize bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {order.status}
                </span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-medium text-gray-600">Order Date:</span>
                <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Info Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
          >
            <p className="text-blue-800 font-medium">
              📧 You will receive an email confirmation shortly with your order details and tracking information.
            </p>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
                
            <Link to="/account/orders">
              <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-2 border-purple-300 text-purple-700 hover:bg-purple-50">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  📋 View All Orders
                
              </motion.div>
              </Button>
            </Link>
            
            <Link to="/shop-all">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                >
                  🛍️ Continue Shopping
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg"
          >
            <p className="text-gray-700 font-medium text-lg">
              Thank you for choosing us!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;