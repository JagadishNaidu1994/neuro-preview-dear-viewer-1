import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import AuthModal from "./AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.given_name ||
    user?.user_metadata?.full_name?.split(" ")?.[0] ||
    user?.email?.split("@")[0] ||
    "";

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsAuthModalOpen(true);
    }
  };

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
        className={`sticky top-0 z-50 bg-[#fafaf7] transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 lg:flex-none">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#ededebd9] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <div className="space-y-1">
                <div className="w-5 h-0.5 bg-[#161616]" />
                <div className="w-5 h-0.5 bg-[#161616]" />
                <div className="w-5 h-0.5 bg-[#161616]" />
              </div>
            </button>
            <a href="/" className="text-xl lg:text-2xl font-bold text-[#161616]">
              DearNeuro
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex flex-1 justify-center space-x-12 text-sm font-medium text-[#1E1E1E]">
            <a href="/shop-all" className="hover:underline">Shop All</a>
            <a href="/the-science" className="hover:underline">The Science</a>
            <a href="/ethos" className="hover:underline">Our Ethos</a>
            <a href="/herbal-index" className="hover:underline">Herbal Index</a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden md:inline text-sm text-[#514B3D] font-medium">
                Hey {firstName}
              </span>
            )}

            {user && (
              <button
                className="text-[#514B3D] text-xl hover:opacity-80"
                aria-label="Cart"
              >
                🛒
              </button>
            )}

            <button
              onClick={handleAccountClick}
              className="flex items-center justify-center bg-[rgba(237,236,235,0.60)] hover:bg-[rgba(237,236,235,0.80)] rounded-full w-9 h-9"
              aria-label="Account"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden px-4 pb-4 pt-2 space-y-3 bg-white border-t border-gray-200 shadow">
            <a href="/shop-all" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">Shop All</a>
            <a href="/the-science" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">The Science</a>
            <a href="/ethos" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">Our Ethos</a>
            <a href="/herbal-index" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">Herbal Index</a>
            <button
              onClick={handleAccountClick}
              className="block text-sm text-[#514B3D] pt-2"
            >
              Account
            </button>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
