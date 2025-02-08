import { PaymentMethod, TransactionStatus } from '@/lib/payment-service';

export interface Transaction {
  id: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  method: PaymentMethod;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: Record<string, string | number | boolean | null>;
  refundDetails?: {
    reason: string;
    amount: number;
    processedAt: Date;
  };
  receipt?: string;
} 