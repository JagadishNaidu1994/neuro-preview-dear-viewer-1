import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ShopAll from "./pages/ShopAll";
import TheScience from "./pages/TheScience";
import Ethos from "./pages/Ethos";
import HerbalIndex from "./pages/HerbalIndex";
import ProductPage from "@/pages/ProductPage";
import AccountPage from "./pages/AccountPage";

import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route path="/shop-all" element={<ShopAll />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/the-science" element={<TheScience />} />
            <Route path="/ethos" element={<Ethos />} />
            <Route path="/herbal-index" element={<HerbalIndex />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
