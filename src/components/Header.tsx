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
  const { totalItems, isCartAnimating } = useCart();

  
  
  
  
// const Header = forwardRef<HTMLButtonElement>((_, ref) => {
//   const { user } = useAuth();
//   const { totalItems } = useCart();
  
  
  
  
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { isOpen: isCartOpen, openCart, closeCart } = useCartDrawer();
  const [showAuthModal, setShowAuthModal] = useState(false);
@@ -39,6 +52,7 @@
  ];
  return (
    <>

      <header className="bg-[#F8F8F5] shadow-sm sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
@@ -71,21 +85,39 @@
                    className="relative p-2 hidden md:flex"
                    title="Admin Dashboard"
                  >
                    <Settings className="w-8 h-8 text-brand-blue-700" />

                  </Button>
                </Link>
              )}

              {/* Cart Icon */}
              <motion.div animate={{ scale: isCartAnimating ? 1.2 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                <Button variant="ghost" size="sm" onClick={openCart} className="relative p-2" ref={ref}>
                  <ShoppingCart className="w-10 h-10 text-brand-blue-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-blue-700 text-brand-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </motion.div>

              
              
              
<!--               <Button variant="ghost" size="sm" onClick={openCart} className="relative p-2" ref={ref}>
                <ShoppingCart className="w-10 h-10" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#514B3D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button> -->

              
              
              
              {/* User Account */}
              <Button
                variant="ghost"
@@ -104,25 +136,30 @@
                onClick={() => setShowMobileDrawer(true)}
                className="lg:hidden font-normal text-2xl"
              >
                
                <Menu className="w-10 h-10 text-brand-blue-700" />
                
<!--                 <Menu className="w-10 h-10" /> -->
              
              
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
export default Header;