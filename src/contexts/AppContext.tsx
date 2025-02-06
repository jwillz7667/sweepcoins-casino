import { createContext, useContext } from 'react';

export interface AppContextType {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = AppContext.Provider;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 