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
        } else if (user.email) {
          const fallback = user.email.includes("@")
            ? user.email.split("@")[0]
            : "there";
          setFirstName(fallback);
        } else {
          setFirstName("there");
        }
      }
    };

    fetchName();
  }, [user]);

  return (
    <>
      <header className="relative z-50">
        {/* Banner */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="bg-[#514B3D] rounded-2xl px-3 py-3 md:px-4 md:py-4 shadow-lg hover:bg-[#5a5147] transition-colors cursor-pointer"
            onClick={() => console.log("Join the DearNeuro CLUB clicked")}
          >
            <div className="flex items-center gap-2 md:gap-3 text-white">
              <span className="text-[10px] md:text-xs font-normal uppercase">
                Join DearNeuro · SAVE 15%
              </span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/51f9ff1ba94976d6bae764c50356071e5febf861"
                alt="Snowflake"
                className="w-3 h-3"
              />
            </div>
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center px-4 md:px-8 max-w-[1905px] mx-auto mt-1.5 justify-between">
          {/* Logo */}
          <div>
            <h1 className="text-xl font-bold text-[#161616] tracking-tight">
              <a href="/">DearNeuro</a>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex gap-8 bg-[#f8f8f5] rounded-xl px-4 pt-6 pb-2.5 font-medium">
            <a href="/shop-all" className="text-xs hover:underline">
              Shop All
            </a>
            <a href="/the-science" className="text-xs hover:underline">
              The Science
            </a>
            <a href="/ethos" className="text-xs hover:underline">
              Our Ethos
            </a>
            <a href="/herbal-index" className="text-xs hover:underline">
              Herbal Index
            </a>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Show name if logged in */}
            {user && firstName && (
              <span className="text-xs text-[#161616] font-medium">
                Hey, {firstName}
              </span>
            )}

            {/* Cart Icon (visible only after login) */}
            {user && (
              <button className="relative">
                <svg
                  className="w-5 h-5 text-[#161616]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13M7 13H5.4M17 13l1.5 7M9 21h6"
                  />
                </svg>
              </button>
            )}

            {/* Account Button */}
            <button
              onClick={handleAccountClick}
              className="flex items-center gap-2 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden md:inline text-xs text-black">Account</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu (optional, unchanged) */}
        {/* ... */}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
