import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import ContactSubmissionsTab from "@/components/admin/ContactSubmissionsTab";
import OrderViewDialog from "@/components/admin/OrderViewDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_email?: string;
  shipping_address?: any;
}

interface Journal {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  image_url?: string;
  published: boolean;
  created_at: string;
}

interface CouponCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimated_days: string;
  is_active: boolean;
}

const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  // Editing states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<CouponCode | null>(null);
  const [editingShipping, setEditingShipping] = useState<ShippingMethod | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock_quantity: "",
  });

  const [journalForm, setJournalForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "DearNeuro Team",
    image_url: "",
    published: false,
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    minimum_order_amount: "",
    max_uses: "",
    expires_at: "",
  });

  const [shippingForm, setShippingForm] = useState({
    name: "",
    description: "",
    price: "",
    estimated_days: "",
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
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const userIds = [...new Set((ordersData || []).map(order => order.user_id))];
      const { data: usersData } = await supabase
        .from("users")
        .select("id, email")
        .in("id", userIds);

      const ordersWithEmails = (ordersData || []).map(order => ({
        ...order,
        user_email: usersData?.find(user => user.id === order.user_id)?.email || "N/A"
      }));
      
      setOrders(ordersWithEmails);
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

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from("coupon_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const fetchShippingMethods = async () => {
    try {
      const { data, error } = await supabase
        .from("shipping_methods")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShippingMethods(data || []);
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    }
  };

  // Helper functions for form handling
  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "",
      stock_quantity: "",
    });
  };

  const resetJournalForm = () => {
    setJournalForm({
      title: "",
      content: "",
      excerpt: "",
      author: "DearNeuro Team",
      image_url: "",
      published: false,
    });
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      minimum_order_amount: "",
      max_uses: "",
      expires_at: "",
    });
  };

  const resetShippingForm = () => {
    setShippingForm({
      name: "",
      description: "",
      price: "",
      estimated_days: "",
    });
  };

  // Generate consistent order number function
  const generateOrderNumber = (orderId: string) => {
    // Use the order creation timestamp or database position to generate consistent serial numbers
    const orderIndex = orders.findIndex(o => o.id === orderId);
    const serialNumber = orders.length - orderIndex;
    return String(serialNumber).padStart(3, '0');
  };

  // CRUD operations
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        image_url: productForm.image_url,
        category: productForm.category,
        stock_quantity: parseInt(productForm.stock_quantity),
        is_active: productForm.stock_quantity === "0" ? false : true, // Auto-disable if no stock
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        toast({ title: "Success", description: "Product created successfully" });
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      resetProductForm();
      await fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle product stock status
  const toggleProductStock = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !currentStatus })
        .eq("id", productId);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Product ${!currentStatus ? 'activated' : 'deactivated'} successfully` 
      });
      await fetchProducts();
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const journalData = {
        title: journalForm.title,
        content: journalForm.content,
        excerpt: journalForm.excerpt,
        author: journalForm.author,
        image_url: journalForm.image_url,
        published: journalForm.published,
      };

      if (editingJournal) {
        const { error } = await supabase
          .from("journals")
          .update({ ...journalData, updated_at: new Date().toISOString() })
          .eq("id", editingJournal.id);

        if (error) throw error;
        toast({ title: "Success", description: "Journal updated successfully" });
      } else {
        const { error } = await supabase
          .from("journals")
          .insert([journalData]);

        if (error) throw error;
        toast({ title: "Success", description: "Journal created successfully" });
      }

      setIsJournalModalOpen(false);
      setEditingJournal(null);
      resetJournalForm();
      await fetchJournals();
    } catch (error) {
      console.error("Error saving journal:", error);
      toast({
        title: "Error",
        description: "Failed to save journal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const couponData = {
        code: couponForm.code.toUpperCase(),
        discount_type: couponForm.discount_type,
        discount_value: parseFloat(couponForm.discount_value),
        minimum_order_amount: parseFloat(couponForm.minimum_order_amount) || 0,
        max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
        expires_at: couponForm.expires_at ? new Date(couponForm.expires_at).toISOString() : null,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from("coupon_codes")
          .update({ ...couponData, updated_at: new Date().toISOString() })
          .eq("id", editingCoupon.id);

        if (error) throw error;
        toast({ title: "Success", description: "Coupon updated successfully" });
      } else {
        const { error } = await supabase
          .from("coupon_codes")
          .insert([couponData]);

        if (error) throw error;
        toast({ title: "Success", description: "Coupon created successfully" });
      }

      setIsCouponModalOpen(false);
      setEditingCoupon(null);
      resetCouponForm();
      await fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast({
        title: "Error",
        description: "Failed to save coupon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shippingData = {
        name: shippingForm.name,
        description: shippingForm.description,
        price: parseFloat(shippingForm.price),
        estimated_days: shippingForm.estimated_days,
      };

      if (editingShipping) {
        const { error } = await supabase
          .from("shipping_methods")
          .update(shippingData)
          .eq("id", editingShipping.id);

        if (error) throw error;
        toast({ title: "Success", description: "Shipping method updated successfully" });
      } else {
        const { error } = await supabase
          .from("shipping_methods")
          .insert([shippingData]);

        if (error) throw error;
        toast({ title: "Success", description: "Shipping method created successfully" });
      }

      setIsShippingModalOpen(false);
      setEditingShipping(null);
      resetShippingForm();
      await fetchShippingMethods();
    } catch (error) {
      console.error("Error saving shipping method:", error);
      toast({
        title: "Error",
        description: "Failed to save shipping method",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
      toast({ title: "Success", description: "Order status updated successfully" });
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Edit handlers
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      image_url: product.image_url || "",
      category: product.category || "",
      stock_quantity: product.stock_quantity.toString(),
    });
    setIsProductModalOpen(true);
  };

  const handleEditJournal = (journal: Journal) => {
    setEditingJournal(journal);
    setJournalForm({
      title: journal.title,
      content: journal.content,
      excerpt: journal.excerpt || "",
      author: journal.author || "DearNeuro Team",
      image_url: journal.image_url || "",
      published: journal.published,
    });
    setIsJournalModalOpen(true);
  };

  const handleEditCoupon = (coupon: CouponCode) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      minimum_order_amount: coupon.minimum_order_amount.toString(),
      max_uses: coupon.max_uses?.toString() || "",
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : "",
    });
    setIsCouponModalOpen(true);
  };

  const handleEditShipping = (shipping: ShippingMethod) => {
    setEditingShipping(shipping);
    setShippingForm({
      name: shipping.name,
      description: shipping.description || "",
      price: shipping.price.toString(),
      estimated_days: shipping.estimated_days,
    });
    setIsShippingModalOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your store and orders</p>
          </div>

          {/* Dashboard Overview */}
          {activeTab === "dashboard" && <DashboardOverview />}

          {/* Products Tab */}
          {activeTab === "products" && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-foreground">Products Management</CardTitle>
                <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingProduct(null);
                      resetProductForm();
                    }}>
                      <FaPlus className="mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm({ ...productForm, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm({ ...productForm, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) =>
                              setProductForm({ ...productForm, price: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock Quantity</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={productForm.stock_quantity}
                            onChange={(e) =>
                              setProductForm({ ...productForm, stock_quantity: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({ ...productForm, category: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          value={productForm.image_url}
                          onChange={(e) =>
                            setProductForm({ ...productForm, image_url: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsProductModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Product"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Image</TableHead>
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Price</TableHead>
                      <TableHead className="text-muted-foreground">Stock</TableHead>
                      <TableHead className="text-muted-foreground">Category</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-border">
                        <TableCell>
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded border border-border"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                        <TableCell className="text-foreground">${product.price}</TableCell>
                        <TableCell className="text-foreground">{product.stock_quantity}</TableCell>
                        <TableCell className="text-foreground">{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant={product.is_active ? "default" : "secondary"}>
                              {product.is_active ? "Active" : "Out of Stock"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProductStock(product.id, product.is_active)}
                              className="border-border"
                            >
                              {product.is_active ? "Disable" : "Enable"}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
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

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Order #</TableHead>
                      <TableHead className="text-muted-foreground">Customer</TableHead>
                      <TableHead className="text-muted-foreground">Total</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-border">
                        <TableCell className="font-mono text-sm text-foreground">
                          #{generateOrderNumber(order.id)}
                        </TableCell>
                        <TableCell className="text-foreground">{order.user_email || "N/A"}</TableCell>
                        <TableCell className="text-foreground">${order.total_amount}</TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-foreground">
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
          {activeTab === "messages" && <ContactSubmissionsTab />}

          {/* Journals Tab */}
          {activeTab === "journals" && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-foreground">Journals Management</CardTitle>
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
                      <div className="grid grid-cols-2 gap-4">
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
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Title</TableHead>
                      <TableHead className="text-muted-foreground">Author</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Created</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
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
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-foreground">Coupon Codes Management</CardTitle>
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
                      <div className="grid grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-2 gap-4">
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
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Code</TableHead>
                      <TableHead className="text-muted-foreground">Type</TableHead>
                      <TableHead className="text-muted-foreground">Value</TableHead>
                      <TableHead className="text-muted-foreground">Min Order</TableHead>
                      <TableHead className="text-muted-foreground">Used/Max</TableHead>
                      <TableHead className="text-muted-foreground">Expires</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                        <TableCell>{coupon.discount_type}</TableCell>
                        <TableCell>
                          {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                        </TableCell>
                        <TableCell>${coupon.minimum_order_amount}</TableCell>
                        <TableCell>
                          {coupon.used_count}/{coupon.max_uses || "∞"}
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
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-foreground">Shipping Methods Management</CardTitle>
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
                      <div className="grid grid-cols-2 gap-4">
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
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Description</TableHead>
                      <TableHead className="text-muted-foreground">Price</TableHead>
                      <TableHead className="text-muted-foreground">Estimated Days</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
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
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditShipping(shipping)}
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
        </div>
      </div>

      {/* Order View Dialog */}
      <OrderViewDialog
        order={selectedOrder}
        isOpen={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
