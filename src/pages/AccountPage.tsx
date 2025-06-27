import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";

const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const sections = [
    {
      title: "Account Settings",
      description: user?.email || "Not available",
      icon: "👤",
      onClick: () => {}, // can add modal
    },
    {
      title: "Subscriptions",
      description: "No active subscriptions yet.",
      icon: "📦",
      onClick: () => {}, // navigate('/subscriptions')
    },
    {
      title: "Order History",
      description: "You haven’t placed any orders yet.",
      icon: "🧾",
      onClick: () => {}, // navigate('/orders')
    },
    {
      title: "Settings",
      description: "Additional preferences coming soon.",
      icon: "⚙️",
      onClick: () => {},
    },
    {
      title: "Contact Us",
      description: "Need help? Reach out at support@dearneuro.com",
      icon: "📨",
      onClick: () => {
        window.open("mailto:support@dearneuro.com");
      },
    },
  ];

  const handleLogout = async () => {
    const { error } = await import("@/lib/supabaseClient").then((mod) =>
      mod.supabase.auth.signOut()
    );
    if (!error) navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">My Account</h1>

      <div className="space-y-4">
        {sections.map((section, idx) => (
          <button
            key={idx}
            onClick={section.onClick}
            className="w-full flex items-start gap-4 bg-[#f6f5f3] hover:bg-[#f0eee9] rounded-xl p-4 text-left transition-shadow shadow-sm hover:shadow-md"
          >
            <div className="text-2xl">{section.icon}</div>
            <div>
              <h2 className="font-semibold text-lg">{section.title}</h2>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4">
        <Button onClick={handleLogout} className="bg-[#514B3D] hover:bg-[#5a5147]">
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default AccountPage;
