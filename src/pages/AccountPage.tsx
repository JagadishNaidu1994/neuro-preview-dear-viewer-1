import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const AccountPage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        <h1 className="text-4xl font-semibold text-[#161616]">My Account</h1>

        <div className="space-y-8">
          <Section title="Account Settings">
            <p>Email: {user?.email}</p>
          </Section>

          <Section title="Subscriptions">
            <p>No active subscriptions yet.</p>
          </Section>

          <Section title="Order History">
            <p>You haven't placed any orders yet.</p>
          </Section>

          <Section title="Settings">
            <p>Additional preferences coming soon.</p>
          </Section>

          <Section title="Contact Us">
            <p>Need help? Reach out at support@dearneuro.com</p>
          </Section>

          <button
            onClick={handleLogout}
            className="bg-[#514B3D] text-white py-2 px-6 rounded-xl hover:bg-[#665c50] transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="text-xl font-semibold mb-2 text-[#1E1E1E]">{title}</h2>
    <div className="text-[#231F20] text-sm">{children}</div>
  </div>
);

export default AccountPage;
