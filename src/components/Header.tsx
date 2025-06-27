import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBars } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#F9F9F4] border-b border-[#ddd]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          <FaBars />
        </button>

        {/* Brand Name */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link to="/" className="text-xl font-semibold text-[#161616]">
            DearNeuro
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm text-[#161616] flex-1 justify-center items-center">
          <Link to="/shop-all">Shop All</Link>
          <Link to="/the-science">The Science</Link>
          <Link to="/our-ethos">Our Ethos</Link>
          <Link to="/herbal-index">Herbal Index</Link>
        </nav>

        {/* Right Side Icons */}
        <div className="flex gap-4 items-center">
          <Link to="/cart" className="text-2xl">
            <FaShoppingCart />
          </Link>
          <Link to="/account" className="text-2xl">
            <FaUser />
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-[#161616] text-sm">
          <Link to="/shop-all" className="block">Shop All</Link>
          <Link to="/the-science" className="block">The Science</Link>
          <Link to="/our-ethos" className="block">Our Ethos</Link>
          <Link to="/herbal-index" className="block">Herbal Index</Link>
          <Link to="/account" className="block">Account</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
