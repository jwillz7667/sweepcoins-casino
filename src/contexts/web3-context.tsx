import { createContext, useContext } from "react";
import { useWeb3Store } from "@/store";

export interface Web3ContextType {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  sendTransaction: (amount: number) => Promise<{ success: boolean; hash?: string }>;
}

export const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  const { account, chainId, isConnecting } = useWeb3Store();
  
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  
  return {
    ...context,
    account,
    chainId,
    isConnecting,
  };
}; 