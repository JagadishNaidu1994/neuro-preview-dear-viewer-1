import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimated_days: string;
  is_active: boolean;
}

const ShippingTab = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    estimated_days: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shipping_methods")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setShippingMethods(data || []);
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      estimated_days: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shippingData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        estimated_days: form.estimated_days,
      };

      if (editingMethod) {
        const { error } = await supabase
          .from("shipping_methods")
          .update(shippingData)
          .eq("id", editingMethod.id);
        if (error) throw error;
        toast({ title: "Success", description: "Shipping method updated." });
      } else {
        const { error } = await supabase
          .from("shipping_methods")
          .insert([shippingData]);
        if (error) throw error;
        toast({ title: "Success", description: "Shipping method created." });
      }

      setIsModalOpen(false);
      setEditingMethod(null);
      resetForm();
      await fetchShippingMethods();
    } catch (error) {
      console.error("Error saving shipping method:", error);
      toast({
        title: "Error",
        description: "Failed to save shipping method.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setForm({
      name: method.name,
      description: method.description || "",
      price: method.price.toString(),
      estimated_days: method.estimated_days,
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Shipping Methods</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingMethod(null);
              resetForm();
            }}>
              <FaPlus className="mr-2" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? "Edit Shipping Method" : "Add Shipping Method"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estimated_days">Estimated Days</Label>
                <Input
                  id="estimated_days"
                  value={form.estimated_days}
                  onChange={(e) => setForm({ ...form, estimated_days: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Estimated Days</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              shippingMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.description}</TableCell>
                  <TableCell>${method.price.toFixed(2)}</TableCell>
                  <TableCell>{method.estimated_days}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(method)}
                      >
                        <FaEdit />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <FaTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShippingTab;
