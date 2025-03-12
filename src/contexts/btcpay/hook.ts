import { useContext } from 'react';
import { BTCPayContext } from './context';

export const useBTCPay = () => {
  const context = useContext(BTCPayContext);
  if (!context) {
    throw new Error('useBTCPay must be used within a BTCPayProvider');
  }
  return context;
}; 