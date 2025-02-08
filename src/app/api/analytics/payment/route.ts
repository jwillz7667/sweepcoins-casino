import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get URL parameters for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get('endDate') || new Date().toISOString();

    // Get total transactions and volume
    const { data: totals, error: totalsError } = await supabase
      .from('transactions')
      .select('amount, status')
      .eq('user_id', session.user.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (totalsError) {
      console.error('Error fetching totals:', totalsError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    const totalTransactions = totals.length;
    const completedTransactions = totals.filter(t => t.status === 'completed');
    const totalVolume = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions > 0 
      ? (completedTransactions.length / totalTransactions) * 100 
      : 0;

    // Get daily transaction volume
    const { data: dailyVolume, error: dailyError } = await supabase
      .rpc('get_daily_transaction_volume', {
        user_id_param: session.user.id,
        start_date_param: startDate,
        end_date_param: endDate
      });

    if (dailyError) {
      console.error('Error fetching daily volume:', dailyError);
      // Continue with other metrics
    }

    // Get refund statistics
    const { data: refunds, error: refundsError } = await supabase
      .from('refunds')
      .select('amount, status')
      .eq('user_id', session.user.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (refundsError) {
      console.error('Error fetching refunds:', refundsError);
      // Continue with other metrics
    }

    const totalRefunds = refunds?.length || 0;
    const refundedAmount = refunds?.reduce((sum, r) => sum + r.amount, 0) || 0;
    const refundRate = totalTransactions > 0 
      ? (totalRefunds / totalTransactions) * 100 
      : 0;

    // Get package popularity
    const { data: packages, error: packagesError } = await supabase
      .rpc('get_package_stats', {
        user_id_param: session.user.id,
        start_date_param: startDate,
        end_date_param: endDate
      });

    if (packagesError) {
      console.error('Error fetching package stats:', packagesError);
      // Continue with other metrics
    }

    return NextResponse.json({
      overview: {
        totalTransactions,
        totalVolume,
        successRate,
        averageTransactionValue: totalTransactions > 0 
          ? totalVolume / totalTransactions 
          : 0
      },
      refunds: {
        totalRefunds,
        refundedAmount,
        refundRate
      },
      trends: {
        dailyVolume: dailyVolume || [],
        popularPackages: packages || []
      },
      dateRange: {
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 