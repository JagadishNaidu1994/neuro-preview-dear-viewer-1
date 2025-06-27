import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#F9F9F4] shadow-sm border-b">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#161616] text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* Logo Centered */}
        <Link
          to="/"
          className="text-lg font-bold text-[#161616] absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0"
        >
          DearNeuro
        </Link>

        {/* Icons */}
        <div className="flex items-center space-x-4 text-[#514B3D]">
          <Link to="/cart">
            <FaShoppingCart />
          </Link>
          <Link to="/account">
            <FaUserCircle />
          </Link>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#F9F9F4] border-t border-[#ddd] px-4 py-2 space-y-2">
          <Link to="/shop-all" className="block text-[#161616]">Shop All</Link>
          <Link to="/the-science" className="block text-[#161616]">The Science</Link>
          <Link to="/ethos" className="block text-[#161616]">Our Ethos</Link>
          <Link to="/herbal-index" className="block text-[#161616]">Herbal Index</Link>
          <Link to="/account" className="block text-[#161616]">Account</Link>
        </nav>
      )}

      {/* Desktop Nav */}
      <nav className="hidden md:flex justify-center space-x-6 py-2 text-sm text-[#161616]">
        <Link to="/shop">Shop All</Link>
        <Link to="/science">The Science</Link>
        <Link to="/ethos">Our Ethos</Link>
        <Link to="/herbal-index">Herbal Index</Link>
      </nav>
    </header>
  );
};

export default Header;
