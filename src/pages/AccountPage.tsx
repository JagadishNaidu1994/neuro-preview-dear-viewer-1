
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Edit3, Save, X, Eye, Download, RotateCcw, Package } from 'lucide-react';
import OrderDetailsDialog from '@/components/admin/OrderDetailsDialog';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_link?: string;
  shipping_address?: any;
  user_email?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url?: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

const AccountPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });

  console.log('Current user:', user);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      console.log('Profile data:', data);
      return data as UserProfile;
    },
    enabled: !!user,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('orders')
        .select('id, user_id, total_amount, status, created_at, tracking_link, shipping_address')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Orders data:', data);
      return data as Order[];
    },
    enabled: !!user,
  });

  // Fetch order items for each order
  const { data: allOrderItems = {} } = useQuery({
    queryKey: ['allOrderItems', orders.map(o => o.id)],
    queryFn: async () => {
      if (!orders.length) return {};
      
      const itemsMap: Record<string, OrderItem[]> = {};
      
      for (const order of orders) {
        const { data: items, error } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              name,
              image_url
            )
          `)
          .eq('order_id', order.id);

        if (error) {
          console.error('Error fetching order items:', error);
          continue;
        }
        
        itemsMap[order.id] = items || [];
      }
      
      return itemsMap;
    },
    enabled: orders.length > 0,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  });

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || ''
      });
    }
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      first_name: '',
      last_name: '',
      phone: ''
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder({ ...order, user_email: profile?.email });
    setIsOrderDialogOpen(true);
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      // Fetch complete order details including items
      const orderItems = allOrderItems[order.id] || [];

      // Generate and download PDF
      await generateInvoicePDF(order, orderItems, profile);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const generateInvoicePDF = async (order: Order, orderItems: OrderItem[], userProfile: UserProfile | undefined) => {
    // Import jsPDF dynamically
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Generate order number
    const orderNumber = order.id.slice(0, 8).toUpperCase();
    
    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Order #${orderNumber}`, 20, 45);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 55);
    
    // Customer Info
    doc.text('Bill To:', 20, 75);
    doc.text(`${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 'Customer', 20, 85);
    doc.text(`${userProfile?.email || ''}`, 20, 95);
    
    if (order.shipping_address) {
      const addr = order.shipping_address;
      doc.text(`${addr.address_line_1}`, 20, 105);
      if (addr.address_line_2) doc.text(`${addr.address_line_2}`, 20, 115);
      doc.text(`${addr.city}, ${addr.state} ${addr.pincode}`, 20, 125);
    }
    
    // Items header
    let yPos = 150;
    doc.text('Items:', 20, yPos);
    yPos += 15;
    
    // Items list
    orderItems.forEach((item) => {
      doc.text(`${item.products?.name || 'Product'} - Qty: ${item.quantity} - ₹${item.price}`, 25, yPos);
      yPos += 10;
    });
    
    // Total
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total: ₹${order.total_amount}`, 20, yPos);
    
    // Download
    doc.save(`invoice-${orderNumber}.pdf`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const generateOrderNumber = (orderId: string) => {
    return orderId.substring(0, 8).toUpperCase();
  };

  if (profileLoading || ordersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Get display name from profile data or user metadata as fallback
  let displayName = 'User';
  
  if (profile?.first_name || profile?.last_name) {
    // Use profile data if available
    displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  } else if (user?.user_metadata) {
    // Fallback to user metadata from auth
    const { given_name, family_name, full_name, first_name, last_name } = user.user_metadata;
    if (given_name || family_name) {
      displayName = `${given_name || ''} ${family_name || ''}`.trim();
    } else if (first_name || last_name) {
      displayName = `${first_name || ''} ${last_name || ''}`.trim();
    } else if (full_name) {
      displayName = full_name;
    }
  }

  console.log('Display name:', displayName, 'Profile:', profile, 'User metadata:', user?.user_metadata);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-sm border-r">
          <div className="p-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mx-auto mb-4">
              <span className="text-white text-2xl">👤</span>
            </div>
            <h2 className="text-xl font-semibold text-center">{displayName}</h2>
            <p className="text-gray-600 text-center text-sm">{profile?.email || user?.email}</p>
          </div>
          
          <nav className="px-4">
            <div className="space-y-1">
              <div className="flex items-center px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg">
                <Package className="w-5 h-5 mr-3" />
                Orders
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl">
            <h1 className="text-2xl font-bold mb-8">Your Orders ({orders.length})</h1>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders found</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const orderItems = allOrderItems[order.id] || [];
                  const orderNumber = generateOrderNumber(order.id);
                  
                  return (
                    <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold">Order #{orderNumber}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'numeric', 
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                            {order.status}
                          </Badge>
                          <span className="text-xl font-bold">₹{order.total_amount}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <img 
                              src={item.products?.image_url || '/placeholder.svg'} 
                              alt={item.products?.name || 'Product'}
                              className="w-16 h-16 object-cover rounded-lg bg-white"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.products?.name || 'Unknown Product'}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{item.price}</p>
                              <p className="text-sm text-gray-600">View Product</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(order)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Invoice
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reorder
                        </Button>
                        {order.status === 'shipped' && order.tracking_link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(order.tracking_link, '_blank')}
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Track
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isOrderDialogOpen}
        onClose={() => {
          setIsOrderDialogOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default AccountPage;
