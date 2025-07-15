
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  max_uses: number | null;
  expires_at: string;
  used_count: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    minimum_order_amount: 0,
    max_uses: null,
    expires_at: "",
  });
  const [activeTab, setActiveTab] = useState("coupons");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase.from("coupon_codes").select("*");
      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast({
        title: "Error fetching coupons",
        variant: "destructive",
      });
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("coupon_codes").insert([
        {
          code: newCoupon.code,
          discount_type: newCoupon.discount_type,
          discount_value: newCoupon.discount_value,
          minimum_order_amount: newCoupon.minimum_order_amount,
          max_uses: newCoupon.max_uses,
          expires_at: newCoupon.expires_at,
        },
      ]);
      if (error) throw error;
      toast({
        title: "Coupon created successfully",
      });
      fetchCoupons();
      setNewCoupon({
        code: "",
        discount_type: "percentage",
        discount_value: 0,
        minimum_order_amount: 0,
        max_uses: null,
        expires_at: "",
      });
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast({
        title: "Error creating coupon",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      const { error } = await supabase
        .from("coupon_codes")
        .delete()
        .eq("id", couponId);
      if (error) throw error;
      toast({
        title: "Coupon deleted successfully",
      });
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast({
        title: "Error deleting coupon",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md py-4 px-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>

      <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("coupons")}>
                Coupons
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Products
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Orders
              </Button>
            </li>
            {/* Add more admin navigation items here */}
          </ul>
        </nav>
      </aside>
      
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-semibold mb-6">Welcome to the Admin Dashboard</h1>
        <p className="text-gray-600">Manage your store efficiently.</p>
        
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Coupon Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCoupon} className="space-y-4">
                    <div>
                      <Label htmlFor="code">Coupon Code</Label>
                      <Input
                        id="code"
                        value={newCoupon.code}
                        onChange={(e) =>
                          setNewCoupon({ ...newCoupon, code: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount_type">Discount Type</Label>
                      <Select
                        value={newCoupon.discount_type}
                        onValueChange={(value) =>
                          setNewCoupon({ ...newCoupon, discount_type: value })
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
                      <Label htmlFor="discount_value">Discount Value</Label>
                      <Input
                        id="discount_value"
                        type="number"
                        value={newCoupon.discount_value}
                        onChange={(e) =>
                          setNewCoupon({
                            ...newCoupon,
                            discount_value: parseFloat(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimum_order_amount">
                        Minimum Order Amount
                      </Label>
                      <Input
                        id="minimum_order_amount"
                        type="number"
                        value={newCoupon.minimum_order_amount}
                        onChange={(e) =>
                          setNewCoupon({
                            ...newCoupon,
                            minimum_order_amount: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_uses">Maximum Uses</Label>
                      <Input
                        id="max_uses"
                        type="number"
                        value={newCoupon.max_uses || ""}
                        onChange={(e) =>
                          setNewCoupon({
                            ...newCoupon,
                            max_uses: e.target.value ? parseInt(e.target.value) : null,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="expires_at">Expiry Date</Label>
                      <Input
                        id="expires_at"
                        type="datetime-local"
                        value={newCoupon.expires_at}
                        onChange={(e) =>
                          setNewCoupon({ ...newCoupon, expires_at: e.target.value })
                        }
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Coupon
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Min. Order</TableHead>
                      <TableHead>Uses</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-medium">{coupon.code}</TableCell>
                        <TableCell>{coupon.discount_type}</TableCell>
                        <TableCell>
                          {coupon.discount_type === "percentage"
                            ? `${coupon.discount_value}%`
                            : `₹${coupon.discount_value}`}
                        </TableCell>
                        <TableCell>₹{coupon.minimum_order_amount}</TableCell>
                        <TableCell>
                          {coupon.used_count} / {coupon.max_uses || "∞"}
                        </TableCell>
                        <TableCell>
                          {coupon.expires_at
                            ? new Date(coupon.expires_at).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
        
      </main>
    </div>
  );
}
