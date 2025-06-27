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



// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
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
//             onClick={() => setShowMenu(true)}
//             className="text-xl text-[#161616]"
//           >
//             <FaBars />
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

//       {/* Desktop Nav Bar */}
//       {!isMobile && (
//         <nav className="flex justify-center space-x-8 text-sm text-[#161616] font-medium py-2">
//           <Link to="/shop-all">Shop All</Link>
//           <Link to="/the-science">The Science</Link>
//           <Link to="/ethos">Our Ethos</Link>
//           <Link to="/herbal-index">Herbal Index</Link>
//         </nav>
//       )}

//       {/* Mobile Flyout Menu */}
//       {isMobile && (
//         <div
//           className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
//             showMenu ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <div className="flex items-center justify-between p-4 border-b">
//             <span className="font-bold text-[#161616] text-lg">Menu</span>
//             <button
//               onClick={() => setShowMenu(false)}
//               className="text-xl text-[#161616]"
//             >
//               <FaTimes />
//             </button>
//           </div>
//           <nav className="flex flex-col px-4 py-4 text-[#161616] font-medium space-y-4">
//             <Link to="/shop-all" onClick={() => setShowMenu(false)}>
//               Shop All
//             </Link>
//             <Link to="/the-science" onClick={() => setShowMenu(false)}>
//               The Science
//             </Link>
//             <Link to="/ethos" onClick={() => setShowMenu(false)}>
//               Our Ethos
//             </Link>
//             <Link to="/herbal-index" onClick={() => setShowMenu(false)}>
//               Herbal Index
//             </Link>
//             <button
//               onClick={() => {
//                 setShowMenu(false);
//                 handleAccountClick();
//               }}
//               className="text-left"
//             >
//               Account
//             </button>
//           </nav>
//         </div>
//       )}

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
    <header className="sticky top-0 z-50 bg-[#F9F9F4] shadow-md border-b">
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
        <nav className="flex justify-center space-x-10 text-sm text-[#161616] font-medium py-2">
          <Link to="/shop-all" className="hover:text-[#514B3D] transition">
            Shop All
          </Link>
          <Link to="/the-science" className="hover:text-[#514B3D] transition">
            The Science
          </Link>
          <Link to="/ethos" className="hover:text-[#514B3D] transition">
            Our Ethos
          </Link>
          <Link to="/herbal-index" className="hover:text-[#514B3D] transition">
            Herbal Index
          </Link>
        </nav>
      )}

      {/* Backdrop overlay */}
      {isMobile && showMenu && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Mobile Flyout Menu */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
            showMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <span className="text-lg font-semibold text-[#161616]">Menu</span>
            <button
              onClick={() => setShowMenu(false)}
              className="text-2xl text-[#161616] hover:text-[#514B3D]"
            >
              <FaTimes />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col p-4 text-[#161616] text-base font-medium space-y-4">
            {[
              { to: "/shop-all", label: "Shop All" },
              { to: "/the-science", label: "The Science" },
              { to: "/ethos", label: "Our Ethos" },
              { to: "/herbal-index", label: "Herbal Index" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setShowMenu(false)}
                className="hover:text-[#514B3D] hover:pl-2 transition-all duration-200"
              >
                {label}
              </Link>
            ))}

            <button
              onClick={() => {
                setShowMenu(false);
                handleAccountClick();
              }}
              className="text-left hover:text-[#514B3D] hover:pl-2 transition-all duration-200"
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
