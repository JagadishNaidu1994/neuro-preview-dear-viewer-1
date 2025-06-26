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
        {/* Subscription Banner */}
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
                className="w-3 h-3"
              />
            </div>
          </button>
        </div>

        {/* Main Header */}
        <div className="flex items-center px-4 md:px-8 max-w-[1905px] mx-auto mt-1.5 justify-between">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-[#161616] ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></div>
              <div className={`w-5 h-0.5 bg-[#161616] ${isMenuOpen ? "opacity-0" : ""}`}></div>
              <div className={`w-5 h-0.5 bg-[#161616] ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
            </button>

            {/* Logo */}
            <h1 className="text-xl font-bold text-[#161616] tracking-tight">
              <a href="/">DearNeuro</a>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-8 bg-[#f8f8f5] rounded-xl px-4 pt-6 pb-2.5 font-medium">
            <a href="/shop-all" className="text-xs hover:underline">Shop All</a>
            <a href="/the-science" className="text-xs hover:underline">The Science</a>
            <a href="/ethos" className="text-xs hover:underline">Our Ethos</a>
            <a href="/herbal-index" className="text-xs hover:underline">Herbal Index</a>
          </nav>

          {/* Right Side: Greeting, Cart, Account */}
          <div className="flex items-center gap-3">
            {user && firstName && (
              <span className="text-xs font-medium text-[#161616]">Hey, {firstName}</span>
            )}

            {user && (
              <button>
                <svg className="w-5 h-5 text-[#161616]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13M9 21h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <button
              onClick={handleAccountClick}
              className="flex items-center gap-2 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden md:inline text-xs text-black">Account</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="px-4 py-4 space-y-4">
              <a href="/shop-all" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]" onClick={() => setIsMenuOpen(false)}>Shop All</a>
              <a href="/the-science" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]" onClick={() => setIsMenuOpen(false)}>The Science</a>
              <a href="/ethos" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]" onClick={() => setIsMenuOpen(false)}>Our Ethos</a>
              <a href="/herbal-index" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]" onClick={() => setIsMenuOpen(false)}>Herbal Index</a>
              <button onClick={handleAccountClick} className="mt-2 text-sm text-black flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Account</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
