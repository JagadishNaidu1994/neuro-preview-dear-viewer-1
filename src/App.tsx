
// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import PageWrapper from "@/components/PageWrapper";

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
import Breadcrumb from "@/components/Breadcrumb";
import SampleJournalContent from "@/components/SampleJournalContent";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { CartProvider } from "@/context/CartProvider";
import { CouponProvider } from "@/context/CouponProvider";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Index />
            </PageWrapper>
          }
        />
        <Route
          path="/shop-all"
          element={
            <PageWrapper>
              <Header />
              <Breadcrumb />
              <ShopAll />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/product"
          element={
            <PageWrapper>
              <Header />
              <Breadcrumb />
              <ProductPage />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <PageWrapper>
              <Header />
              <Breadcrumb />
              <Cart />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/checkout"
          element={
            <PageWrapper>
              <Header />
              <Breadcrumb />
              <Checkout />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/order-success"
          element={
            <PageWrapper>
              <OrderSuccess />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/the-science"
          element={
            <PageWrapper>
              <TheScience />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/ethos"
          element={
            <PageWrapper>
              <Ethos />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PageWrapper>
              <ResetPassword />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/herbal-index"
          element={
            <PageWrapper>
              <HerbalIndex />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/journal"
          element={
            <PageWrapper>
              <Journal />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/journal/:id"
          element={
            <PageWrapper>
              <JournalPost />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/refer"
          element={
            <PageWrapper>
              <ReferFriend />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <ContactUs />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/faqs"
          element={
            <PageWrapper>
              <FAQ />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/shipping"
          element={
            <PageWrapper>
              <ShippingReturns />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/rewards"
          element={
            <PageWrapper>
              <Rewards />
              <Footer />
            </PageWrapper>
          }
        />
        {/* Account routes - all handled by AccountPage */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/profile"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/subscriptions"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/addresses"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/payments"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/rewards"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/preferences"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/security"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AccountPage />
                <Footer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
              <Footer />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <CartProvider>
        <CouponProvider>
          <BrowserRouter>
            <SampleJournalContent />
            <AppRoutes />
          </BrowserRouter>
        </CouponProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
