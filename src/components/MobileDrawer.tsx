
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountClick: () => void;
}

const MobileDrawer = ({ isOpen, onClose, onAccountClick }: MobileDrawerProps) => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  const navItems = [
    { label: "Shop All", href: "/shop-all" },
    { label: "The Science", href: "/the-science" },
    { label: "Ethos", href: "/ethos" },
    { label: "Herbal Index", href: "/herbal-index" },
    { label: "Journal", href: "/journal" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col mt-8 space-y-4">
          {/* Navigation Links */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="text-[#514B3D] hover:text-[#3f3a2f] font-medium transition-colors py-2"
            >
              {item.label}
            </Link>
          ))}

          <div className="border-t pt-4 mt-4">
            {user ? (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onAccountClick();
                    onClose();
                  }}
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
                
                {/* Admin Link - Only show for admin users */}
                {isAdmin && (
                  <Link to="/admin" onClick={onClose}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  onAccountClick();
                  onClose();
                }}
                className="w-full justify-start"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDrawer;
