import {
  Bitcoin,
  Ethereum,
  Loader2,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  bitcoin: Bitcoin,
  ethereum: Ethereum,
  litecoin: CreditCard, // Using CreditCard as placeholder since Lucide doesn't have Litecoin
  spinner: Loader2,
  creditCard: CreditCard,
} as const; 