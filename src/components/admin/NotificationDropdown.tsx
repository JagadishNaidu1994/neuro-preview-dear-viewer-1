
import { useState } from "react";
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
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      description: 'Order #2564 from Jonathon Smith',
      time: '2 min ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      description: 'Chinese Utthe sent you a message',
      time: '5 min ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'order',
      title: 'Order Shipped',
      description: 'Order #2563 has been shipped',
      time: '1 hour ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'system',
      title: 'System Update',
      description: 'New features available',
      time: '2 hours ago',
      isRead: true,
    },
    {
      id: '5',
      type: 'message',
      title: 'Customer Support',
      description: 'Refund request from customer',
      time: '3 hours ago',
      isRead: false,
    },
  ]);

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '📦';
      case 'message': return '💬';
      case 'system': return '⚙️';
      default: return '🔔';
    }
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
            {notifications.map((notification) => (
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
            ))}
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
