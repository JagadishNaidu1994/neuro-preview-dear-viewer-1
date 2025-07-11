
import { useState, useEffect } from "react";
import { Bell, Settings, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'order' | 'message' | 'system';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  avatar?: string;
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch recent orders for order notifications
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch recent contact submissions for message notifications
      const { data: messages } = await supabase
        .from("contact_submissions")
        .select("*")
        .eq("status", "unread")
        .order("created_at", { ascending: false })
        .limit(2);

      const notificationsList: Notification[] = [];

      // Add order notifications
      orders?.forEach((order) => {
        const timeAgo = getTimeAgo(order.created_at);
        notificationsList.push({
          id: `order-${order.id}`,
          type: 'order',
          title: order.status === 'delivered' ? 'Order Delivered' : 'New Order Received',
          description: `Order #${order.id.slice(0, 8)} - $${order.total_amount}`,
          time: timeAgo,
          isRead: false,
        });
      });

      // Add message notifications
      messages?.forEach((message) => {
        const timeAgo = getTimeAgo(message.created_at);
        notificationsList.push({
          id: `message-${message.id}`,
          type: 'message',
          title: 'New Message',
          description: `${message.name} sent you a message`,
          time: timeAgo,
          isRead: false,
        });
      });

      // Add system notification
      notificationsList.push({
        id: 'system-1',
        type: 'system',
        title: 'System Update',
        description: 'New admin features available',
        time: '2 hours ago',
        isRead: true,
      });

      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour ago`;
    return `${Math.floor(diffInMinutes / 1440)} day ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getInitials = (title: string) => {
    return title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 bg-white border shadow-lg"
        sideOffset={5}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-96">
          <div className="p-2">
            {loading ? (
              <div className="p-4 text-center">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    !notification.isRead 
                      ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="w-10 h-10 mt-1">
                    <AvatarFallback className={`text-sm ${
                      notification.type === 'order' ? 'bg-green-100 text-green-700' :
                      notification.type === 'message' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getInitials(notification.title)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.description}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
