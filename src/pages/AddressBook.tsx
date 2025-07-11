
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FaPlus, FaEdit, FaTrash, FaHome, FaBriefcase } from "react-icons/fa";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_default", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
        variant: "destructive"
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
      is_default: address.is_default
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
        description: "Address deleted successfully"
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, unset all default addresses
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
        description: "Default address updated"
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const addressData = {
        ...formData,
        user_id: user.id
      };

      if (formData.is_default) {
        // Unset all other default addresses first
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from("user_addresses")
          .update(addressData)
          .eq("id", editingAddress.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address updated successfully"
        });
      } else {
        // Create new address
        const { error } = await supabase
          .from("user_addresses")
          .insert([addressData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address added successfully"
        });
      }

      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        name: "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    }
  };

  const getAddressIcon = (isDefault: boolean) => {
    return isDefault ? <FaHome className="text-[#514B3D]" /> : <FaBriefcase className="text-[#514B3D]" />;
  };

  if (!user) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#514B3D]"></div>
        </div>
      </div>
    );
  }

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
              setEditingAddress(null);
              setFormData({
                name: "",
                phone: "",
                address_line_1: "",
                address_line_2: "",
                city: "",
                state: "",
                pincode: "",
                is_default: false
              });
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
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {getAddressIcon(address.is_default)}
                    <div>
                      <h3 className="font-semibold capitalize">
                        {address.is_default ? "Default Address" : "Address"}
                      </h3>
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
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p>{address.phone}</p>
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
            ))}
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="address_line_1">Street Address</Label>
                <Input
                  id="address_line_1"
                  value={formData.address_line_1}
                  onChange={(e) => setFormData({...formData, address_line_1: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="address_line_2">Apartment/Suite (Optional)</Label>
                <Input
                  id="address_line_2"
                  value={formData.address_line_2}
                  onChange={(e) => setFormData({...formData, address_line_2: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({...formData, is_default: checked as boolean})}
                />
                <Label htmlFor="is_default">Set as default address</Label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-[#514B3D] hover:bg-[#3f3a2f]"
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
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
