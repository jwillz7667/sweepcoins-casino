import React from 'react';
import { BTCPayContext } from './context';
import { BTCPayContextType } from './types';

interface BTCPayProviderProps {
  children: React.ReactNode;
  value: BTCPayContextType;
}

export function BTCPayProvider({ children, value }: BTCPayProviderProps) {
  return (
    <BTCPayContext.Provider value={value}>
      {children}
    </BTCPayContext.Provider>
  );
} 