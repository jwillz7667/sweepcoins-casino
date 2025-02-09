import { Request, Response } from 'express';
import { WebhookHandler } from '@/lib/webhook-handler';
import { errorTracking } from '@/lib/error-tracking';

const webhookHandler = new WebhookHandler();

export async function POST(req: Request, res: Response) {
  try {
    // Get the signature from headers
    const signature = req.headers['btcpay-sig'];
    if (!signature || typeof signature !== 'string') {
      return res.status(401).json({ error: 'Missing signature' });
    }

    // Get the raw body
    const rawBody = JSON.stringify(req.body);
    
    // Verify signature
    if (!webhookHandler.verifySignature(rawBody, signature)) {
      errorTracking.captureMessage('Invalid webhook signature', {
        level: 'warning',
        extra: {
          headers: req.headers,
          ip: req.ip,
        },
      });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Handle the webhook event
    await webhookHandler.handleInvoiceEvent(req.body);

    // Return success
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    errorTracking.captureError(error, {
      context: {
        path: '/api/btcpay/webhook',
        method: 'POST',
        headers: req.headers,
      },
    });
    
    // Don't expose internal errors to the client
    return res.status(500).json({ error: 'Internal server error' });
  }
} 