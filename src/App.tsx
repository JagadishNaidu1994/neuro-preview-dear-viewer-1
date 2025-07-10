
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
import Journal from "@/pages/Journal";
import JournalPost from "@/pages/JournalPost";
import ReferFriend from "@/pages/ReferFriend";
import ContactUs from "@/pages/ContactUs";
import FAQ from "@/pages/FAQ";
import ShippingReturns from "@/pages/ShippingReturns";
import Rewards from "@/pages/Rewards";
import ProfileSettings from "@/pages/ProfileSettings";
import Subscriptions from "@/pages/Subscriptions";
import OrderHistory from "@/pages/OrderHistory";
import Preferences from "@/pages/Preferences";
import Security from "@/pages/Security";
import AddressBook from "@/pages/AddressBook";
import PaymentMethods from "@/pages/PaymentMethods";
import AccountSampleData from "@/components/AccountSampleData";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { CartProvider } from "@/context/CartProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <CartProvider>
        <BrowserRouter>
          <AccountSampleData />
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
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<JournalPost />} />
            <Route path="/refer" element={<ReferFriend />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/shipping" element={<ShippingReturns />} />
            <Route path="/rewards" element={<Rewards />} />

            {/* Account routes - all handled by AccountPage */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/dashboard"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/orders"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/profile"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/subscriptions"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/addresses"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/payments"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/rewards"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/preferences"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/security"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
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
