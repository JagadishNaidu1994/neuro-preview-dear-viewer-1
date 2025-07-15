import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, User, Tag, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  expires_at: string | null;
  is_active: boolean;
}

interface UserCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  assigned_at: string;
  is_used: boolean;
  used_at: string | null;
  user: User;
  coupon: Coupon;
}

export const UserCouponsTab = () => {
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserCoupons(),
        fetchUsers(),
        fetchCoupons(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCoupons = async () => {
    const { data, error } = await supabase
      .from("user_coupons")
      .select(`
        id,
        user_id,
        coupon_id,
        assigned_at,
        is_used,
        used_at,
        coupon:coupon_codes(id, code, discount_type, discount_value, minimum_order_amount, expires_at, is_active)
      `)
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("Error fetching user coupons:", error);
      return;
    }

    // Fetch user details separately and merge
    const userCouponsWithUsers = await Promise.all(
      (data || []).map(async (uc) => {
        const { data: userData } = await supabase
          .from("users")
          .select("id, email, first_name, last_name")
          .eq("id", uc.user_id)
          .single();
        
        return {
          ...uc,
          user: userData || { id: uc.user_id, email: "Unknown", first_name: "", last_name: "" }
        };
      })
    );

    setUserCoupons(userCouponsWithUsers);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .order("email");

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    setUsers(data || []);
  };

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from("coupon_codes")
      .select("id, code, discount_type, discount_value, minimum_order_amount, expires_at, is_active")
      .eq("is_active", true)
      .order("code");

    if (error) {
      console.error("Error fetching coupons:", error);
      return;
    }

    setCoupons(data || []);
  };

  const assignCoupon = async () => {
    if (!selectedUserId || !selectedCouponId) {
      toast({
        title: "Error",
        description: "Please select both user and coupon",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_coupons")
        .insert({
          user_id: selectedUserId,
          coupon_id: selectedCouponId,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Error",
            description: "This coupon is already assigned to this user",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Coupon assigned successfully",
      });

      setIsAssignModalOpen(false);
      setSelectedUserId("");
      setSelectedCouponId("");
      fetchUserCoupons();
    } catch (error) {
      console.error("Error assigning coupon:", error);
      toast({
        title: "Error",
        description: "Failed to assign coupon",
        variant: "destructive",
      });
    }
  };

  const removeCoupon = async (userCouponId: string) => {
    try {
      const { error } = await supabase
        .from("user_coupons")
        .delete()
        .eq("id", userCouponId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon removed successfully",
      });

      fetchUserCoupons();
    } catch (error) {
      console.error("Error removing coupon:", error);
      toast({
        title: "Error",
        description: "Failed to remove coupon",
        variant: "destructive",
      });
    }
  };

  const filteredUserCoupons = userCoupons.filter(uc =>
    uc.user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    uc.user.first_name?.toLowerCase().includes(searchEmail.toLowerCase()) ||
    uc.user.last_name?.toLowerCase().includes(searchEmail.toLowerCase()) ||
    uc.coupon.code.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const formatDiscount = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : `₹${value}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User-Specific Coupons</h2>
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Coupon to User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{user.email}</span>
                          {user.first_name && (
                            <span className="text-muted-foreground">
                              ({user.first_name} {user.last_name})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Coupon</Label>
                <Select value={selectedCouponId} onValueChange={setSelectedCouponId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a coupon" />
                  </SelectTrigger>
                  <SelectContent>
                    {coupons.map((coupon) => (
                      <SelectItem key={coupon.id} value={coupon.id}>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span className="font-mono">{coupon.code}</span>
                          <span className="text-muted-foreground">
                            - {formatDiscount(coupon.discount_type, coupon.discount_value)} OFF
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={assignCoupon}>
                  Assign Coupon
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user email, name, or coupon code..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Coupons ({filteredUserCoupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUserCoupons.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No user coupons found</p>
              <p className="text-muted-foreground">
                {searchEmail ? "Try adjusting your search criteria" : "Start by assigning coupons to users"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Coupon Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Used Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUserCoupons.map((userCoupon) => (
                  <TableRow key={userCoupon.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{userCoupon.user.email}</p>
                        {userCoupon.user.first_name && (
                          <p className="text-sm text-muted-foreground">
                            {userCoupon.user.first_name} {userCoupon.user.last_name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {userCoupon.coupon.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatDiscount(userCoupon.coupon.discount_type, userCoupon.coupon.discount_value)} OFF
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={userCoupon.is_used ? "destructive" : "default"}>
                        {userCoupon.is_used ? "Used" : "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(userCoupon.assigned_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {userCoupon.used_at 
                        ? new Date(userCoupon.used_at).toLocaleDateString()
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCoupon(userCoupon.id)}
                        disabled={userCoupon.is_used}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{userCoupons.length}</p>
              <p className="text-sm text-muted-foreground">Total Assigned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {userCoupons.filter(uc => !uc.is_used).length}
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {userCoupons.filter(uc => uc.is_used).length}
              </p>
              <p className="text-sm text-muted-foreground">Used</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};