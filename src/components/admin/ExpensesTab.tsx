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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseCategory {
    id: string;
    name: string;
}

const ExpensesTab = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);

  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  const [categoryForm, setCategoryForm] = useState({ name: "" });

  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false });
      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
        const { data, error } = await supabase
            .from("expense_categories")
            .select("*")
            .order("name", { ascending: true });
        if (error) throw error;
        setCategories(data || []);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
  };

  const resetExpenseForm = () => {
    setEditingExpense(null);
    setExpenseForm({ description: "", amount: "", category: "", date: "" });
  };
  
  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "" });
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find or create the category
      let categoryName = expenseForm.category.trim();
      const existingCategory = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

      if (!existingCategory && categoryName) {
        const { data: newCategory, error } = await supabase
            .from("expense_categories")
            .insert({ name: categoryName })
            .select()
            .single();
        if (error) throw error;
        fetchCategories(); // Refresh categories list
      }
      
      const expenseData = {
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        category: categoryName,
        date: expenseForm.date,
      };

      if (editingExpense) {
        await supabase.from("expenses").update(expenseData).eq("id", editingExpense.id);
        toast({ title: "Success", description: "Expense updated." });
      } else {
        await supabase.from("expenses").insert([expenseData]);
        toast({ title: "Success", description: "Expense created." });
      }
      
      setIsExpenseModalOpen(false);
      resetExpenseForm();
      fetchExpenses();

    } catch (error) {
      console.error("Error saving expense:", error);
      toast({ title: "Error", description: "Failed to save expense.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return; // For now, only editing is handled here. Add is separate.

    try {
        await supabase
          .from('expense_categories')
          .update({ name: categoryForm.name })
          .eq('id', editingCategory.id);
        
        toast({ title: "Success", description: "Category updated." });
        setIsCategoryModalOpen(false);
        resetCategoryForm();
        fetchCategories();

    } catch (error) {
        console.error("Error updating category", error);
        toast({ title: "Error", description: "Failed to update category.", variant: "destructive" });
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    });
    setIsExpenseModalOpen(true);
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    await supabase.from("expenses").delete().eq("id", id);
    toast({ title: "Success", description: "Expense deleted." });
    fetchExpenses();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This cannot be undone.")) return;
    await supabase.from("expense_categories").delete().eq("id", id);
    toast({ title: "Success", description: "Category deleted." });
    fetchCategories();
  };


  return (
    <div className="space-y-8">
      {/* Expenses Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expenses</CardTitle>
            <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
            <DialogTrigger asChild>
                <Button onClick={resetExpenseForm}>
                <FaPlus className="mr-2" />
                Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>
                    {editingExpense ? "Edit Expense" : "Add Expense"}
                </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div>
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} required />
                  </div>
                  <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} required />
                  </div>
                  <div>
                      <Label htmlFor="category">Category</Label>
                      <Combobox
                          options={categories.map(c => ({ value: c.name, label: c.name }))}
                          value={expenseForm.category}
                          onChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
                          placeholder="Select or create a category"
                          searchPlaceholder="Search or type new category..."
                      />
                  </div>
                  <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} required />
                  </div>
                  <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                  </div>
                </form>
            </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
                    ) : expenses.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center">No expenses found</TableCell></TableRow>
                    ) : (
                    expenses.map((expense) => (
                        <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditExpense(expense)}><FaEdit /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteExpense(expense.id)}><FaTrash /></Button>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card>
        <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map(category => (
                        <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}><FaEdit /></Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(category.id)}><FaTrash /></Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Edit Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input id="categoryName" value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} required />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {setIsCategoryModalOpen(false); resetCategoryForm();}}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesTab;
