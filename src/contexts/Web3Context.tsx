import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { ethers, BrowserProvider, Signer, parseEther } from "ethers";
import Web3Modal from "web3modal";
import { toast } from "sonner";

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  sendTransaction: (amount: number) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
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
          setAccount(null);
        }
      });

      // Subscribe to chainId change
      instance.on("chainChanged", (chainId: string) => {
        setChainId(Number(chainId));
      });

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  }, [web3Modal]);

  const disconnectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      setAccount(null);
      setChainId(null);
      setProvider(null);
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const sendTransaction = async (amount: number): Promise<boolean> => {
    if (!provider || !account) {
      toast.error("Please connect your wallet first");
      return false;
    }

    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "YOUR_RECEIVING_WALLET_ADDRESS", // Replace with your casino's wallet address
        value: parseEther(amount.toString()),
      });

      toast.success("Transaction sent! Waiting for confirmation...");
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        toast.success("Transaction confirmed!");
        return true;
      } else {
        toast.error("Transaction failed!");
        return false;
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed!");
      return false;
    }
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [connectWallet, web3Modal.cachedProvider]);

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        connectWallet,
        disconnectWallet,
        sendTransaction,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Context }; 