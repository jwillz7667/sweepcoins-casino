export interface Package {
  id: string;
  name: string;
  description: string;
  coins: number;
  btcPrice: number;
  discountPercentage?: number;
  featured?: boolean;
}

export type PackageId = string; 