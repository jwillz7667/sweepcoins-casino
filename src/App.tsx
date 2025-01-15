import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { Purchase } from "@/pages/Purchase";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/purchase" element={<Purchase />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;