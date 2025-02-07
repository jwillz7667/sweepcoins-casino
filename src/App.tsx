import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/theme-context";
import AuthProvider from "@/contexts/AuthContext";
import Web3Provider from "@/contexts/Web3Context";
import SecurityProvider from "@/contexts/SecurityContext";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";

// Error Boundary Component
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Configure React Router future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Main Pages
const Index = lazy(() => import("@/pages/Index"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Purchase = lazy(() => import("@/pages/Purchase"));
const PurchaseSuccess = lazy(() => import("@/pages/PurchaseSuccess"));

// Legal & Policy Pages
const TermsAndConditions = lazy(() => import("@/pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const KYCPolicy = lazy(() => import("@/pages/KYCPolicy"));
const ResponsibleGaming = lazy(() => import("@/pages/ResponsibleGaming"));

// Additional Pages
const Games = lazy(() => import("@/pages/Games"));
const Promotions = lazy(() => import("@/pages/Promotions"));
const VIPProgram = lazy(() => import("@/pages/VIPProgram"));
const About = lazy(() => import("@/pages/About"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Support = lazy(() => import("@/pages/Support"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Router {...routerConfig}>
            <SecurityProvider>
              <AuthProvider>
                <Web3Provider>
                  <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-150">
                    <Navbar />
                    <div className="flex-grow">
                      <Suspense fallback={<LoadingFallback />}>
                        <AnimatePresence mode="wait">
                          <motion.div {...pageTransition}>
                            <Routes>
                              {/* Public Routes */}
                              <Route path="/" element={<Index />} />
                              <Route path="/auth" element={<AuthPage />} />

                              {/* Protected Routes */}
                              <Route path="/dashboard" element={
                                <ProtectedRoute>
                                  <Dashboard />
                                </ProtectedRoute>
                              } />
                              <Route path="/purchase" element={
                                <ProtectedRoute>
                                  <Purchase />
                                </ProtectedRoute>
                              } />
                              <Route path="/purchase/success" element={
                                <ProtectedRoute>
                                  <PurchaseSuccess />
                                </ProtectedRoute>
                              } />
                              <Route path="/games" element={
                                <ProtectedRoute>
                                  <Games />
                                </ProtectedRoute>
                              } />
                              <Route path="/promotions" element={
                                <ProtectedRoute>
                                  <Promotions />
                                </ProtectedRoute>
                              } />
                              <Route path="/vip" element={
                                <ProtectedRoute>
                                  <VIPProgram />
                                </ProtectedRoute>
                              } />

                              {/* Public Information Routes */}
                              <Route path="/about" element={<About />} />
                              <Route path="/faq" element={<FAQ />} />
                              <Route path="/support" element={<Support />} />
                              <Route path="/terms" element={<TermsAndConditions />} />
                              <Route path="/privacy" element={<PrivacyPolicy />} />
                              <Route path="/kyc" element={<KYCPolicy />} />
                              <Route path="/responsible-gaming" element={<ResponsibleGaming />} />

                              {/* Catch-all route for 404s */}
                              <Route path="*" element={
                                <div className="min-h-screen flex items-center justify-center">
                                  <div className="text-center">
                                    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                                    <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                                  </div>
                                </div>
                              } />
                            </Routes>
                          </motion.div>
                        </AnimatePresence>
                      </Suspense>
                    </div>
                    <Footer />
                  </div>
                  <Toaster />
                </Web3Provider>
              </AuthProvider>
            </SecurityProvider>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;