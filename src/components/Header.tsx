// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthProvider";
// import { FaBars, FaTimes, FaUser, FaShoppingCart, FaFlask, FaLeaf, FaBookOpen, FaHome } from "react-icons/fa";
// import AuthModal from "@/components/AuthModal";
// import MobileNav from "./MobileNav";


// const Header = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);

//   const handleAccountClick = () => {
//     if (user) {
//       navigate("/account");
//     } else {
//       setAuthOpen(true);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-[#FAFAF5] shadow-md">
//       <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         {/* Mobile Menu Icon */}
//         <button onClick={() => setMobileOpen(true)} className="md:hidden text-xl text-[#161616]">
//           <FaBars />
//         </button>

//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-lg font-bold text-[#161616] mx-auto md:mx-0 md:text-left"
//         >
//           DearNeuro
//         </Link>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex space-x-8 font-medium text-sm">
//           <NavLink to="/shop-all" icon={<FaHome />}>Shop All</NavLink>
//           <NavLink to="/the-science" icon={<FaFlask />}>The Science</NavLink>
//           <NavLink to="/ethos" icon={<FaBookOpen />}>Our Ethos</NavLink>
//           <NavLink to="/herbal-index" icon={<FaLeaf />}>Herbal Index</NavLink>
//         </nav>

//         {/* Icons */}
//         <div className="flex items-center gap-4 text-xl text-[#161616]">
//           <Link to="/cart" aria-label="Cart"><FaShoppingCart /></Link>
//           <button onClick={handleAccountClick} aria-label="Account"><FaUser /></button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
//           mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={() => setMobileOpen(false)}
//       />
//       <div
//         className={`fixed top-0 left-0 w-[250px] h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ${
//           mobileOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex justify-between items-center p-4 border-b">
//           <span className="text-lg font-semibold text-[#161616]">Menu</span>
//           {/* <button onClick={() => setMobileOpen(false)} className="text-xl">
//             <FaTimes />
//           </button> */}
//           <button onClick={() => setMenuOpen(true)} className="md:hidden text-xl p-2">
//   <svg className="w-6 h-6 text-[#161616]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//   </svg>
// </button>

//         </div>
//         <nav className="flex flex-col space-y-4 p-4 text-[#161616] font-medium text-sm">
//           <MobileNavLink to="/shop-all" icon={<FaHome />}>Shop All</MobileNavLink>
//           <MobileNavLink to="/the-science" icon={<FaFlask />}>The Science</MobileNavLink>
//           <MobileNavLink to="/ethos" icon={<FaBookOpen />}>Our Ethos</MobileNavLink>
//           <MobileNavLink to="/herbal-index" icon={<FaLeaf />}>Herbal Index</MobileNavLink>
//           <button
//             onClick={handleAccountClick}
//             className="flex items-center gap-2 text-left w-full"
//           >
//             <FaUser />
//             Account
//           </button>
//         </nav>
//       </div>

//       {/* Auth Modal */}
//       <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
//     </header>
//   );
// };

// // Desktop NavLink with underline effect
// const NavLink = ({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) => (
//   <Link to={to} className="group relative flex items-center gap-1 hover:text-[#514B3D]">
//     {icon}
//     <span>{children}</span>
//     <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[#514B3D] transition-all duration-300 group-hover:w-full" />
//   </Link>
// );

// // Mobile NavLink
// const MobileNavLink = ({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) => (
//   <Link to={to} className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
//     {icon}
//     {children}
//   </Link>
// );
// // <MobileNav isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />

// export default Header;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { FaBars, FaTimes, FaUser, FaShoppingCart, FaFlask, FaLeaf, FaBookOpen, FaHome } from "react-icons/fa";
import AuthModal from "@/components/AuthModal";
import MobileNav from "./MobileNav";


const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF5] shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Mobile Menu Icon */}
        <button onClick={() => setMobileOpen(true)} className="md:hidden text-xl text-[#161616]">
          <FaBars />
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold text-[#161616] mx-auto md:mx-0 md:text-left"
        >
          DearNeuro
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 font-medium text-sm">
          <NavLink to="/shop-all" icon={<FaHome />}>Shop All</NavLink>
          <NavLink to="/the-science" icon={<FaFlask />}>The Science</NavLink>
          <NavLink to="/ethos" icon={<FaBookOpen />}>Our Ethos</NavLink>
          <NavLink to="/herbal-index" icon={<FaLeaf />}>Herbal Index</NavLink>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-xl text-[#161616]">
          <Link to="/cart" aria-label="Cart"><FaShoppingCart /></Link>
          <button onClick={handleAccountClick} aria-label="Account"><FaUser /></button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 w-[250px] h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold text-[#161616]">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-xl">
            <FaTimes />
          </button>
          {/* <button onClick={() => setMenuOpen(true)} className="md:hidden text-xl p-2">
  <svg className="w-6 h-6 text-[#161616]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button> */}

        </div>
        <nav className="flex flex-col space-y-4 p-4 text-[#161616] font-medium text-sm">
          <MobileNavLink to="/shop-all" icon={<FaHome />}>Shop All</MobileNavLink>
          <MobileNavLink to="/the-science" icon={<FaFlask />}>The Science</MobileNavLink>
          <MobileNavLink to="/ethos" icon={<FaBookOpen />}>Our Ethos</MobileNavLink>
          <MobileNavLink to="/herbal-index" icon={<FaLeaf />}>Herbal Index</MobileNavLink>
          <button
            onClick={handleAccountClick}
            className="flex items-center gap-2 text-left w-full"
          >
            <FaUser />
            Account
          </button>
        </nav>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
};

// Desktop NavLink with underline effect
const NavLink = ({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <Link to={to} className="group relative flex items-center gap-1 hover:text-[#514B3D]">
    {icon}
    <span>{children}</span>
    <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[#514B3D] transition-all duration-300 group-hover:w-full" />
  </Link>
);

// Mobile NavLink
const MobileNavLink = ({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <Link to={to} className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
    {icon}
    {children}
  </Link>
);
// <MobileNav isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />

export default Header;
