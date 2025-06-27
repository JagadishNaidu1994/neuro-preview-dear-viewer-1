import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.given_name ||
    user?.user_metadata?.full_name?.split(" ")?.[0] ||
    user?.email?.split("@")[0] ||
    "";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const accountOptions = [
    { label: "Account Settings", icon: "👤" },
    { label: "Subscriptions", icon: "📦" },
    { label: "Order History", icon: "📄" },
    { label: "Preferences", icon: "⚙️" },
    { label: "Contact Us", icon: "✉️" },
    { label: "Security", icon: "🔒" },
    { label: "Address Book", icon: "📬" },
    { label: "Payment Methods", icon: "💳" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountOptions.map((item) => (
          <div
            key={item.label}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md cursor-pointer text-center"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-medium">{item.label}</div>
          </div>
        ))}

        <div
          onClick={handleLogout}
          className="bg-white p-5 rounded-lg shadow hover:shadow-md cursor-pointer text-center"
        >
          <div className="text-3xl mb-2">🚪</div>
          <div className="font-medium">Log Out</div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
