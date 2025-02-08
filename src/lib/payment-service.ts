import { type User } from '@/types/user';
import { type Transaction } from '@/types/transaction';
import { stripe } from './stripe';
import { btcpay } from './btcpay';
import { BTCPayService } from './btcpay';
import { Package } from '@/types/package';
import { BTCPayInvoice, BTCPayMetadata } from '@/types/btcpay';

export type PaymentMethod = 'credit_card' | 'bitcoin' | 'ethereum' | 'litecoin';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentDetails {
  amount: number;
  currency: string;
  method: PaymentMethod;
  userId: string;
  metadata?: Record<string, any>;
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
      const metadata: BTCPayMetadata = {
        packageId: pkg.id,
        coins: pkg.coins,
        userId
      };

      return await this.btcPayService.createInvoice({
        price: pkg.btcPrice,
        currency: 'BTC',
        metadata
      });
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw new Error('Failed to create payment');
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

  async getWebhookDeliveries(webhookId: string) {
    try {
      return await this.btcPayService.getWebhookDeliveries(webhookId);
    } catch (error) {
      console.error('Failed to get webhook deliveries:', error);
      throw new Error('Failed to get webhook deliveries');
    }
  }

  async processPayment(details: PaymentDetails): Promise<Transaction> {
    try {
      switch (details.method) {
        case 'credit_card':
          return await this.processCreditCardPayment(details);
        case 'bitcoin':
        case 'ethereum':
        case 'litecoin':
          return await this.processCryptoPayment(details);
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  private async processCreditCardPayment(details: PaymentDetails): Promise<Transaction> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: details.amount,
      currency: details.currency,
      metadata: details.metadata,
    });

    return {
      id: paymentIntent.id,
      status: 'pending',
      amount: details.amount,
      currency: details.currency,
      method: details.method,
      userId: details.userId,
      createdAt: new Date(),
      metadata: details.metadata,
    };
  }

  private async processCryptoPayment(details: PaymentDetails): Promise<Transaction> {
    const invoice = await btcpay.createInvoice({
      amount: details.amount,
      currency: details.currency,
      metadata: details.metadata,
    });

    return {
      id: invoice.id,
      status: 'pending',
      amount: details.amount,
      currency: details.currency,
      method: details.method,
      userId: details.userId,
      createdAt: new Date(),
      metadata: details.metadata,
    };
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    // Implement transaction retrieval logic
    throw new Error('Not implemented');
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    // Implement user transactions retrieval logic
    throw new Error('Not implemented');
  }

  async processRefund(details: RefundDetails): Promise<Transaction> {
    const transaction = await this.getTransaction(details.transactionId);
    
    if (transaction.status === 'refunded') {
      throw new Error('Transaction already refunded');
    }

    // Process refund based on payment method
    switch (transaction.method) {
      case 'credit_card':
        return await this.processCreditCardRefund(transaction, details);
      case 'bitcoin':
      case 'ethereum':
      case 'litecoin':
        return await this.processCryptoRefund(transaction, details);
      default:
        throw new Error('Unsupported refund method');
    }
  }

  private async processCreditCardRefund(
    transaction: Transaction,
    details: RefundDetails
  ): Promise<Transaction> {
    await stripe.refunds.create({
      payment_intent: transaction.id,
      amount: details.amount || transaction.amount,
      reason: details.reason,
    });

    return {
      ...transaction,
      status: 'refunded',
      refundDetails: details,
      updatedAt: new Date(),
    };
  }

  private async processCryptoRefund(
    transaction: Transaction,
    details: RefundDetails
  ): Promise<Transaction> {
    await btcpay.createRefund({
      invoiceId: transaction.id,
      amount: details.amount || transaction.amount,
      reason: details.reason,
    });

    return {
      ...transaction,
      status: 'refunded',
      refundDetails: details,
      updatedAt: new Date(),
    };
  }

  async generateReceipt(transactionId: string): Promise<string> {
    const transaction = await this.getTransaction(transactionId);
    // Implement receipt generation logic
    throw new Error('Not implemented');
  }
}

export const paymentService = new PaymentService(); 