import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const sections = [
  { icon: "👤", label: "Account Settings", link: "#" },
  { icon: "📦", label: "Subscriptions", link: "#" },
  { icon: "🧾", label: "Order History", link: "#" },
  { icon: "⚙️", label: "Preferences", link: "#" },
  { icon: "📨", label: "Contact Us", link: "#" },
  { icon: "🔒", label: "Security", link: "#" },
  { icon: "📬", label: "Address Book", link: "#" },
  { icon: "💳", label: "Payment Methods", link: "#" },
];

export default function AccountPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-[#f8f8f5] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">My Account</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {sections.map(({ icon, label, link }) => (
              <a
                key={label}
                href={link}
                className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 flex flex-col justify-center items-center p-6 text-center"
              >
                <div className="text-3xl mb-2">{icon}</div>
                <span className="text-sm font-medium text-gray-800">{label}</span>
              </a>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleLogout}
              className="bg-[#514B3D] hover:bg-[#5a5147] text-white px-6 py-2 rounded-full"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
