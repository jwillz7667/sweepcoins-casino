import { type Transaction } from '@/types/transaction';
import { BTCPayService } from './btcpay';
import { Package } from '@/types/package';
import { BTCPayInvoice, BTCPayMetadata } from '@/types/btcpay';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

/**
 * @deprecated 'credit_card' payment method is temporarily unavailable
 * @deprecated 'ethereum' payment method is temporarily unavailable
 * @deprecated 'litecoin' payment method is temporarily unavailable
 */
export type PaymentMethod = 'bitcoin' | 'credit_card' | 'ethereum' | 'litecoin';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentDetails {
  amount: number;
  currency: string;
  method: PaymentMethod;
  userId: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface RefundDetails {
  transactionId: string;
  reason: string;
  amount?: number; // Optional for partial refunds
}

export class PaymentService {
  private btcPayService: BTCPayService;

  constructor() {
    this.btcPayService = new BTCPayService();
  }

  async createPayment(
    pkg: Package,
    userId?: string
  ): Promise<BTCPayInvoice> {
    try {
      console.log('Creating payment for package:', {
        packageId: pkg.id,
        btcPrice: pkg.btcPrice,
        coins: pkg.coins,
        userId
      });

      const metadata: BTCPayMetadata = {
        packageId: pkg.id,
        coins: pkg.coins,
        userId
      };

      const invoice = await this.btcPayService.createInvoice({
        price: pkg.btcPrice,
        currency: 'BTC',
        metadata
      });

      console.log('Payment created successfully:', {
        invoiceId: invoice.id,
        status: invoice.status
      });

      return invoice;
    } catch (error) {
      console.error('Failed to create payment:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        packageId: pkg.id,
        userId
      });
      throw new Error('Failed to create payment. Please try again.');
    }
  }

  async getPaymentStatus(invoiceId: string): Promise<BTCPayInvoice> {
    try {
      return await this.btcPayService.getInvoice(invoiceId);
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw new Error('Failed to get payment status');
    }
  }

  async getWebhookDeliveries() {
    try {
      return await this.btcPayService.getWebhookDeliveries();
    } catch (error) {
      console.error('Failed to get webhook deliveries:', error);
      throw new Error('Failed to get webhook deliveries');
    }
  }

  async processPayment(details: PaymentDetails): Promise<Transaction> {
    try {
      if (details.method !== 'bitcoin') {
        throw new Error(`Payment method '${details.method}' is temporarily unavailable. Please use Bitcoin for payments.`);
      }

      const metadata: BTCPayMetadata = {
        userId: details.userId,
        packageId: details.metadata?.packageId as string,
        coins: details.metadata?.coins as number
      };

      const invoice = await this.btcPayService.createInvoice({
        price: details.amount,
        currency: details.currency,
        metadata
      });

      return {
        id: invoice.id,
        status: 'pending',
        amount: details.amount,
        currency: details.currency,
        method: details.method,
        userId: details.userId,
        createdAt: new Date(),
        metadata: details.metadata as Record<string, string | number | boolean | null>,
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const invoice = await this.btcPayService.getInvoice(transactionId);
      return {
        id: invoice.id,
        status: invoice.status === 'Settled' ? 'completed' : invoice.status.toLowerCase() as TransactionStatus,
        amount: invoice.amount,
        currency: invoice.currency,
        method: 'bitcoin',
        userId: invoice.metadata?.userId as string,
        createdAt: new Date(invoice.createdAt),
        metadata: invoice.metadata as Record<string, string | number | boolean | null>
      };
    } catch (error) {
      console.error('Failed to get transaction:', error);
      throw new Error('Failed to get transaction');
    }
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (!transactions) return [];
      
      return transactions.map((tx: Transaction) => ({
        ...tx,
        createdAt: new Date(tx.createdAt),
        updatedAt: tx.updatedAt ? new Date(tx.updatedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to get user transactions:', error);
      throw new Error('Failed to get user transactions');
    }
  }

  async processRefund(details: RefundDetails): Promise<Transaction> {
    const transaction = await this.getTransaction(details.transactionId);
    
    if (transaction.status === 'refunded') {
      throw new Error('Transaction already refunded');
    }

    const refundAmount = details.amount ?? transaction.amount;

    await this.btcPayService.createRefund(transaction.id, {
      amount: refundAmount,
      description: details.reason
    });

    return {
      ...transaction,
      status: 'refunded',
      refundDetails: {
        reason: details.reason,
        amount: refundAmount,
        processedAt: new Date()
      },
      updatedAt: new Date(),
    };
  }

  async generateReceipt(transactionId: string): Promise<string> {
    const transaction = await this.getTransaction(transactionId);
    return `
Receipt for Transaction ${transaction.id}
Date: ${transaction.createdAt.toLocaleDateString()}
Amount: ${transaction.amount} ${transaction.currency}
Status: ${transaction.status}
Method: ${transaction.method}
${transaction.refundDetails ? `Refund: ${transaction.refundDetails.amount} (${transaction.refundDetails.reason})` : ''}
    `.trim();
  }
}

export const paymentService = new PaymentService(); 