import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Web3Provider } from "@/contexts/Web3Context";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

// Main Pages
import Index from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { Purchase } from "@/pages/Purchase";

// Legal & Policy Pages
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import KYCPolicy from "@/pages/KYCPolicy";
import ResponsibleGaming from "@/pages/ResponsibleGaming";

// Additional Pages
import Games from "@/pages/Games";
import Promotions from "@/pages/Promotions";
import VIPProgram from "@/pages/VIPProgram";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Web3Provider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-grow">
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
              </div>
              <Footer />
            </div>
            <Toaster />
          </Web3Provider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;