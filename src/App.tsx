// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ShopAll from "@/pages/ShopAll";
import TheScience from "@/pages/TheScience";
import Ethos from "@/pages/Ethos";
import HerbalIndex from "@/pages/HerbalIndex";
import ProductPage from "@/pages/ProductPage";
import AccountPage from "@/pages/AccountPage";
import ResetPassword from "@/pages/ResetPassword";
import AdminDashboard from "@/pages/AdminDashboard";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";

import ProtectedRoute from "@/components/ProtectedRoute";
import { CartProvider } from "@/context/CartProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop-all" element={<ShopAll />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/the-science" element={<TheScience />} />
            <Route path="/ethos" element={<Ethos />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/herbal-index" element={<HerbalIndex />} />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;