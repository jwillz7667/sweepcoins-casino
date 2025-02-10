import { serve } from 'http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

interface BTCPayWebhookPayload {
  id: string
  type: string
  timestamp: string
  storeId: string
  invoiceId: string
  metadata: {
    userId?: string
    packageId?: string
    coins?: number
    intentId?: string
    [key: string]: unknown
  }
}

const webhookSecret = Deno.env.get('BTCPAY_WEBHOOK_SECRET')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!webhookSecret) {
  throw new Error('Missing BTCPAY_WEBHOOK_SECRET')
}

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifySignature(payload: string, signature: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const payloadBuffer = encoder.encode(payload)
    const signatureBuffer = new Uint8Array(
      signature.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    )

    const computedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      payloadBuffer
    )

    if (signatureBuffer.length !== new Uint8Array(computedSignature).length) {
      return false
    }

    return crypto.subtle.verify(
      'HMAC',
      key,
      computedSignature,
      signatureBuffer
    )
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}

async function handleInvoiceSettled(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId, metadata } = payload

  try {
    // Update invoice status
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ 
        status: 'settled',
        settled_at: new Date().toISOString(),
      })
      .eq('invoice_id', invoiceId)

    if (updateError) throw updateError

    // Credit user's account with purchased coins
    if (metadata?.userId && metadata?.coins) {
      const { error: userUpdateError } = await supabase.rpc('add_user_coins', {
        user_id: metadata.userId,
        coins_amount: metadata.coins
      })

      if (userUpdateError) throw userUpdateError
    }

    // Update purchase intent status
    if (metadata?.intentId) {
      const { error: intentUpdateError } = await supabase
        .from('purchase_intents')
        .update({ status: 'completed' })
        .eq('id', metadata.intentId)

      if (intentUpdateError) throw intentUpdateError
    }
  } catch (error) {
    console.error('Error processing settled invoice:', error)
    throw error
  }
}

async function handleInvoiceExpired(payload: BTCPayWebhookPayload): Promise<void> {
  const { invoiceId, metadata } = payload

  try {
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ 
        status: 'expired',
        expired_at: new Date().toISOString(),
      })
      .eq('invoice_id', invoiceId)

    if (updateError) throw updateError

    if (metadata?.intentId) {
      const { error: intentUpdateError } = await supabase
        .from('purchase_intents')
        .update({ status: 'expired' })
        .eq('id', metadata.intentId)

      if (intentUpdateError) throw intentUpdateError
    }
  } catch (error) {
    console.error('Error processing expired invoice:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: { ...corsHeaders }
      })
    }

    const signature = req.headers.get('btcpay-sig')
    if (!signature) {
      return new Response('Missing signature', { 
        status: 401,
        headers: { ...corsHeaders }
      })
    }

    const body = await req.text()
    const isValid = await verifySignature(body, signature)
    
    if (!isValid) {
      return new Response('Invalid signature', { 
        status: 401,
        headers: { ...corsHeaders }
      })
    }

    const payload: BTCPayWebhookPayload = JSON.parse(body)

    // Log webhook event
    await supabase.from('webhook_logs').insert({
      event_type: payload.type,
      invoice_id: payload.invoiceId,
      payload: payload
    })

    // Handle different event types
    switch (payload.type) {
      case 'InvoiceSettled':
        await handleInvoiceSettled(payload)
        break
      case 'InvoiceExpired':
        await handleInvoiceExpired(payload)
        break
      case 'InvoiceInvalid':
        // Similar to expired handling
        await handleInvoiceExpired(payload)
        break
      case 'InvoiceProcessing':
        // Update status to processing
        await supabase
          .from('invoices')
          .update({ 
            status: 'processing',
            processing_started_at: new Date().toISOString(),
          })
          .eq('invoice_id', payload.invoiceId)
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}) 