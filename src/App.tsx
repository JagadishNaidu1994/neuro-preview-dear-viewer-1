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
import Footer from "@/components/Footer";
import SampleJournalContent from "@/components/SampleJournalContent";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { CartProvider } from "@/context/CartProvider";
import AccountSampleData from "@/components/AccountSampleData";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <CartProvider>
        <BrowserRouter>
          <AccountSampleData />
          <SampleJournalContent />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop-all" element={<><ShopAll /><Footer /></>} />
            <Route path="/product" element={<><ProductPage /><Footer /></>} />
            <Route path="/cart" element={<><Cart /><Footer /></>} />
            <Route path="/checkout" element={<><Checkout /><Footer /></>} />
            <Route path="/order-success" element={<><OrderSuccess /><Footer /></>} />
            <Route path="/the-science" element={<><TheScience /><Footer /></>} />
            <Route path="/ethos" element={<><Ethos /><Footer /></>} />
            <Route path="/reset-password" element={<><ResetPassword /><Footer /></>} />
            <Route path="/herbal-index" element={<><HerbalIndex /><Footer /></>} />
            <Route path="/journal" element={<><Journal /><Footer /></>} />
            <Route path="/journal/:id" element={<><JournalPost /><Footer /></>} />
            <Route path="/refer" element={<><ReferFriend /><Footer /></>} />
            <Route path="/contact" element={<><ContactUs /><Footer /></>} />
            <Route path="/faqs" element={<><FAQ /><Footer /></>} />
            <Route path="/shipping" element={<><ShippingReturns /><Footer /></>} />
            <Route path="/rewards" element={<><Rewards /><Footer /></>} />

            {/* Account routes - all handled by AccountPage */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/dashboard"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/orders"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/profile"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/subscriptions"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/addresses"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/payments"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/rewards"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/preferences"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/security"
              element={
                <ProtectedRoute>
                  <AccountPage />
                  <Footer />
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
            <Route path="*" element={<><NotFound /><Footer /></>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
