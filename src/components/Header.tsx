import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import AuthModal from "./AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsAuthModalOpen(true);
    }
  };

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
          {/* Left */}
          <div className="flex items-center">
            <button
              className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-[#161616] transition-all ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] transition-all ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-[#161616]">
                <a href="/">DearNeuro</a>
              </h1>
            </div>
          </div>

          {/* Center Nav */}
          <div className="lg:flex hidden bg-[#f8f8f5] rounded-xl pt-6 pb-2.5 px-4 font-medium">
            <div className="flex items-center gap-14">
              <a href="/shop-all" className="text-xs text-[#1E1E1E] hover:underline">Shop All</a>
              <a href="/the-science" className="text-xs text-[#1E1E1E] hover:underline">The Science</a>
              <a href="/ethos" className="text-xs text-[#1E1E1E] hover:underline">Our Ethos</a>
              <a href="/herbal-index" className="text-xs text-[#1E1E1E] hover:underline">Herbal Index</a>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.5A1 1 0 007 20h10a1 1 0 001-1l1-5H7z" />
              </svg>
            </button>

            {/* Account */}
            <button
              className="flex items-center gap-2 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)] transition"
              onClick={handleAccountClick}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden md:inline text-xs text-black">
                {user ? "Account" : "Sign In"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="px-4 py-4 space-y-4">
              {["shop-all", "the-science", "ethos", "herbal-index"].map((path) => (
                <a
                  key={path}
                  href={`/${path}`}
                  className="block text-sm text-[#1E1E1E] hover:text-[#514B3D] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {path.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button
                  className="flex items-center gap-2 w-full text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleAccountClick();
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-black">
                    {user ? "Account" : "Sign In"}
                  </span>
                </button>
              </div>
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
