import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { BTCPayWebhookPayload } from '@/types/btcpay';
import { errorTracking } from '@/lib/error-tracking';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export class WebhookHandler {
  private readonly webhookSecret: string;

  constructor() {
    const secret = process.env.VITE_BTCPAY_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('BTCPay webhook secret is not configured');
    }
    this.webhookSecret = secret;
  }

  verifySignature(payload: string, signature: string): boolean {
    try {
      const computedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(computedSignature)
      );
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  async handleInvoiceEvent(payload: BTCPayWebhookPayload): Promise<void> {
    const { type, invoiceId } = payload;

    try {
      // Log webhook event
      await supabase.from('webhook_logs').insert({
        event_type: type,
        invoice_id: invoiceId,
        payload: payload
      });

      switch (type) {
        case 'InvoiceSettled':
          await this.handleInvoiceSettled(payload);
          break;
        case 'InvoiceExpired':
          await this.handleInvoiceExpired(payload);
          break;
        case 'InvoiceInvalid':
          await this.handleInvoiceInvalid(payload);
          break;
        case 'InvoiceProcessing':
          await this.handleInvoiceProcessing(payload);
          break;
        default:
          console.log(`Unhandled webhook event type: ${type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      errorTracking.captureError(error, {
        context: {
          webhookType: type,
          invoiceId: invoiceId,
        }
      });
      throw error;
    }
  }

  private async handleInvoiceSettled(payload: BTCPayWebhookPayload): Promise<void> {
    const { invoiceId, metadata } = payload;
    
    try {
      // Start a transaction
      const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_id', invoiceId)
        .single();

      if (fetchError || !invoice) {
        throw new Error(`Invoice not found: ${invoiceId}`);
      }

      // Update invoice status
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: 'settled',
          settled_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId);

      if (updateError) {
        throw updateError;
      }

      // Credit user's account with purchased coins
      if (metadata?.userId && metadata?.coins) {
        const { error: userUpdateError } = await supabase.rpc('add_user_coins', {
          user_id: metadata.userId as string,
          coins_amount: metadata.coins as number
        });

        if (userUpdateError) {
          throw userUpdateError;
        }
      }

      // Update purchase intent status
      if (metadata?.intentId) {
        const { error: intentUpdateError } = await supabase
          .from('purchase_intents')
          .update({ status: 'completed' })
          .eq('id', metadata.intentId);

        if (intentUpdateError) {
          throw intentUpdateError;
        }
      }
    } catch (error) {
      console.error('Error processing settled invoice:', error);
      errorTracking.captureError(error, {
        context: {
          invoiceId,
          metadata,
        }
      });
      throw error;
    }
  }

  private async handleInvoiceExpired(payload: BTCPayWebhookPayload): Promise<void> {
    const { invoiceId, metadata } = payload;

    try {
      // Update invoice status
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: 'expired',
          expired_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId);

      if (updateError) {
        throw updateError;
      }

      // Update purchase intent status
      if (metadata?.intentId) {
        const { error: intentUpdateError } = await supabase
          .from('purchase_intents')
          .update({ status: 'expired' })
          .eq('id', metadata.intentId);

        if (intentUpdateError) {
          throw intentUpdateError;
        }
      }
    } catch (error) {
      console.error('Error processing expired invoice:', error);
      errorTracking.captureError(error, {
        context: {
          invoiceId,
          metadata,
        }
      });
      throw error;
    }
  }

  private async handleInvoiceInvalid(payload: BTCPayWebhookPayload): Promise<void> {
    const { invoiceId, metadata } = payload;

    try {
      // Update invoice status
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: 'invalid',
          invalidated_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId);

      if (updateError) {
        throw updateError;
      }

      // Update purchase intent status
      if (metadata?.intentId) {
        const { error: intentUpdateError } = await supabase
          .from('purchase_intents')
          .update({ status: 'failed' })
          .eq('id', metadata.intentId);

        if (intentUpdateError) {
          throw intentUpdateError;
        }
      }
    } catch (error) {
      console.error('Error processing invalid invoice:', error);
      errorTracking.captureError(error, {
        context: {
          invoiceId,
          metadata,
        }
      });
      throw error;
    }
  }

  private async handleInvoiceProcessing(payload: BTCPayWebhookPayload): Promise<void> {
    const { invoiceId, metadata } = payload;

    try {
      // Update invoice status
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: 'processing',
          processing_started_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId);

      if (updateError) {
        throw updateError;
      }

      // Update purchase intent status
      if (metadata?.intentId) {
        const { error: intentUpdateError } = await supabase
          .from('purchase_intents')
          .update({ status: 'processing' })
          .eq('id', metadata.intentId);

        if (intentUpdateError) {
          throw intentUpdateError;
        }
      }
    } catch (error) {
      console.error('Error processing invoice:', error);
      errorTracking.captureError(error, {
        context: {
          invoiceId,
          metadata,
        }
      });
      throw error;
    }
  }
} 