import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import AuthModal from "./AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName =
    user?.user_metadata?.given_name ||
    user?.user_metadata?.first_name ||
    user?.email?.split("@")[0] ||
    "there";

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-[#f9f9f5] transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-8 max-w-screen-xl mx-auto py-3">
          {/* Mobile: Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-[#161616] ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] ${isMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>

          {/* Logo (left on desktop, center on mobile) */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-xl lg:text-3xl font-bold text-[#161616]">
              <a href="/">DearNeuro</a>
            </h1>
          </div>

          {/* Nav Links (centered on desktop) */}
          <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 gap-10 text-sm text-[#1E1E1E] font-medium">
            <a href="/shop-all" className="hover:underline">Shop All</a>
            <a href="/the-science" className="hover:underline">The Science</a>
            <a href="/ethos" className="hover:underline">Our Ethos</a>
            <a href="/herbal-index" className="hover:underline">Herbal Index</a>
          </nav>

          {/* Account / Cart / Greeting */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-[#514B3D] font-medium hidden md:inline">
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
              className="flex items-center justify-center bg-[rgba(237,236,235,0.60)] rounded-full w-9 h-9 hover:bg-[rgba(237,236,235,0.80)]"
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
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a href="/shop-all" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">Shop All</a>
              <a href="/the-science" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">The Science</a>
              <a href="/ethos" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">Our Ethos</a>
              <a href="/herbal-index" className="block text-sm text-[#1E1E1E] hover:text-[#514B3D]">Herbal Index</a>
              <button
                onClick={handleAccountClick}
                className="block w-full text-left text-sm text-[#514B3D] mt-4"
              >
                Account
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
