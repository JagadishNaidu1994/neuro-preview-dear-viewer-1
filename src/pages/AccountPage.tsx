
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
import { ExternalLink, Edit3, Save, X, Eye, Download } from 'lucide-react';
import OrderDetailsDialog from '@/components/admin/OrderDetailsDialog';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_link?: string;
  shipping_address?: any;
  user_email?: string;
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
        .select('id, total_amount, status, created_at, tracking_link, shipping_address')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Orders data:', data);
      return data as Order[];
    },
    enabled: !!user,
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
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;

      // Generate and download PDF
      await generateInvoicePDF(order, orderItems, profile);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const generateInvoicePDF = async (order: Order, orderItems: any[], userProfile: UserProfile | undefined) => {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {displayName}!
        </h1>
        <p className="text-gray-600">{profile?.email || user?.email}</p>
      </div>

      {/* Profile Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEditClick}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || user?.email || ''}
                  disabled
                  className="bg-gray-100 text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">First Name</Label>
                <p className="mt-1 text-sm text-gray-900">{profile?.first_name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                <p className="mt-1 text-sm text-gray-900">{profile?.last_name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="mt-1 text-sm text-gray-900">{profile?.email || user?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                <p className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not set'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Orders ({orders.length})</CardTitle>
          <CardDescription>
            Track and manage your recent orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <span className="font-bold text-lg">₹{order.total_amount}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
