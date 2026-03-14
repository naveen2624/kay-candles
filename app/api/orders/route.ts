import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name, phone, address, items,
      subtotal, delivery_fee, total,
      payment_method = 'COD',
      payment_id,
      razorpay_order_id,
    } = body;

    if (!customer_name || !phone || !address || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name,
        phone,
        address,
        items,
        subtotal,
        delivery_fee,
        total,
        payment_method,
        payment_id: payment_id ?? null,
        razorpay_order_id: razorpay_order_id ?? null,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
