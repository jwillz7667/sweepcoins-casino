import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { BTCPayWebhookPayload } from '@/types/btcpay';
import { checkRateLimit } from '@/lib';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Verify BTCPay webhook signature
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.VITE_BTCPAY_WEBHOOK_SECRET
  if (!secret) throw new Error('BTCPay webhook secret not configured')

  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

// Process webhook payload based on event type
async function processWebhookPayload(payload: BTCPayWebhookPayload): Promise<void> {
  const { type, invoiceId } = payload;

  try {
    // Record webhook event
    await supabase.from('webhook_events').insert({
      event_type: type,
      invoice_id: invoiceId,
      payload: payload,
      processed_at: new Date().toISOString()
    });

    switch (type) {
      case 'InvoiceCreated':
        await handleInvoiceCreated(payload);
        break;
      case 'InvoiceReceivedPayment':
        await handleInvoiceReceivedPayment(payload);
        break;
      case 'InvoiceProcessing':
        await handleInvoiceProcessing(payload);
        break;
      case 'InvoiceSettled':
        await handleInvoiceSettled(payload);
        break;
      case 'InvoiceExpired':
        await handleInvoiceExpired(payload);
        break;
      case 'InvoiceInvalid':
        await handleInvoiceInvalid(payload);
        break;
      case 'InvoicePaymentSettled':
        await handleInvoicePaymentSettled(payload);
        break;
      default:
        console.warn(`Unhandled webhook event type: ${type}`);
    }
  } catch (error) {
    console.error(`Error processing webhook payload for invoice ${invoiceId}:`, error);
    throw error;
  }
}

async function handleInvoiceCreated(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId } = payload;
  
  await supabase.from('invoices').insert({
    id: invoiceId,
    status: 'New',
    created_at: new Date().toISOString()
  });
}

async function handleInvoiceReceivedPayment(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId, payment } = payload;
  
  if (payment) {
    await supabase.from('payments').insert({
      invoice_id: invoiceId,
      amount: payment.value,
      currency: payment.currency,
      crypto_code: payment.cryptoCode,
      destination: payment.destination,
      received_at: new Date().toISOString()
    });
  }
  
  await supabase.from('invoices').update({
    status: 'Processing',
    updated_at: new Date().toISOString()
  }).eq('id', invoiceId);
}

async function handleInvoiceProcessing(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId } = payload;
  
  await supabase.from('invoices').update({
    status: 'Processing',
    updated_at: new Date().toISOString()
  }).eq('id', invoiceId);
}

async function handleInvoiceSettled(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId } = payload;
  
  await supabase.from('invoices').update({
    status: 'Settled',
    settled_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).eq('id', invoiceId);
}

async function handleInvoiceExpired(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId } = payload;
  
  await supabase.from('invoices').update({
    status: 'Expired',
    updated_at: new Date().toISOString()
  }).eq('id', invoiceId);
}

async function handleInvoiceInvalid(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId } = payload;
  
  await supabase.from('invoices').update({
    status: 'Invalid',
    updated_at: new Date().toISOString()
  }).eq('id', invoiceId);
}

async function handleInvoicePaymentSettled(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId, payment } = payload;
  
  if (payment) {
    await supabase.from('payments').update({
      status: 'Settled',
      settled_at: new Date().toISOString()
    }).eq('invoice_id', invoiceId);
  }
}

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  // Add rate limiting for webhook origin verification
  const rateLimited = await checkRateLimit(req, 'btcpay-webhook', 25)
  if (rateLimited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  try {
    const signature = req.headers.get('BTCPay-Sig');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing BTCPay signature' }, { status: 401 });
    }

    const body = await req.text();
    
    if (!verifySignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: BTCPayWebhookPayload = JSON.parse(body);
    await processWebhookPayload(payload);

    return NextResponse.json('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
} 