import { useState } from "react";
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
const Header = () => {
  const {
    user
  } = useAuth();
  const {
    totalItems
  } = useCart();
  const {
    isAdmin,
    loading: adminLoading
  } = useAdmin();
  const {
    isOpen: isCartOpen,
    openCart,
    closeCart
  } = useCartDrawer();
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
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  const navItems = [{
    label: "Shop All",
    href: "/shop-all"
  }, {
    label: "The Science",
    href: "/the-science"
  }, {
    label: "Ethos",
    href: "/ethos"
  }, {
    label: "Herbal Index",
    href: "/herbal-index"
  }, {
    label: "Journal",
    href: "/journal"
  }];
  return <>
      <header className="bg-[#F8F8F5] shadow-sm sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="font-bold text-gray-950 text-4xl">DearNeuro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map(item => <Link key={item.href} to={item.href} className="text-[#514B3D] hover:text-[#3f3a2f] font-medium transition-colors">
                  {item.label}
                </Link>)}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Admin Link - Only show for admin users */}
              {user && isAdmin && !adminLoading && <Link to="/admin">
                  <Button variant="ghost" size="sm" className="relative p-2 hidden md:flex" title="Admin Dashboard">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>}

              {/* Cart Icon */}
              <Button variant="ghost" size="sm" onClick={openCart} className="relative p-2">
                <ShoppingCart className="w-8 h-8" />
                {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-[#514B3D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>}
              </Button>

              {/* User Account */}
              <Button variant="ghost" size="sm" onClick={handleAccountClick} className="hidden md:flex items-center gap-2 text-slate-900 font-normal">
                <User className="w-8 h-8" />
                {user ? "Account" : "Sign In"}
              </Button>

              {/* Mobile Menu */}
              <Button variant="ghost" size="sm" onClick={() => setShowMobileDrawer(true)} className="lg:hidden font-normal text-2xl">
                <Menu className="w-8 h-8" />
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
      <MobileDrawer isOpen={showMobileDrawer} onClose={() => setShowMobileDrawer(false)} onAccountClick={handleAccountClick} />
    </>;
};
export default Header;