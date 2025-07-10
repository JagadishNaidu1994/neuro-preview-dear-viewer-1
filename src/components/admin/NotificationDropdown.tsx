
import React, { useState } from "react";
import { Bell, MoreHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  user: string;
  action: string;
  orderNumber: string;
  time: string;
  status: 'read' | 'unread';
  type: 'order' | 'refund' | 'cancel';
}

const NotificationDropdown = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      user: 'Jonathan Smith',
      action: 'Place an order',
      orderNumber: '#254865',
      time: '9 hours ago',
      status: 'unread',
      type: 'order'
    },
    {
      id: '2',
      user: 'Jonathan Smith',
      action: 'Place an order',
      orderNumber: '#254634',
      time: '9 hours ago',
      status: 'unread',
      type: 'order'
    },
    {
      id: '3',
      user: 'Jonathan Smith',
      action: 'Place an order',
      orderNumber: '#254634',
      time: '9 hours ago',
      status: 'unread',
      type: 'order'
    },
    {
      id: '4',
      user: 'Jonathan Smith',
      action: 'Cancel an order',
      orderNumber: '#254635',
      time: '9 hours ago',
      status: 'read',
      type: 'cancel'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const getActionColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-600';
      case 'refund': return 'text-orange-600';
      case 'cancel': return 'text-red-600';
      default: return 'text-color-8';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-color-8" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 bg-white border border-color-2">
        {/* Header */}
        <div className="p-4 border-b border-color-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-color-12">Notification</h3>
            <Button variant="ghost" size="sm" className="text-xs">
              All New
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Button 
              variant={selectedFilter === 'All' ? 'default' : 'ghost'} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedFilter('All')}
            >
              All
            </Button>
            <Button 
              variant={selectedFilter === 'All Inbox' ? 'default' : 'ghost'} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedFilter('All Inbox')}
            >
              All Inbox
            </Button>
            <Button 
              variant={selectedFilter === 'Draft' ? 'default' : 'ghost'} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedFilter('Draft')}
            >
              Draft
            </Button>
            <Button 
              variant={selectedFilter === 'Blocked' ? 'default' : 'ghost'} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedFilter('Blocked')}
            >
              Blocked
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="px-4 py-2 border-b border-color-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-color-8">Quick:</span>
            <Button variant="ghost" size="sm" className="text-xs h-6 px-2">All</Button>
            <Button variant="ghost" size="sm" className="text-xs h-6 px-2">Read</Button>
            <Button variant="ghost" size="sm" className="text-xs h-6 px-2">Unread</Button>
          </div>
        </div>

        {/* Today Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-color-8">Today</span>
            <div className="flex items-center space-x-2">
              <select className="text-xs border border-color-3 rounded px-2 py-1">
                <option>Mark as Read</option>
                <option>Mark as Un-Read</option>
                <option>Delete</option>
              </select>
              <Button size="sm" className="text-xs h-7 bg-color-8 text-white">
                Details
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-2 rounded hover:bg-color-1">
                <input type="checkbox" className="mt-1" />
                <div className="w-8 h-8 bg-color-3 rounded-full flex items-center justify-center text-white text-sm">
                  {notification.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-color-12">{notification.user}</span>
                    <span className={`text-sm ${getActionColor(notification.type)}`}>
                      {notification.action}
                    </span>
                    <span className="text-sm text-color-8">{notification.orderNumber}</span>
                  </div>
                  <p className="text-xs text-color-5 mt-1">{notification.time}</p>
                </div>
                {notification.status === 'unread' && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Yesterday Section */}
        <div className="p-4 border-t border-color-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-color-8">Yesterday</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-color-5">Unread</span>
              <Button size="sm" className="text-xs h-7 bg-color-8 text-white">
                Details
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.slice(3).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-2 rounded hover:bg-color-1">
                <input type="checkbox" className="mt-1" />
                <div className="w-8 h-8 bg-color-3 rounded-full flex items-center justify-center text-white text-sm">
                  {notification.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-color-12">{notification.user}</span>
                    <span className={`text-sm ${getActionColor(notification.type)}`}>
                      {notification.action}
                    </span>
                    <span className="text-sm text-color-8">{notification.orderNumber}</span>
                  </div>
                  <p className="text-xs text-color-5 mt-1">{notification.time}</p>
                </div>
                <span className="text-xs text-color-5 mt-2">Read</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-color-2 text-center">
          <Button variant="ghost" className="text-sm text-color-6">
            All Notification
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
