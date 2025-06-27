// // src/App.tsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import AuthModal from "@/components/AuthModal";
// import { useAuth } from "@/context/AuthProvider";
// import Index from "@/pages/Index";
// import NotFound from "@/pages/NotFound";
// import ShopAll from "@/pages/ShopAll";
// import TheScience from "@/pages/TheScience";
// import Ethos from "@/pages/Ethos";
// import HerbalIndex from "@/pages/HerbalIndex";
// import ProductPage from "@/pages/ProductPage";
// import AccountPage from "@/pages/AccountPage";
// import ResetPassword from "@/pages/ResetPassword";

// import { AuthProvider } from "@/context/AuthProvider";
// import ProtectedRoute from "@/components/ProtectedRoute";

// const queryClient = new QueryClient();
// const { isAuthModalOpen, closeAuthModal } = useAuth();


// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <BrowserRouter>
//         <AuthProvider>
//           <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/shop-all" element={<ShopAll />} />
//             <Route path="/product" element={<ProductPage />} />
//             <Route path="/the-science" element={<TheScience />} />
//             <Route path="/ethos" element={<Ethos />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="/herbal-index" element={<HerbalIndex />} />

//             <Route
//               path="/account"
//               element={
//                 <ProtectedRoute>
//                   <AccountPage />
//                 </ProtectedRoute>
//               }
//             />
            
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </AuthProvider>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;





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

import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop-all" element={<ShopAll />} />
          <Route path="/product" element={<ProductPage />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
