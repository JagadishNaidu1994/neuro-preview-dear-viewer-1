
import { useState, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";
import { useCartDrawer } from "@/hooks/useCartDrawer";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";
import MobileDrawer from "./MobileDrawer";
import { ShoppingCart, User, Menu, Settings } from "lucide-react";
import { motion } from "framer-motion";

const Header = forwardRef<HTMLButtonElement>((_, ref) => {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { isOpen: isCartOpen, openCart, closeCart } = useCartDrawer();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { label: "Shop All", href: "/shop-all" },
    { label: "The Science", href: "/the-science" },
    { label: "Our Ethos", href: "/ethos" },
    { label: "Herbal Index", href: "/herbal-index" },
    { label: "Journal", href: "/journal" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <header className="bg-[#F8F8F5] shadow-sm sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-brand-blue-700">Delights</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-700 hover:text-brand-blue-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Admin Dashboard Link */}
              {isAdmin && !adminLoading && (
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2 hidden md:flex"
                    title="Admin Dashboard"
                  >
                    <Settings className="w-8 h-8 text-brand-blue-700" />
                  </Button>
                </Link>
              )}

              {/* Cart Icon */}
              <Button variant="ghost" size="sm" onClick={openCart} className="relative p-2" ref={ref}>
                <ShoppingCart className="w-10 h-10 text-brand-blue-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-blue-700 text-brand-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* User Account */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAccountClick}
                className="relative p-2 hidden md:flex"
                title={user ? "Account" : "Login"}
              >
                <User className="w-10 h-10 text-brand-blue-700" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileDrawer(true)}
                className="lg:hidden font-normal text-2xl"
              >
                <Menu className="w-10 h-10 text-brand-blue-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
        onAccountClick={handleAccountClick}
      />
    </>
  );
});

Header.displayName = "Header";

export default Header;
