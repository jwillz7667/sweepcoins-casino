import { createContext, useContext, useCallback, useMemo, useState, useEffect, ReactNode } from "react";
import { BrowserProvider, parseEther } from "ethers";
import Web3Modal from "web3modal";
import { toast } from "sonner";
import { useWeb3Store } from "@/store";

interface Web3ContextType {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  sendTransaction: (amount: number) => Promise<{ success: boolean; hash?: string }>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const { account, isConnecting, setAccount, setChainId, setIsConnecting, resetWeb3State } = useWeb3Store();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const web3Modal = useMemo(
    () =>
      new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      }),
    []
  );

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      const instance = await web3Modal.connect();
      const provider = new BrowserProvider(instance);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setAccount(account);
      setChainId(Number(network.chainId));

      // Subscribe to accounts change
      instance.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          resetWeb3State();
        }
      });

      // Subscribe to chainId change
      instance.on("chainChanged", (chainId: string) => {
        setChainId(Number(chainId));
      });

      // Subscribe to provider disconnection
      instance.on("disconnect", () => {
        resetWeb3State();
      });

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
      resetWeb3State();
    } finally {
      setIsConnecting(false);
    }
  }, [web3Modal, setAccount, setChainId, setIsConnecting, resetWeb3State]);

  const disconnectWallet = useCallback(async () => {
    try {
      await web3Modal.clearCachedProvider();
      resetWeb3State();
      setProvider(null);
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  }, [web3Modal, resetWeb3State]);

  const sendTransaction = useCallback(async (amount: number): Promise<{ success: boolean; hash?: string }> => {
    if (!provider || !account) {
      toast.error("Please connect your wallet first");
      return { success: false };
    }

    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_CASINO_WALLET_ADDRESS,
        value: parseEther(amount.toString()),
      });

      toast.success("Transaction sent! Waiting for confirmation...");
      
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        toast.success("Transaction confirmed!");
        return { success: true, hash: tx.hash };
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error(error instanceof Error ? error.message : "Transaction failed!");
      return { success: false };
    }
  }, [provider, account]);

  useEffect(() => {
    if (web3Modal.cachedProvider && !account && !isConnecting) {
      connectWallet();
    }
  }, [web3Modal.cachedProvider, account, isConnecting, connectWallet]);

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        disconnectWallet,
        sendTransaction,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

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

export { Web3Context }; 