import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Web3Provider } from "@/contexts/Web3Context";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense, lazy } from "react";

// Error Boundary Component
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

// Main Pages
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Purchase = lazy(() => import("@/pages/Purchase"));

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
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Web3Provider>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <div className="flex-grow">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Main Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/purchase" element={<Purchase />} />

                      {/* Game & Promotion Routes */}
                      <Route path="/games" element={<Games />} />
                      <Route path="/promotions" element={<Promotions />} />
                      <Route path="/vip" element={<VIPProgram />} />

                      {/* Information Routes */}
                      <Route path="/about" element={<About />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/support" element={<Support />} />

                      {/* Legal & Policy Routes */}
                      <Route path="/terms" element={<TermsAndConditions />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/kyc" element={<KYCPolicy />} />
                      <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
                    </Routes>
                  </Suspense>
                </div>
                <Footer />
              </div>
              <Toaster />
            </Web3Provider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;