import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert("Error resetting password: " + error.message);
    } else {
      setConfirmed(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F5]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">Reset Password</h1>
        {confirmed ? (
          <p className="text-green-600 text-sm text-center">
            Password updated successfully. You can now sign in.
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />
            <button
              onClick={handleReset}
              className="w-full bg-[#514B3D] text-white rounded-lg px-4 py-2"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
