import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit } from '@/lib';
import { z } from 'zod';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Validate request body
const PurchaseIntentSchema = z.object({
  packageId: z.string().trim().min(4).max(50),
  amount: z.number().positive().max(1000),
  currency: z.enum(['USD', 'BTC']),
}).transform(data => ({
  ...data,
  packageId: data.packageId.replace(/[^a-zA-Z0-9-_]/g, '')
}));

export async function POST(req: NextRequest) {
  // Proper authentication with role check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.roles?.includes('customer')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Add rate limiting
  const rateLimited = await checkRateLimit(req, 'purchase-intent', 30);
  if (rateLimited) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  // Add input validation
  const body = await req.json();
  const validation = PurchaseIntentSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    // Create purchase intent record
    const { data: intent, error } = await supabase
      .from('purchase_intents')
      .insert({
        user_id: session.user.id,
        package_id: validation.data.packageId,
        amount: validation.data.amount,
        currency: validation.data.currency,
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