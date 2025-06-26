import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import AuthModal from "./AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
              <span className="text-[10px] md:text-xs uppercase">
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
        <div className="flex items-center px-4 md:px-8 max-w-[1905px] mx-auto mt-1.5">
          {/* Left */}
          <div className="flex items-center">
            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-[#161616] transition-all ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] ${isMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-[#161616] transition-all ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>

            {/* Desktop Logo */}
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-[#161616]">
                <a href="/">DearNeuro</a>
              </h1>
            </div>
          </div>

          {/* Center */}
          <div className="flex-1 flex justify-center items-center">
            {/* Mobile Logo */}
            <div className="lg:hidden">
              <h1 className="text-xl font-bold text-[#161616]">
                <a href="/">DearNeuro</a>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex bg-[#f8f8f5] rounded-xl mx-auto pt-6 pb-2.5 px-4 font-medium">
              <div className="flex items-center gap-14">
                <a href="/shop-all" className="text-xs text-[#1E1E1E] hover:underline">Shop All</a>
                <a href="/the-science" className="text-xs text-[#1E1E1E] hover:underline">The Science</a>
                <a href="/ethos" className="text-xs text-[#1E1E1E] hover:underline">Our Ethos</a>
                <a href="/herbal-index" className="text-xs text-[#1E1E1E] hover:underline">Herbal Index</a>
              </div>
            </div>
          </div>

          {/* Right - Account and Cart */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <button className="relative group">
              <svg className="w-6 h-6 text-[#161616]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 6h15l-1.5 9H8L6 6z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {/* Optional: <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">2</span> */}
            </button>

            {/* Account */}
            <button 
              className="flex items-center gap-2 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)] transition-colors"
              onClick={handleAccountClick}
            >
              <svg className="w-4 h-4 text-[#161616]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              <a href="/shop-all" onClick={() => setIsMenuOpen(false)} className="block text-sm text-[#1E1E1E]">Shop All</a>
              <a href="/the-science" onClick={() => setIsMenuOpen(false)} className="block text-sm text-[#1E1E1E]">The Science</a>
              <a href="/ethos" onClick={() => setIsMenuOpen(false)} className="block text-sm text-[#1E1E1E]">Our Ethos</a>
              <a href="/herbal-index" onClick={() => setIsMenuOpen(false)} className="block text-sm text-[#1E1E1E]">Herbal Index</a>

              <div className="pt-4 border-t border-gray-200">
                <button onClick={() => {
                  setIsMenuOpen(false);
                  handleAccountClick();
                }} className="flex items-center gap-2 w-full text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-sm text-black">Account</span>
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
