import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { btcPayService } from '@/lib/btcpay';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*, purchase_intents(*)')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (error || !transaction) {
      console.error('Error fetching transaction:', error);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Get BTCPay invoice details
    const invoice = await btcPayService.getInvoice(transaction.btcpay_invoice_id);

    // Generate receipt data
    const receiptData = {
      transactionId: transaction.id,
      date: transaction.created_at,
      completedAt: transaction.completed_at,
      amount: {
        value: invoice.amount,
        currency: invoice.currency
      },
      status: transaction.status,
      package: {
        id: transaction.purchase_intents.package_id,
        coins: transaction.purchase_intents.coins
      },
      payment: {
        method: 'Bitcoin',
        invoiceId: invoice.id,
        paymentLink: invoice.checkoutLink
      },
      user: {
        id: session.user.id,
        email: session.user.email
      }
    };

    return NextResponse.json(receiptData);
  } catch (error) {
    console.error('Receipt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
} 