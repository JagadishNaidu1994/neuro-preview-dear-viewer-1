import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthProvider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.given_name ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    "";

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="relative z-50 bg-white">
        {/* Subscription Banner */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="bg-[#514B3D] rounded-2xl px-3 py-3 md:px-4 md:py-4 shadow-lg hover:bg-[#5a5147] transition-colors cursor-pointer"
            onClick={() => console.log("Join the DearNeuro CLUB clicked")}
          >
            <div className="flex items-center gap-2 md:gap-3 text-white">
              <span className="text-[10px] md:text-xs font-normal uppercase tracking-tight">
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
        <div className="flex items-center justify-between px-4 md:px-8 max-w-[1905px] mx-auto py-3">
          {/* Left: Hamburger Menu */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 bg-[rgba(237,236,235,0.85)] rounded-lg p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-0.5 bg-[#161616]" />
              <div className="w-5 h-0.5 bg-[#161616]" />
              <div className="w-5 h-0.5 bg-[#161616]" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="text-center flex-1 lg:flex-none">
            <a href="/" className="text-xl font-bold text-[#161616]">
              DearNeuro
            </a>
          </div>

          {/* Right: Account and Cart */}
          <div className="flex items-center gap-4">
            {user && (
              <button
                className="text-xs text-[#161616] font-medium"
                onClick={handleAccountClick}
              >
                Hey {firstName}
              </button>
            )}
            <button
              onClick={handleAccountClick}
              className="flex items-center gap-1 bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2 hover:bg-[rgba(237,236,235,0.80)] transition"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
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
            </button>

            {user && (
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => navigate("/cart")}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                  alt="Cart"
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-md z-40">
            <div className="px-4 py-4 space-y-4">
              {["shop-all", "the-science", "ethos", "herbal-index"].map((path) => (
                <a
                  key={path}
                  href={`/${path}`}
                  className="block text-sm text-[#1E1E1E] hover:text-[#514B3D] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {path.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </a>
              ))}
              <div className="border-t pt-4">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleAccountClick();
                  }}
                  className="text-sm text-black"
                >
                  Account
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
