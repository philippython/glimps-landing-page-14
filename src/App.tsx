
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VenueDashboard from "./pages/VenueDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import PhotoGallery from "./pages/PhotoGallery";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthProvider";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Public routes with navbar and footer */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <Index />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/pricing"
                element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <Pricing />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/about"
                element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <About />
                    </main>
                    <Footer />
                  </>
                }
              />

              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                {user && user.role === "renter" || "admin"
                  && <Route path="/venue-dashboard" element={<VenueDashboard />} />
                }
                {user && user.role === "admin"
                  && <Route path="/admin-dashboard" element={<AdminDashboard />} />
                }
              </Route>

              {/* Photo Gallery route */}
              <Route path="/photos/:uuid" element={<PhotoGallery />} />

              {/* 404 route */}
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <NotFound />
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;
