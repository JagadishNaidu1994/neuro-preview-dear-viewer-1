
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, Users, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  assigned_users: string | null;
  created_at: string;
}

interface CouponFormData {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  max_uses: number | null;
  expires_at: string;
  assigned_users: string;
}

const ContentTab = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [filter, setFilter] = useState<'all' | 'general' | 'user-specific'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    minimum_order_amount: 0,
    max_uses: null,
    expires_at: '',
    assigned_users: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({ title: 'Error', description: 'Failed to fetch coupons', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const couponData = {
        ...formData,
        assigned_users: formData.assigned_users.trim() || null,
        max_uses: formData.max_uses || null,
        expires_at: formData.expires_at || null,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupon_codes')
          .update(couponData)
          .eq('id', editingCoupon.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Coupon updated successfully' });
      } else {
        const { error } = await supabase
          .from('coupon_codes')
          .insert([couponData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Coupon created successfully' });
      }

      resetForm();
      await fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast({ title: 'Error', description: 'Failed to save coupon', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type as 'percentage' | 'fixed',
      discount_value: coupon.discount_value,
      minimum_order_amount: coupon.minimum_order_amount,
      max_uses: coupon.max_uses,
      expires_at: coupon.expires_at ? format(new Date(coupon.expires_at), 'yyyy-MM-dd') : '',
      assigned_users: coupon.assigned_users || '',
    });
    setShowForm(true);
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupon_codes')
        .delete()
        .eq('id', couponId);

      if (error) throw error;
      toast({ title: 'Success', description: 'Coupon deleted successfully' });
      await fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({ title: 'Error', description: 'Failed to delete coupon', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      minimum_order_amount: 0,
      max_uses: null,
      expires_at: '',
      assigned_users: '',
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'general' && !coupon.assigned_users) ||
      (filter === 'user-specific' && coupon.assigned_users);

    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.assigned_users && coupon.assigned_users.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coupons</SelectItem>
              <SelectItem value="general">General Coupons</SelectItem>
              <SelectItem value="user-specific">User-Specific Coupons</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search by code or user email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-64"
        />
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="border rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">
            {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
          </h3>
          <form onSubmit={handleSubmitCoupon} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount_type">Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: 'percentage' | 'fixed') => 
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discount_value">
                  Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  min="0"
                  max={formData.discount_type === 'percentage' ? '100' : undefined}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minimum_order_amount">Minimum Order Amount (₹)</Label>
                <Input
                  id="minimum_order_amount"
                  type="number"
                  value={formData.minimum_order_amount}
                  onChange={(e) => setFormData({ ...formData, minimum_order_amount: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="max_uses">Max Uses (leave empty for unlimited)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses || ''}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : null })}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="expires_at">Expiry Date (optional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="assigned_users">Assign to Users (comma-separated emails, leave empty for all users)</Label>
              <Textarea
                id="assigned_users"
                value={formData.assigned_users}
                onChange={(e) => setFormData({ ...formData, assigned_users: e.target.value })}
                placeholder="user1@example.com, user2@example.com"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading coupons...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No coupons found matching your criteria
          </div>
        ) : (
          filteredCoupons.map((coupon) => (
            <div key={coupon.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{coupon.code}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {coupon.assigned_users && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        User-Specific
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}% off`
                          : `₹${coupon.discount_value} off`
                        }
                      </span>
                    </div>
                    <div>Min Order: ₹{coupon.minimum_order_amount}</div>
                    <div>Used: {coupon.used_count}/{coupon.max_uses || '∞'}</div>
                    {coupon.expires_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Expires: {format(new Date(coupon.expires_at), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                  {coupon.assigned_users && (
                    <div className="text-sm text-gray-600">
                      <strong>Assigned to:</strong> {coupon.assigned_users}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditCoupon(coupon)}>
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteCoupon(coupon.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentTab;
