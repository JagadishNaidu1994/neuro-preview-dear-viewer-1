
import { useState } from "react";
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
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart, count: 7 },
    { id: "products", label: "Products", icon: Package, count: 120 },
    { id: "journals", label: "Journals", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 1 },
    { id: "coupons", label: "Coupons", icon: Tag, count: 2 },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
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
                {item.count && (
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
  );
};

export default AdminSidebar;
