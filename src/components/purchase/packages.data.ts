import { type Package } from '@/types/package';

export const packages: Package[] = [
  {
    id: 'basic',
    name: 'Starter Pack',
    description: 'Perfect for casual players',
    coins: 1000,
    btcPrice: 0.001,
    discountPercentage: 0
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    description: 'Most popular choice',
    coins: 5000,
    btcPrice: 0.004,
    discountPercentage: 10,
    featured: true
  },
  {
    id: 'elite',
    name: 'Elite Pack',
    description: 'Best value for serious players',
    coins: 10000,
    btcPrice: 0.007,
    discountPercentage: 20
  }
]; 