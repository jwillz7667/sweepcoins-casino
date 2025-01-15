import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  username: string;
  sweepcoins: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulated auth functions - replace with real auth later
  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API call
      const mockUser = {
        id: "1",
        email,
        username: email.split("@")[0],
        sweepcoins: 1000,
      };
      setUser(mockUser);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  const signUp = async (email: string, username: string, password: string) => {
    try {
      // Simulate API call
      const mockUser = {
        id: "1",
        email,
        username,
        sweepcoins: 1000,
      };
      setUser(mockUser);
      toast.success("Welcome to SweepCoins Casino!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  const signOut = () => {
    setUser(null);
    navigate("/");
    toast.success("Signed out successfully");
  };

  useEffect(() => {
    // Simulate checking auth state
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};