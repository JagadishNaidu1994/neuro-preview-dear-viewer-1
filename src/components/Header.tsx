import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthProvider";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // 👈 new

  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.first_name || user?.user_metadata?.first_name || "";

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsAuthModalOpen(true);
    }
  };
  // ✅ Handle scroll shadow
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <header className="relative z-50">
        {/* Main Header */}
        <div className="flex items-center justify-between px-4 md:px-8 max-w-[1905px] mx-auto mt-1.5">
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-[#161616] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <h1 className="text-xl lg:text-3xl font-bold text-[#161616]">
              <a href="/">DearNeuro</a>
            </h1>
          </div>

          {/* Nav - Desktop Only */}
          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex gap-10 text-sm text-[#1E1E1E] font-medium">
              <a href="/shop-all" className="hover:underline">Shop All</a>
              <a href="/the-science" className="hover:underline">The Science</a>
              <a href="/ethos" className="hover:underline">Our Ethos</a>
              <a href="/herbal-index" className="hover:underline">Herbal Index</a>
            </div>
          </nav>

          {/* Account/Cart */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm hidden md:inline text-[#514B3D] font-medium">
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
              className="flex items-center gap-2 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)] transition-colors"
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
              <span className="hidden md:inline text-xs text-black">Account</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="px-4 py-4 space-y-4">
              <a href="/shop-all" className="block text-sm hover:text-[#514B3D]">Shop All</a>
              <a href="/the-science" className="block text-sm hover:text-[#514B3D]">The Science</a>
              <a href="/ethos" className="block text-sm hover:text-[#514B3D]">Our Ethos</a>
              <a href="/herbal-index" className="block text-sm hover:text-[#514B3D]">Herbal Index</a>
              <button onClick={handleAccountClick} className="block w-full text-left text-sm mt-4 text-[#514B3D]">
                Account
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
