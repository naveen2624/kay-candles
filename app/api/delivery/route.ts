import { NextRequest, NextResponse } from 'next/server';
import { calculateDeliveryFee } from '@/lib/deliveryCalculator';
import { getProductWeightsForItems } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { items, subtotal } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    const totalWeight = await getProductWeightsForItems(items);
    const deliveryFee = calculateDeliveryFee(totalWeight, subtotal);

    return NextResponse.json({
      deliveryFee,
      isFreeDelivery: subtotal > 999,
      // weight intentionally omitted
    });
  } catch (error) {
    console.error('Delivery calculation error:', error);
    return NextResponse.json({ deliveryFee: 80, isFreeDelivery: false });
  }
}
