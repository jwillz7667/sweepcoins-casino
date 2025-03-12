import { createContext } from 'react';
import { BTCPayContextType } from './types';

export const BTCPayContext = createContext<BTCPayContextType | null>(null); 