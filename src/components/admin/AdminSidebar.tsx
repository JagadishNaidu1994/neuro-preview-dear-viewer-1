
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  MessageSquare,
  Tag,
  Truck,
  Settings,
  Home,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const [counts, setCounts] = useState({
    orders: 0,
    products: 0,
    messages: 0,
    coupons: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Fetch products count
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Fetch unread messages count
      const { count: messagesCount } = await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      // Fetch active coupons count
      const { count: couponsCount } = await supabase
        .from("coupon_codes")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      setCounts({
        orders: ordersCount || 0,
        products: productsCount || 0,
        messages: messagesCount || 0,
        coupons: couponsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "orders", label: "Orders", icon: ShoppingCart, count: counts.orders },
    { id: "products", label: "Products", icon: Package, count: counts.products },
    { id: "journals", label: "Journals", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare, count: counts.messages },
    { id: "coupons", label: "Coupons", icon: Tag, count: counts.coupons },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white h-screen border-r border-gray-200 flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <NavLink to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Back to Home</span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors",
                    activeTab === item.id
                      ? "bg-purple-50 text-purple-700 border-l-4 border-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      activeTab === item.id
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden w-full bg-white border-b border-gray-200">
        <div className="p-2 overflow-x-auto">
          <div className="flex space-x-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm transition-colors",
                  activeTab === item.id
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
