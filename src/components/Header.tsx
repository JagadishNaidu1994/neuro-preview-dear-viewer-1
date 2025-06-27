import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import AuthModal from "./AuthModal";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // 🧠 Load first name from DB if user exists
  useEffect(() => {
    const loadFirstName = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (data?.first_name) {
        setFirstName(data.first_name);
      } else {
        // fallback to email prefix
        setFirstName(user.email?.split("@")[0] || "there");
      }
    };

    loadFirstName();
  }, [user]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-[#f8f8f5] transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-8 max-w-[1440px] mx-auto h-16 lg:h-20">
          {/* Left: Logo */}
          <div className="flex items-center flex-1">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden mr-4"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-[#161616] mb-1" />
              <div className="w-6 h-0.5 bg-[#161616] mb-1" />
              <div className="w-6 h-0.5 bg-[#161616]" />
            </button>

            <a href="/" className="text-xl lg:text-2xl font-bold text-[#161616]">
              DearNeuro
            </a>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden lg:flex flex-1 justify-center space-x-12 text-sm text-[#1E1E1E] font-medium">
            <a href="/shop-all" className="hover:underline">Shop All</a>
            <a href="/the-science" className="hover:underline">The Science</a>
            <a href="/ethos" className="hover:underline">Our Ethos</a>
            <a href="/herbal-index" className="hover:underline">Herbal Index</a>
          </nav>

          {/* Right: Cart / Greeting / Account */}
          <div className="flex items-center justify-end flex-1 gap-4">
            {user && (
              <span className="text-sm text-[#514B3D] hidden md:inline">
                Hey {firstName}
              </span>
            )}
            {user && (
              <button className="text-[#514B3D]" aria-label="Cart">
                🛒
              </button>
            )}
            <button
              onClick={handleAccountClick}
              className="bg-[rgba(237,236,235,0.60)] hover:bg-[rgba(237,236,235,0.80)] rounded-xl p-2 transition-colors"
              aria-label="Account"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow z-40">
            <div className="px-4 py-4 space-y-3 text-sm font-medium">
              <a href="/shop-all" onClick={() => setIsMenuOpen(false)}>Shop All</a>
              <a href="/the-science" onClick={() => setIsMenuOpen(false)}>The Science</a>
              <a href="/ethos" onClick={() => setIsMenuOpen(false)}>Our Ethos</a>
              <a href="/herbal-index" onClick={() => setIsMenuOpen(false)}>Herbal Index</a>
              <button
                className="w-full text-left text-[#514B3D] mt-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleAccountClick();
                }}
              >
                Account
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
