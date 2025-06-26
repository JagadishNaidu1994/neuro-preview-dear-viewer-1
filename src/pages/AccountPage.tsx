// src/pages/AccountPage.tsx
import { useAuth } from "@/context/AuthProvider";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-[#F8F8F5] min-h-screen">
      <Header />
      <div className="max-w-[800px] mx-auto px-4 py-16">
        <h1 className="text-4xl font-semibold text-[#161616] mb-6">Account</h1>

        <div className="space-y-6">
          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-2">Account Settings</h2>
            <p className="text-sm text-[#666]">Email: {user?.email}</p>
          </section>

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-2">Subscriptions</h2>
            <p className="text-sm text-[#666]">You don’t have any active subscriptions.</p>
          </section>

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-2">Order History</h2>
            <p className="text-sm text-[#666]">No orders found.</p>
          </section>

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-2">Contact Us</h2>
            <p className="text-sm text-[#666]">Need help? <a href="mailto:support@dearneuro.com" className="text-[#514B3D] underline">Email support</a>.</p>
          </section>

          <div>
            <Button
              onClick={handleLogout}
              className="bg-[#514B3D] hover:bg-[#665847] text-white rounded-xl px-6 py-3"
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
