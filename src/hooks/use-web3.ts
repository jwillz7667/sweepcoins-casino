import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface TransactionResult {
  hash: string;
  status: boolean;
}

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to connect a wallet');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const sendTransaction = useCallback(async (amount: number): Promise<TransactionResult | null> => {
    if (!window.ethereum || !account) {
      toast.error('Please connect your wallet first');
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: import.meta.env.VITE_PAYMENT_ADDRESS,
        value: ethers.parseEther(amount.toString())
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        status: receipt?.status === 1
      };
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed');
      return null;
    }
  }, [account]);

  return {
    account,
    isConnecting,
    connectWallet,
    sendTransaction
  };
} 