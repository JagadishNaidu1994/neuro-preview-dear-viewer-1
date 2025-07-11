
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setUserProfile(data);
      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        dateOfBirth: data.date_of_birth || "",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update the users table
      const { error: dbError } = await supabase
        .from("users")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (dbError) throw dbError;

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          given_name: formData.firstName,
          family_name: formData.lastName,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
        },
      });

      if (authError) throw authError;

      alert("Profile updated successfully!");
      fetchUserProfile(); // Refresh profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get avatar URL from user metadata
  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-semibold mb-8">Profile Settings</h1>
          
          {/* Profile Avatar and Info */}
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {getAvatarUrl() ? (
                <img 
                  src={getAvatarUrl()} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#514B3D] flex items-center justify-center text-white text-xl font-semibold">
                  {(formData.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {formData.firstName || formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}`.trim()
                  : "Your Profile"
                }
              </h2>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2"
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
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#514B3D] hover:bg-[#3f3a2f]"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
