import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";

const AccountPage = () => {
  const { session, user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  if (!session) return null; // This page is protected already

  return (
    <div className="bg-[#F8F8F5] min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto py-20 px-4 text-[#161616]">
        <h1 className="text-3xl font-semibold mb-6">My Account</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <p><strong>Email:</strong> {user?.email}</p>
          {profile && (
            <>
              <p><strong>First Name:</strong> {profile.first_name}</p>
              <p><strong>Last Name:</strong> {profile.last_name}</p>
            </>
          )}
        </div>

        <button
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          className="mt-8 bg-[#514B3D] text-white py-2 px-6 rounded-xl hover:bg-[#63584e]"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
