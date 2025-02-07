import { type Package } from '@/types/package';

export const packages: Package[] = [
  {
    id: 1,
    name: "Starter Pack",
    price: 0.01,
    btcPrice: 0.0004,
    currency: "ETH",
    coins: 1000
  },
  {
    id: 2,
    name: "Pro Pack",
    price: 0.05,
    btcPrice: 0.002,
    currency: "ETH",
    coins: 5000
  },
  {
    id: 3,
    name: "Elite Pack",
    price: 0.1,
    btcPrice: 0.004,
    currency: "ETH",
    coins: 10000
  }
]; 