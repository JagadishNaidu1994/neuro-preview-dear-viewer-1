
import { useState } from "react";

export const useCartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  };
};
