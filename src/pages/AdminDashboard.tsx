import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductsTab from "@/components/admin/ProductsTab";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [activeTab, setActiveTab] = useState("coupons");
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

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchJournals(),
      fetchCoupons(),
      fetchShippingMethods(),
    ]);
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      // Fetch orders first
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user details for each order
      const ordersWithUsers: OrderWithUser[] = [];
      if (ordersData) {
        for (const order of ordersData) {
          let userData = null;
          if (order.user_id) {
            const { data: user } = await supabase
              .from("users")
              .select("email, first_name, last_name")
              .eq("id", order.user_id)
              .single();
            userData = user;
          }

          ordersWithUsers.push({
            ...order,
            users: userData
          });
        }
      }

      setOrders(ordersWithUsers);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };
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
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("coupons")}
              >
                Coupons
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("products")}
              >
                Products
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Orders
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <h1 className="text-3xl font-semibold mb-6">Welcome to the Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your store efficiently.</p>

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
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter(
                        (order) =>
                          (order.users?.first_name
                            ?.toLowerCase()
                            .includes(orderSearchTerm.toLowerCase()) ||
                          order.users?.last_name
                            ?.toLowerCase()
                            .includes(orderSearchTerm.toLowerCase()) ||
                          order.users?.email
                            ?.toLowerCase()
                            .includes(orderSearchTerm.toLowerCase()) ||
                          order.id.includes(orderSearchTerm)) &&
                          (orderStatusFilter === "all" || order.status === orderStatusFilter)
                      )
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            #{generateOrderNumber(order.id)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {order.users?.first_name
                                  ? `${order.users.first_name} ${
                                      order.users.last_name || ""
                                    }`.trim()
                                  : order.users?.email || "Guest User"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.users?.email || "No email"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>₹{order.total_amount}</TableCell>
                          <TableCell>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className="border rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewOrder(order)}
                            >
                              <FaEye />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && <MessagesSection />}

          {/* Shipping Tab */}
          {activeTab === "shipping" && <ShippingTab />}

          {/* Expenses Tab */}
          {activeTab === "expenses" && <ExpensesTab />}

          {/* Reviews Tab */}
          {activeTab === "reviews" && <ReviewsTab />}

          {/* Content Tab */}
          {activeTab === "content" && <ContentTab />}

          {/* Journals Tab */}
          {activeTab === "journals" && (
            <Card className="bg-white">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Journals Management</CardTitle>
                <Dialog open={isJournalModalOpen} onOpenChange={setIsJournalModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingJournal(null);
                      resetJournalForm();
                    }}>
                      <FaPlus className="mr-2" />
                      Add Journal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingJournal ? "Edit Journal" : "Add New Journal"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleJournalSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={journalForm.title}
                          onChange={(e) =>
                            setJournalForm({ ...journalForm, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={journalForm.excerpt}
                          onChange={(e) =>
                            setJournalForm({ ...journalForm, excerpt: e.target.value })
                          }
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={journalForm.content}
                          onChange={(e) =>
                            setJournalForm({ ...journalForm, content: e.target.value })
                          }
                          rows={10}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            value={journalForm.author}
                            onChange={(e) =>
                              setJournalForm({ ...journalForm, author: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="journal_image_url">Image URL</Label>
                          <Input
                            id="journal_image_url"
                            value={journalForm.image_url}
                            onChange={(e) =>
                              setJournalForm({ ...journalForm, image_url: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="published"
                          checked={journalForm.published}
                          onChange={(e) =>
                            setJournalForm({ ...journalForm, published: e.target.checked })
                          }
                        />
                        <Label htmlFor="published">Published</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsJournalModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Journal"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journals.map((journal) => (
                      <TableRow key={journal.id}>
                        <TableCell className="font-medium">{journal.title}</TableCell>
                        <TableCell>{journal.author}</TableCell>
                        <TableCell>
                          <Badge variant={journal.published ? "default" : "secondary"}>
                            {journal.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(journal.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditJournal(journal)}
                            >
                              <FaEdit />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Coupons Tab */}
          {activeTab === "coupons" && (
            <Card className="bg-white">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Coupon Codes Management</CardTitle>
                <Dialog open={isCouponModalOpen} onOpenChange={setIsCouponModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingCoupon(null);
                      resetCouponForm();
                    }}>
                      <FaPlus className="mr-2" />
                      Add Coupon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCouponSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="code">Coupon Code</Label>
                        <Input
                          id="code"
                          value={couponForm.code}
                          onChange={(e) =>
                            setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discount_type">Discount Type</Label>
                          <select
                            id="discount_type"
                            value={couponForm.discount_type}
                            onChange={(e) =>
                              setCouponForm({ ...couponForm, discount_type: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="discount_value">
                            Discount Value {couponForm.discount_type === "percentage" ? "(%)" : "($)"}
                          </Label>
                          <Input
                            id="discount_value"
                            type="number"
                            step="0.01"
                            value={couponForm.discount_value}
                            onChange={(e) =>
                              setCouponForm({ ...couponForm, discount_value: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minimum_order_amount">Minimum Order Amount ($)</Label>
                          <Input
                            id="minimum_order_amount"
                            type="number"
                            step="0.01"
                            value={couponForm.minimum_order_amount}
                            onChange={(e) =>
                              setCouponForm({ ...couponForm, minimum_order_amount: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="max_uses">Max Uses (optional)</Label>
                          <Input
                            id="max_uses"
                            type="number"
                            value={couponForm.max_uses}
                            onChange={(e) =>
                              setCouponForm({ ...couponForm, max_uses: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="expires_at">Expiry Date (optional)</Label>
                        <Input
                          id="expires_at"
                          type="date"
                          value={couponForm.expires_at}
                          onChange={(e) =>
                            setCouponForm({ ...couponForm, expires_at: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCouponModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Coupon"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="overflow-x-auto">
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
                            : "Never"
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={coupon.is_active ? "default" : "secondary"}>
                            {coupon.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCoupon(coupon)}
                            >
                              <FaEdit />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <Card className="bg-white">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Shipping Methods Management</CardTitle>
                <Dialog open={isShippingModalOpen} onOpenChange={setIsShippingModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingShipping(null);
                      resetShippingForm();
                    }}>
                      <FaPlus className="mr-2" />
                      Add Shipping Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingShipping ? "Edit Shipping Method" : "Add New Shipping Method"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="shipping_name">Name</Label>
                        <Input
                          id="shipping_name"
                          value={shippingForm.name}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping_description">Description</Label>
                        <Textarea
                          id="shipping_description"
                          value={shippingForm.description}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shipping_price">Price ($)</Label>
                          <Input
                            id="shipping_price"
                            type="number"
                            step="0.01"
                            value={shippingForm.price}
                            onChange={(e) =>
                              setShippingForm({ ...shippingForm, price: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="estimated_days">Estimated Days</Label>
                          <Input
                            id="estimated_days"
                            value={shippingForm.estimated_days}
                            onChange={(e) =>
                              setShippingForm({ ...shippingForm, estimated_days: e.target.value })
                            }
                            placeholder="e.g., 3-5 days"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsShippingModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Shipping Method"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Estimated Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shippingMethods.map((shipping) => (
                      <TableRow key={shipping.id}>
                        <TableCell className="font-medium">{shipping.name}</TableCell>
                        <TableCell>{shipping.description || "N/A"}</TableCell>
                        <TableCell>${shipping.price}</TableCell>
                        <TableCell>{shipping.estimated_days}</TableCell>
                        <TableCell>
                          <Badge variant={shipping.is_active ? "default" : "secondary"}>
                            {shipping.is_active ? "Active" : "Inactive"}
                          </Badge>
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

        {activeTab === "products" && <ProductsTab />}
      </main>
    </div>
  );
}
