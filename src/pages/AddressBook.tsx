import { useState } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus, FaEdit, FaTrash, FaHome, FaBriefcase } from "react-icons/fa";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "home",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      type: "work",
      firstName: "John",
      lastName: "Doe",
      address: "456 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
      isDefault: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <FaHome className="text-[#514B3D]" />;
      case "work":
        return <FaBriefcase className="text-[#514B3D]" />;
      default:
        return <FaHome className="text-[#514B3D]" />;
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
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
              setEditingAddress(null);
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
                    {getAddressIcon(address.type)}
                    <div>
                      <h3 className="font-semibold capitalize">{address.type} Address</h3>
                      {address.isDefault && (
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
                  <p className="font-medium text-gray-900">
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                </div>

                {!address.isDefault && (
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
            
            <form className="space-y-6">
              <div>
                <Label htmlFor="type">Address Type</Label>
                <select
                  id="type"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
                  defaultValue={editingAddress?.type || "home"}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={editingAddress?.firstName || ""}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={editingAddress?.lastName || ""}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  defaultValue={editingAddress?.address || ""}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    defaultValue={editingAddress?.city || ""}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    defaultValue={editingAddress?.state || ""}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    defaultValue={editingAddress?.zipCode || ""}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    defaultValue={editingAddress?.country || "United States"}
                    className="mt-2"
                  />
                </div>
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