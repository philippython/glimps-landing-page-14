
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// import Pricing from "./pages/Pricing";
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
import { LocaleProvider } from "./locales/LocaleProvider";
import VenueCreation from "./pages/VenueCreation";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuth();

  return (
    <LocaleProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Routes>
                {/* public routes */}
                <Route path="/*" element={
                  <>
                    < Navbar />
                    <main className="flex-grow">
                      {/* Public routes with navbar and footer */}
                      <Routes>
                        <Route path="/" element={<Index />} />
                        {/* <Route path="/pricing" element={<Pricing />} /> */}
                        <Route path="/about" element={<About />} />
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
                    </main>
                    <Footer />
                  </>
                }>
                </Route>

                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/venue-dashboard" element={<VenueDashboard />} />
                  <Route path="/venue-creation" element={<VenueCreation />} />
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
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </LocaleProvider >
  )
};

export default App;
