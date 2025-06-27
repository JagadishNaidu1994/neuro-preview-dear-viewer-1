// src/components/MobileNav.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFlask, FaBook, FaLeaf, FaUser, FaTimes } from "react-icons/fa";

const navItems = [
  { icon: <FaHome />, label: "Shop All", to: "/shop-all" },
  { icon: <FaFlask />, label: "The Science", to: "/the-science" },
  { icon: <FaBook />, label: "Our Ethos", to: "/ethos" },
  { icon: <FaLeaf />, label: "Herbal Index", to: "/herbal-index" },
  { icon: <FaUser />, label: "Account", to: "/account" },
];

const MobileNav = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-white w-72 max-w-full h-screen shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b">
        <h2 className="font-semibold text-lg text-[#161616]">Menu</h2>
        <button onClick={onClose}>
          <FaTimes className="text-lg text-[#161616]" />
        </button>
      </div>

      <nav className="px-4 py-4 space-y-4">
        {navItems.map(({ icon, label, to }, idx) => (
          <Link
            to={to}
            key={idx}
            className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-gray-100 text-sm text-[#161616] font-medium"
            onClick={onClose}
          >
            <span className="text-[#514B3D]">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;
