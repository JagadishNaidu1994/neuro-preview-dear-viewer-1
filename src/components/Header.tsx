import { useState } from "react";
import AuthModal from "./AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAccountClick = () => {
    setIsAuthModalOpen(true);
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
              <div className="text-center">
                <span className="text-[10px] md:text-xs font-normal tracking-tight uppercase">
                  Join DearNeuro · SAVE 15%
                </span>
              </div>
              <div className="w-2 h-2 md:w-3 md:h-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/51f9ff1ba94976d6bae764c50356071e5febf861"
                  alt="Snowflake"
                  className="w-full h-full"
                />
              </div>
            </div>
          </button>
        </div>

        {/* Main Header */}
        <div className="flex items-center px-4 md:px-8 max-w-[1905px] mx-auto mt-1.5">
          {/* Left Side - Mobile Hamburger & Desktop Logo */}
          <div className="flex items-center">
            {/* Mobile Hamburger Menu */}
            <button
              className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div
                className={`w-5 h-0.5 bg-[#161616] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              ></div>
              <div
                className={`w-5 h-0.5 bg-[#161616] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              ></div>
              <div
                className={`w-5 h-0.5 bg-[#161616] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              ></div>
            </button>

            {/* Desktop Logo - Left Side */}
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-[#161616] tracking-normal leading-5">
                <a href="/">DearNeuro</a>
              </h1>
            </div>
          </div>

          {/* Center - Mobile Logo & Desktop Navigation */}
          <div className="flex-1 flex justify-center items-center">
            {/* Mobile Logo - Centered */}
            <div className="lg:hidden">
              <h1 className="text-xl font-bold text-[#161616] tracking-tight">
                <a href="/">DearNeuro</a>
              </h1>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex bg-[#f8f8f5] rounded-xl mx-auto pt-6 pb-2.5 px-4 font-medium">
              <div className="flex items-center gap-14">
                <a
                  href="/shop-all"
                  className="text-xs text-[#1E1E1E] hover:underline transition-all"
                >
                  Shop All
                </a>
                <a
                  href="/the-science"
                  className="text-xs text-[#1E1E1E] hover:underline transition-all"
                >
                  The Science
                </a>
                <a
                  href="/ethos"
                  className="text-xs text-[#1E1E1E] hover:underline transition-all"
                >
                  Our Ethos
                </a>
                <a
                  href="/herbal-index"
                  className="text-xs text-[#1E1E1E] hover:underline transition-all"
                >
                  Herbal Index
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Account */}
          <div className="flex items-center">
            {/* Account Section */}
            <button 
              className="flex items-center gap-2 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)] transition-colors"
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
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden md:inline text-xs text-black">
                Account
              </span>
              <span className="hidden md:inline text-xs text-black">(0)</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="px-4 py-4 space-y-4">
              <a
                href="/shop-all"
                className="block text-sm text-[#1E1E1E] hover:text-[#514B3D] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop All
              </a>
              <a
                href="/the-science"
                className="block text-sm text-[#1E1E1E] hover:text-[#514B3D] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                The Science
              </a>
              <a
                href="/ethos"
                className="block text-sm text-[#1E1E1E] hover:text-[#514B3D] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Ethos
              </a>
              <a
                href="/herbal-index"
                className="block text-sm text-[#1E1E1E] hover:text-[#514B3D] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Herbal Index
              </a>
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
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-black">Account (0)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;
