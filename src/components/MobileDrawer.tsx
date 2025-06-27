// src/components/MobileDrawer.tsx
import React from "react";
import { FaTimes, FaUser, FaChevronRight, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountClick: () => void;
}

const MobileDrawer = ({ isOpen, onClose, onAccountClick }: MobileDrawerProps) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 bg-[#FAFAF5] w-[280px] h-full overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <span className="text-xl font-extrabold tracking-wide">DearNeuro</span>
          <div className="flex items-center gap-4">
            <button onClick={onAccountClick}><FaUser className="text-xl" /></button>
            <button onClick={onClose}><FaTimes className="text-xl" /></button>
          </div>
        </div>

        {/* Main Nav */}
        <div className="divide-y divide-gray-200 text-sm font-semibold text-[#161616]">
          {[
            { label: "Shop All", path: "/shop-all" },
            { label: "Science", path: "/the-science" },
            { label: "Our Story", path: "/ethos" },
            { label: "Refer a Friend", path: "/refer" },
            { label: "Rewards", path: "/rewards" },
          ].map((item, idx) => (
         
          ))}
          
        </div>

       
        
      </div>
    </>
  );
};

export default MobileDrawer;
