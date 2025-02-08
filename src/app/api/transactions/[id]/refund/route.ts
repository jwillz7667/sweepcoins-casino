import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Validate request body
const RefundRequestSchema = z.object({
  reason: z.string().min(1).max(500),
  amount: z.number().optional(), // Optional for partial refunds
});

export async function POST(
  request: Request,
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = RefundRequestSchema.parse(body);

    // Fetch transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*, purchase_intents(*)')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check if transaction is eligible for refund
    if (transaction.status !== 'completed') {
      return NextResponse.json(
        { error: 'Transaction is not eligible for refund' },
        { status: 400 }
      );
    }

    // Check if transaction is already refunded
    if (transaction.refund_status === 'refunded') {
      return NextResponse.json(
        { error: 'Transaction is already refunded' },
        { status: 400 }
      );
    }

    // Create refund record
    const { data: refund, error: refundError } = await supabase
      .from('refunds')
      .insert({
        transaction_id: transaction.id,
        user_id: session.user.id,
        amount: validatedData.amount || transaction.amount,
        reason: validatedData.reason,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (refundError) {
      console.error('Error creating refund record:', refundError);
      return NextResponse.json(
        { error: 'Failed to create refund' },
        { status: 500 }
      );
    }

    // Update transaction refund status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        refund_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      );
    }

    // Deduct coins from user's balance
    const { error: balanceError } = await supabase
      .rpc('deduct_user_coins', {
        user_id_param: session.user.id,
        coins_amount: transaction.purchase_intents.coins
      });

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      // Don't return error here, continue with refund process
    }

    return NextResponse.json({
      message: 'Refund request submitted successfully',
      refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 