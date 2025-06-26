import { useNavigate } from "react-router-dom";
import { useSupabase } from "../context/AuthProvider";

const AccountPage = () => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-8 bg-[#F8F8F5] text-[#161616]">
      <h1 className="text-3xl font-bold mb-6">Account Dashboard</h1>
      <ul className="space-y-4">
        <li>Account Settings</li>
        <li>Subscriptions</li>
        <li>Order History</li>
        <li>Settings</li>
        <li>Contact Us</li>
        <li>
          <button onClick={handleLogout} className="text-red-600 hover:underline">
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountPage;
