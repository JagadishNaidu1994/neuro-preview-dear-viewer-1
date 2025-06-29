// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";
import { useAdmin } from "@/hooks/useAdmin";
import { FaBars, FaUser, FaShoppingCart } from "react-icons/fa";
import AuthModal from "@/components/AuthModal";
import MobileDrawer from "@/components/MobileDrawer";

const Header = () => {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const firstName =
    user?.user_metadata?.given_name ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    "there"; // fallback if no name
  
  const handleAccountClick = () => {
    if (user) navigate("/account");
    else setAuthOpen(true);
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
          <DesktopLink to="/shop-all">Shop All</DesktopLink>
          <DesktopLink to="/the-science">The Science</DesktopLink>
          <DesktopLink to="/ethos">Our Ethos</DesktopLink>
          <DesktopLink to="/herbal-index">Herbal Index</DesktopLink>
          {isAdmin && <DesktopLink to="/admin">Admin</DesktopLink>}
        </nav>

        {/* Icons and User Info */}
        <div className="flex items-center gap-4 text-xl text-[#161616]">
          <Link to="/cart" aria-label="Cart" className="relative">
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#514B3D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={handleAccountClick} aria-label="Account">
            <FaUser />
          </button>
          {user && firstName && (
            <span className="text-sm font-medium text-[#161616] hidden md:inline-block">
              Hey {firstName}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onAccountClick={handleAccountClick}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
};

const DesktopLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="relative group">
    <span className="text-[#161616] group-hover:text-[#514B3D]">{children}</span>
    <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[#514B3D] transition-all duration-300 group-hover:w-full" />
  </Link>
);

export default Header;