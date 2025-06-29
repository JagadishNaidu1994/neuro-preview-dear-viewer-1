import { useState } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaShieldAlt, FaKey, FaHistory } from "react-icons/fa";

const Security = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // In a real app, you'd update the password via Supabase
    console.log("Updating password...");
    alert("Password updated successfully!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        <div className="space-y-8">
          {/* Password Change */}
          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <div className="flex items-center mb-8">
              <FaKey className="text-[#514B3D] text-2xl mr-4" />
              <h1 className="text-3xl font-semibold">Change Password</h1>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-2"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                className="bg-[#514B3D] hover:bg-[#3f3a2f]"
              >
                Update Password
              </Button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <div className="flex items-center mb-8">
              <FaShieldAlt className="text-[#514B3D] text-2xl mr-4" />
              <h2 className="text-3xl font-semibold">Two-Factor Authentication</h2>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold mb-2">SMS Authentication</h3>
                <p className="text-gray-600 text-sm">
                  Add an extra layer of security to your account with SMS verification
                </p>
              </div>
              <Button variant="outline">
                Enable 2FA
              </Button>
            </div>
          </div>

          {/* Login History */}
          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <div className="flex items-center mb-8">
              <FaHistory className="text-[#514B3D] text-2xl mr-4" />
              <h2 className="text-3xl font-semibold">Recent Login Activity</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-xl">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-gray-600">San Francisco, CA • Chrome on macOS</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">Active Now</p>
                  <p className="text-xs text-gray-500">IP: 192.168.1.1</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-xl">
                <div>
                  <p className="font-medium">Previous Session</p>
                  <p className="text-sm text-gray-600">San Francisco, CA • Safari on iPhone</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">2 hours ago</p>
                  <p className="text-xs text-gray-500">IP: 192.168.1.2</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-xl">
                <div>
                  <p className="font-medium">Previous Session</p>
                  <p className="text-sm text-gray-600">San Francisco, CA • Chrome on macOS</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Yesterday</p>
                  <p className="text-xs text-gray-500">IP: 192.168.1.1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Deletion */}
          <div className="bg-white rounded-2xl p-10 shadow-sm border-2 border-red-100">
            <h2 className="text-2xl font-semibold mb-6 text-red-600">Danger Zone</h2>
            
            <div className="p-6 bg-red-50 rounded-xl">
              <h3 className="font-semibold mb-2 text-red-800">Delete Account</h3>
              <p className="text-red-700 text-sm mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;