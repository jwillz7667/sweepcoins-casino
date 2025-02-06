export interface Package {
  id: number;
  coins: number;
  price: number; // ETH price
  btcPrice: number; // BTC price
  usdPrice: number;
  freeSC: number;
  tag: string | null;
}

export const packages: Package[] = [
  { 
    id: 1, 
    coins: 8000, 
    price: 0.001, // ETH price
    btcPrice: 0.00004, // BTC price
    usdPrice: 1.99,
    freeSC: 0,
    tag: null 
  },
  { 
    id: 2, 
    coins: 20000, 
    price: 0.0025, // ETH price
    btcPrice: 0.0001, // BTC price
    usdPrice: 4.99,
    freeSC: 5,
    tag: null 
  },
  { 
    id: 3, 
    coins: 40000, 
    price: 0.005, // ETH price
    btcPrice: 0.0002, // BTC price
    usdPrice: 9.99,
    freeSC: 10,
    tag: null 
  },
  { 
    id: 4, 
    coins: 80000, 
    price: 0.01, // ETH price
    btcPrice: 0.0004, // BTC price
    usdPrice: 19.99,
    freeSC: 20,
    tag: null 
  },
  { 
    id: 5, 
    coins: 160000, 
    price: 0.0175, // ETH price
    btcPrice: 0.0007, // BTC price
    usdPrice: 34.99,
    freeSC: 40,
    tag: "FLASH OFFER" 
  },
  { 
    id: 6, 
    coins: 180000, 
    price: 0.0195, // ETH price
    btcPrice: 0.00078, // BTC price
    usdPrice: 38.99,
    freeSC: 45,
    tag: "DAILY OFFER" 
  },
  { 
    id: 7, 
    coins: 200000, 
    price: 0.025, // ETH price
    btcPrice: 0.001, // BTC price
    usdPrice: 49.99,
    freeSC: 50,
    tag: null 
  },
]; 