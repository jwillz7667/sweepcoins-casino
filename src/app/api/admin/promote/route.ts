import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { email } = await request.json();

    // Check if the requestor is already an admin
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow the first user to promote themselves to admin
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact' });

    const { data: existingAdmins } = await supabase
      .from('users')
      .select('id')
      .eq('is_admin', true);

    // If there are existing admins, only allow admins to promote others
    if (existingAdmins && existingAdmins.length > 0) {
      const { data: requestorData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (!requestorData?.is_admin) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Promote the user to admin
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('email', email);

    if (error) throw error;

    // Log the action
    await supabase.from('audit_logs').insert({
      action: 'user_promoted_to_admin',
      entity_type: 'user',
      entity_id: email,
      user_id: session.user.id,
      details: {
        promoted_email: email,
        promoted_by: session.user.email
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 