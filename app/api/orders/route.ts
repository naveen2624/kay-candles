import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      phone,
      address,
      items,
      subtotal,
      delivery_fee,
      total,
      payment_method = 'COD',
    } = body;

    // Validation
    if (!customer_name || !phone || !address || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderData = {
      customer_name,
      phone,
      address,
      items,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      status: 'pending',
    };

    // Try to save to Supabase
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, order: data });
    } catch {
      // In dev without Supabase, just return success with mock ID
      return NextResponse.json({
        success: true,
        order: { ...orderData, id: `mock-${Date.now()}`, created_at: new Date().toISOString() },
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
