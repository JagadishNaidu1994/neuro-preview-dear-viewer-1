
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  Tag,
  Truck,
  DollarSign,
  Star,
  FileEdit,
  Settings,
  Home,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    users: 0,
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

      // Fetch users count
      const { count: usersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      setCounts({
        orders: ordersCount || 0,
        products: productsCount || 0,
        messages: messagesCount || 0,
        coupons: couponsCount || 0,
        users: usersCount || 0,
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
    { id: "users", label: "Users", icon: Users, count: counts.users },
    { id: "journals", label: "Journals", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare, count: counts.messages },
    { id: "content", label: "Coupon Management", icon: Tag, count: counts.coupons },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "reviews", label: "Reviews", icon: Star },
    
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

      {/* Mobile Dropdown */}
      <div className="lg:hidden w-full bg-white border-b border-gray-200 p-2">
        <div className="flex justify-between items-center">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sidebarItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NavLink to="/" className="flex items-center space-x-2 p-2">
            <Home className="h-6 w-6 text-primary" />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
