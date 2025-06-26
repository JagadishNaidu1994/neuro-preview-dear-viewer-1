import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthProvider";
import AuthModal from "./AuthModal";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const fetchName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("first_name")
          .eq("id", user.id)
          .single();

        if (!error && data?.first_name) {
          setFirstName(data.first_name);
        } else {
          setFirstName(user.email?.split("@")[0] ?? "there");
        }
      }
    };

    fetchName();
  }, [user]);

  return (
    <>
      <header className="relative z-50">
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="bg-[#514B3D] rounded-2xl px-3 py-3 md:px-4 md:py-4 shadow-lg hover:bg-[#5a5147] transition-colors cursor-pointer"
            onClick={() => console.log("Join the DearNeuro CLUB clicked")}
          >
            <div className="flex items-center gap-2 md:gap-3 text-white">
              <span className="text-[10px] md:text-xs font-normal tracking-tight uppercase">
                Join DearNeuro · SAVE 15%
              </span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/51f9ff1ba94976d6bae764c50356071e5febf861"
                alt="Snowflake"
                className="w-2 h-2 md:w-3 md:h-3"
              />
            </div>
          </button>
        </div>

        <div className="flex items-center px-4 md:px-8 max-w-[1905px] mx-auto mt-1.5 justify-between">
          {/* Left - Mobile Menu & Logo */}
          <div className="flex items-center">
            <button
              className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-0.5 bg-[#161616]" />
              <div className="w-5 h-0.5 bg-[#161616]" />
              <div className="w-5 h-0.5 bg-[#161616]" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-[#161616]">
                <a href="/">DearNeuro</a>
              </h1>
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="hidden lg:flex bg-[#f8f8f5] rounded-xl pt-6 pb-2.5 px-4 font-medium">
            <div className="flex items-center gap-14">
              <a href="/shop-all" className="text-xs text-[#1E1E1E] hover:underline">Shop All</a>
              <a href="/the-science" className="text-xs text-[#1E1E1E] hover:underline">The Science</a>
              <a href="/ethos" className="text-xs text-[#1E1E1E] hover:underline">Our Ethos</a>
              <a href="/herbal-index" className="text-xs text-[#1E1E1E] hover:underline">Herbal Index</a>
            </div>
          </div>

          {/* Right Side - Account & Cart */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-[#161616] hidden md:inline">Hey, {firstName ?? "there"} 👋</span>
                <button onClick={() => console.log("Cart clicked")} className="relative">
                  🛒
                </button>
              </>
            )}

            <button
              onClick={handleAccountClick}
              className="flex items-center gap-2 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)] transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
