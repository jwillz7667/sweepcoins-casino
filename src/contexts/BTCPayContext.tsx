import { type ReactNode } from 'react';
import { BTCPayContext, type BTCPayContextType } from './btcpay-context';

interface BTCPayProviderProps {
  children: ReactNode;
  value: BTCPayContextType;
}

const BTCPayProvider = ({ children, value }: BTCPayProviderProps) => {
  return <BTCPayContext.Provider value={value}>{children}</BTCPayContext.Provider>;
};

export default BTCPayProvider; 