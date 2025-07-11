
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus, FaEdit, FaTrash, FaHome, FaBriefcase } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const AddressBook = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching addresses:", error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      });
    } else {
      setAddresses(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      pincode: "",
      is_default: false,
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // If setting as default, update all others to non-default first
      if (formData.is_default) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      const addressData = {
        ...formData,
        user_id: user.id,
      };

      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from("user_addresses")
          .update(addressData)
          .eq("id", editingAddress.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        // Create new address
        const { error } = await supabase
          .from("user_addresses")
          .insert([addressData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, set all addresses to non-default
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user?.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Default address updated",
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-semibold mb-4">Address Book</h1>
            <p className="text-gray-600 text-lg">
              Manage your shipping addresses for faster checkout.
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-[#514B3D] hover:bg-[#3f3a2f]"
          >
            <FaPlus className="mr-2" />
            Add Address
          </Button>
        </div>

        {!showForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No addresses found</p>
                <p className="text-gray-400">Add your first address to get started</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <FaHome className="text-[#514B3D]" />
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        {address.is_default && (
                          <span className="text-xs bg-[#514B3D] text-white px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(address)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(address.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-600">
                    <p className="font-medium text-gray-900">{address.name}</p>
                    <p>{address.phone}</p>
                    <p>{address.address_line_1}</p>
                    {address.address_line_2 && <p>{address.address_line_2}</p>}
                    <p>{address.city}, {address.state} {address.pincode}</p>
                  </div>

                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-4"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-semibold mb-8">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address_line_1">Address Line 1</Label>
                <Input
                  id="address_line_1"
                  name="address_line_1"
                  value={formData.address_line_1}
                  onChange={handleInputChange}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line_2"
                  name="address_line_2"
                  value={formData.address_line_2}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="mt-2"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="is_default">Set as default address</Label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#514B3D] hover:bg-[#3f3a2f]"
                >
                  {loading ? "Saving..." : (editingAddress ? "Update Address" : "Add Address")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;
