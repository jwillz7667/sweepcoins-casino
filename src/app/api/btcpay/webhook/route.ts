import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Verify BTCPay webhook signature
function verifySignature(payload: string, signature: string): boolean {
  try {
    const secret = process.env.VITE_BTCPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('BTCPay webhook secret is not configured');
      return false;
    }

    const computedSignature = crypto
      .createHmac('sha256', secret)
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

export async function POST(request: Request) {
  try {
    // Get the BTCPay signature from headers
    const headersList = headers();
    const signature = headersList.get('BTCPay-Sig');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get the raw payload
    const rawPayload = await request.text();
    
    // Verify the signature
    if (!verifySignature(rawPayload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the payload
    const payload = JSON.parse(rawPayload);
    
    // Handle different webhook types
    switch (payload.type) {
      case 'InvoiceReceivedPayment':
        // Update transaction status to processing
        await supabase
          .from('transactions')
          .update({
            status: 'processing',
            updated_at: new Date().toISOString(),
          })
          .eq('btcpay_invoice_id', payload.invoiceId);
        break;

      case 'InvoiceProcessing':
        // Update transaction status to processing
        await supabase
          .from('transactions')
          .update({
            status: 'processing',
            updated_at: new Date().toISOString(),
          })
          .eq('btcpay_invoice_id', payload.invoiceId);
        break;

      case 'InvoiceSettled':
        // Get the transaction and purchase intent
        const { data: transaction, error: txError } = await supabase
          .from('transactions')
          .select('*, purchase_intents(*)')
          .eq('btcpay_invoice_id', payload.invoiceId)
          .single();

        if (txError || !transaction) {
          console.error('Error fetching transaction:', txError);
          return NextResponse.json(
            { error: 'Transaction not found' },
            { status: 404 }
          );
        }

        // Begin transaction
        const { error: updateError } = await supabase.rpc('process_payment', {
          transaction_id: transaction.id,
          user_id: transaction.user_id,
          coins_amount: transaction.purchase_intents.coins
        });

        if (updateError) {
          console.error('Error processing payment:', updateError);
          return NextResponse.json(
            { error: 'Failed to process payment' },
            { status: 500 }
          );
        }
        break;

      case 'InvoiceExpired':
        // Update transaction status to expired
        await supabase
          .from('transactions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('btcpay_invoice_id', payload.invoiceId);
        break;

      case 'InvoiceInvalid':
        // Update transaction status to failed
        await supabase
          .from('transactions')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('btcpay_invoice_id', payload.invoiceId);
        break;

      default:
        console.log('Unhandled webhook type:', payload.type);
    }

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 