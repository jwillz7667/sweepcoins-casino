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
const PurchaseIntentSchema = z.object({
  packageId: z.string(),
  amount: z.number().positive(),
  currency: z.string(),
});

export async function POST(request: Request) {
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
    const validatedData = PurchaseIntentSchema.parse(body);

    // Create purchase intent record
    const { data: intent, error } = await supabase
      .from('purchase_intents')
      .insert({
        user_id: session.user.id,
        package_id: validatedData.packageId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes expiry
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating purchase intent:', error);
      return NextResponse.json(
        { error: 'Failed to create purchase intent' },
        { status: 500 }
      );
    }

    return NextResponse.json(intent);
  } catch (error) {
    console.error('Purchase intent error:', error);
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