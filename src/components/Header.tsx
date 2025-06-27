// // src/components/Header.tsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthModal from "./AuthModal";
// import { useAuth } from "@/context/AuthProvider";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();

//   const { user, loading } = useAuth();

//   const firstName =
//     user?.user_metadata?.first_name ||
//     user?.user_metadata?.given_name ||
//     user?.user_metadata?.full_name?.split(" ")?.[0] ||
//     user?.email?.split("@")[0] ||
//     "";

//   const handleAccountClick = () => {
//     if (loading) return;
//     if (user) {
//       navigate("/account");
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <>
//       <header
//         className={`sticky top-0 z-50 bg-[#fafaf7] transition-shadow ${
//           scrolled ? "shadow-md" : ""
//         }`}
//       >
//         <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between h-16 lg:h-20">
//           {/* Left */}
//           <div className="flex items-center gap-3 lg:flex-none">
//             {/* Hamburger for mobile */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="lg:hidden p-2 rounded-lg bg-[#ededebd9]"
//               aria-label="Toggle Menu"
//             >
//               <div className="space-y-1">
//                 <div className="w-5 h-0.5 bg-[#161616]" />
//                 <div className="w-5 h-0.5 bg-[#161616]" />
//                 <div className="w-5 h-0.5 bg-[#161616]" />
//               </div>
//             </button>

//             <a
//               href="/"
//               className="text-xl lg:text-2xl font-bold text-[#161616] block lg:hidden mx-auto"
//             >
//               DearNeuro
//             </a>

//             <a
//               href="/"
//               className="hidden lg:block text-xl lg:text-2xl font-bold text-[#161616]"
//             >
//               DearNeuro
//             </a>
//           </div>

//           {/* Center nav (desktop) */}
//           <nav className="hidden lg:flex flex-1 justify-center space-x-12 text-sm font-medium text-[#1E1E1E]">
//             <a href="/shop-all" className="hover:underline">Shop All</a>
//             <a href="/the-science" className="hover:underline">The Science</a>
//             <a href="/ethos" className="hover:underline">Our Ethos</a>
//             <a href="/herbal-index" className="hover:underline">Herbal Index</a>
//           </nav>

//           {/* Right */}
//           <div className="flex items-center gap-3">
//             {user && (
//               <span className="hidden md:inline text-sm text-[#514B3D] font-medium">
//                 Hey {firstName}
//               </span>
//             )}

//             {user && (
//               <button
//                 className="text-[#514B3D] text-xl hover:opacity-80"
//                 aria-label="Cart"
//               >
//                 🛒
//               </button>
//             )}

//             <button
//               onClick={handleAccountClick}
//               className="flex items-center justify-center bg-[rgba(237,236,235,0.60)] hover:bg-[rgba(237,236,235,0.80)] rounded-full w-9 h-9"
//               aria-label="Account"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                 <circle cx="12" cy="7" r="4" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="lg:hidden px-4 pb-4 pt-2 space-y-3 bg-white border-t border-gray-200 shadow">
//             <a href="/shop-all" className="block text-sm hover:text-[#514B3D]">Shop All</a>
//             <a href="/the-science" className="block text-sm hover:text-[#514B3D]">The Science</a>
//             <a href="/ethos" className="block text-sm hover:text-[#514B3D]">Our Ethos</a>
//             <a href="/herbal-index" className="block text-sm hover:text-[#514B3D]">Herbal Index</a>
//             <button onClick={handleAccountClick} className="block text-sm text-[#514B3D] pt-2">
//               Account
//             </button>
//           </div>
//         )}
//       </header>

//       {/* Auth modal */}
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => setIsAuthModalOpen(false)}
//       />
//     </>
//   );
// };

// export default Header;







// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaUser } from "react-icons/fa";
// import { useAuth } from "@/context/AuthProvider";
// import AuthModal from "@/components/AuthModal";
// import { useMediaQuery } from "usehooks-ts";

// const Header = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery("(max-width: 768px)");

//   const [showMenu, setShowMenu] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   const handleAccountClick = () => {
//     if (user) {
//       navigate("/account");
//     } else {
//       setShowAuthModal(true);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-[#F9F9F4] shadow-sm border-b">
//       <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-between items-center relative">
//         {/* Left: Hamburger (Mobile Only) */}
//         {isMobile && (
//           <button
//             onClick={() => setShowMenu(!showMenu)}
//             className="text-xl text-[#161616]"
//           >
//             &#9776;
//           </button>
//         )}

//         {/* Center: Logo (mobile center, desktop left) */}
//         <div
//           className={`font-bold text-[#161616] text-lg ${
//             isMobile ? "absolute left-1/2 transform -translate-x-1/2" : ""
//           }`}
//         >
//           <Link to="/">DearNeuro</Link>
//         </div>

//         {/* Right: Cart + Account Icons */}
//         <div className="flex items-center gap-4">
//           <Link to="/cart">
//             <FaShoppingCart className="text-[#161616]" size={18} />
//           </Link>
//           <button onClick={handleAccountClick}>
//             <FaUser className="text-[#161616]" size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Nav Bar */}
//       <nav
//         className={`${
//           isMobile
//             ? `${
//                 showMenu ? "block" : "hidden"
//               } px-4 pb-4 text-sm font-medium text-[#161616] space-y-2`
//             : "flex justify-center space-x-8 text-sm text-[#161616] font-medium py-2"
//         }`}
//       >
//         <Link to="/shop-all">Shop All</Link>
//         <Link to="/the-science">The Science</Link>
//         <Link to="/ethos">Our Ethos</Link>
//         <Link to="/herbal-index">Herbal Index</Link>
//       </nav>

//       {/* Auth Modal */}
//       <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
//     </header>
//   );
// };

// export default Header;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthProvider";
import AuthModal from "@/components/AuthModal";
import { useMediaQuery } from "usehooks-ts";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F9F9F4] shadow-sm border-b">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Left: Hamburger (Mobile Only) */}
        {isMobile && (
          <button
            onClick={() => setShowMenu(true)}
            className="text-xl text-[#161616]"
          >
            <FaBars />
          </button>
        )}

        {/* Center: Logo (mobile center, desktop left) */}
        <div
          className={`font-bold text-[#161616] text-lg ${
            isMobile ? "absolute left-1/2 transform -translate-x-1/2" : ""
          }`}
        >
          <Link to="/">DearNeuro</Link>
        </div>

        {/* Right: Cart + Account Icons */}
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <FaShoppingCart className="text-[#161616]" size={18} />
          </Link>
          <button onClick={handleAccountClick}>
            <FaUser className="text-[#161616]" size={18} />
          </button>
        </div>
      </div>

      {/* Desktop Nav Bar */}
      {!isMobile && (
        <nav className="flex justify-center space-x-8 text-sm text-[#161616] font-medium py-2">
          <Link to="/shop-all">Shop All</Link>
          <Link to="/the-science">The Science</Link>
          <Link to="/ethos">Our Ethos</Link>
          <Link to="/herbal-index">Herbal Index</Link>
        </nav>
      )}

      {/* Mobile Flyout Menu */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            showMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-[#161616] text-lg">Menu</span>
            <button
              onClick={() => setShowMenu(false)}
              className="text-xl text-[#161616]"
            >
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col px-4 py-4 text-[#161616] font-medium space-y-4">
            <Link to="/shop-all" onClick={() => setShowMenu(false)}>
              Shop All
            </Link>
            <Link to="/the-science" onClick={() => setShowMenu(false)}>
              The Science
            </Link>
            <Link to="/ethos" onClick={() => setShowMenu(false)}>
              Our Ethos
            </Link>
            <Link to="/herbal-index" onClick={() => setShowMenu(false)}>
              Herbal Index
            </Link>
            <button
              onClick={() => {
                setShowMenu(false);
                handleAccountClick();
              }}
              className="text-left"
            >
              Account
            </button>
          </nav>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
};

export default Header;
