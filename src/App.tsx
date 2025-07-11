
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthProvider";
import Index from "@/pages/Index";
import ShopAll from "@/pages/ShopAll";
import ProductPage from "@/pages/ProductPage";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import ContactUs from "@/pages/ContactUs";
import FAQ from "@/pages/FAQ";
import ShippingReturns from "@/pages/ShippingReturns";
import TheScience from "@/pages/TheScience";
import Ethos from "@/pages/Ethos";
import HerbalIndex from "@/pages/HerbalIndex";
import Journal from "@/pages/Journal";
import JournalPost from "@/pages/JournalPost";
import AccountPage from "@/pages/AccountPage";
import ProfileSettings from "@/pages/ProfileSettings";
import AddressBook from "@/pages/AddressBook";
import PaymentMethods from "@/pages/PaymentMethods";
import OrderHistory from "@/pages/OrderHistory";
import Rewards from "@/pages/Rewards";
import ReferFriend from "@/pages/ReferFriend";
import Preferences from "@/pages/Preferences";
import Security from "@/pages/Security";
import Subscriptions from "@/pages/Subscriptions";
import AdminDashboard from "@/pages/AdminDashboard";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { CartProvider } from "@/context/CartProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/the-science" element={<TheScience />} />
            <Route path="/ethos" element={<Ethos />} />
            <Route path="/herbal" element={<HerbalIndex />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<JournalPost />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Account Routes */}
            <Route path="/account" element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            )} />
            <Route path="/profile-settings" element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            )} />
            <Route path="/address-book" element={
              <ProtectedRoute>
                <AddressBook />
              </ProtectedRoute>
            )} />
            <Route path="/payment-methods" element={
              <ProtectedRoute>
                <PaymentMethods />
              </ProtectedRoute>
            )} />
            <Route path="/order-history" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            )} />
            <Route path="/rewards" element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            )} />
            <Route path="/refer-friend" element={
              <ProtectedRoute>
                <ReferFriend />
              </ProtectedRoute>
            )} />
            <Route path="/preferences" element={
              <ProtectedRoute>
                <Preferences />
              </ProtectedRoute>
            )} />
            <Route path="/security" element={
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            )} />
            <Route path="/subscriptions" element={
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            )} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            )} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
