import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FaUser, 
  FaShoppingBag, 
  FaHeart, 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaCog, 
  FaLock,
  FaGift,
  FaSync,
  FaShield
} from 'react-icons/fa';

const AccountPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  My Account
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {[
                    { href: '/account/dashboard', label: 'Dashboard', icon: FaUser },
                    { href: '/account/orders', label: 'Orders', icon: FaShoppingBag },
                    { href: '/account/profile', label: 'Profile', icon: FaUser },
                    { href: '/account/subscriptions', label: 'Subscriptions', icon: FaSync },
                    { href: '/account/addresses', label: 'Addresses', icon: FaMapMarkerAlt },
                    { href: '/account/payments', label: 'Payment Methods', icon: FaCreditCard },
                    { href: '/account/rewards', label: 'Rewards', icon: FaGift },
                    { href: '/account/preferences', label: 'Preferences', icon: FaCog },
                    { href: '/account/security', label: 'Security', icon: FaLock },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Dashboard Content */}
            <Card>
              <CardHeader>
                <CardTitle>Account Dashboard</CardTitle>
                <CardDescription>
                  Welcome back! Here's an overview of your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FaShoppingBag className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FaGift className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <div className="text-2xl font-bold">250</div>
                      <div className="text-sm text-gray-600">Reward Points</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FaHeart className="w-8 h-8 mx-auto text-red-600 mb-2" />
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-sm text-gray-600">Wishlist Items</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {[
                      { id: '#12345', date: '2024-01-15', status: 'Delivered', total: '$89.99' },
                      { id: '#12344', date: '2024-01-10', status: 'Shipped', total: '$45.50' },
                      { id: '#12343', date: '2024-01-05', status: 'Processing', total: '$120.00' },
                    ].map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-gray-600">{order.date}</div>
                            </div>
                            <div className="text-right">
                              <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                              <div className="text-sm font-medium mt-1">{order.total}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                      <FaUser className="w-6 h-6" />
                      <span className="text-sm">Edit Profile</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                      <FaMapMarkerAlt className="w-6 h-6" />
                      <span className="text-sm">Manage Addresses</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                      <FaCreditCard className="w-6 h-6" />
                      <span className="text-sm">Payment Methods</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                      <FaShield className="w-6 h-6" />
                      <span className="text-sm">Security</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
