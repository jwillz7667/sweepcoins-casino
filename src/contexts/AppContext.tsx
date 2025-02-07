import { type ReactNode } from 'react';
import { AppContext } from './app-context';
import type { AppContextType } from './app-context';

interface AppProviderProps {
  children: ReactNode;
  value: AppContextType;
}

const AppProvider = ({ children, value }: AppProviderProps) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider; 