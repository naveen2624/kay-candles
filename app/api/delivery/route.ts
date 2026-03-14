import { NextRequest, NextResponse } from 'next/server';
import { calculateDeliveryFee } from '@/lib/deliveryCalculator';
import { createClient } from '@supabase/supabase-js';

// Server-side only Supabase client with service role
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type CartItemPayload = {
  product_id: string;
  quantity: number;
};

// Mock weights for development (when Supabase is not configured)
const mockWeights: Record<string, number> = {
  '1': 250, '2': 200, '3': 300, '4': 220, '5': 180,
  '6': 350, '7': 80, '8': 150, '9': 60, '10': 200,
  '11': 100, '12': 330,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, subtotal }: { items: CartItemPayload[]; subtotal: number } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    let totalWeight = 0;

    // Try to fetch real weights from Supabase, fall back to mock
    try {
      const supabase = getSupabaseAdmin();
      const ids = items.map((i) => i.product_id);
      const { data, error } = await supabase
        .from('products')
        .select('id, weight')
        .in('id', ids);

      if (error || !data) throw new Error('Supabase unavailable');

      for (const item of items) {
        const product = data.find((p: { id: string; weight: number }) => p.id === item.product_id);
        if (product) {
          totalWeight += product.weight * item.quantity;
        }
      }
    } catch {
      // Fallback to mock weights in dev
      for (const item of items) {
        const weight = mockWeights[item.product_id] || 200;
        totalWeight += weight * item.quantity;
      }
    }

    const deliveryFee = calculateDeliveryFee(totalWeight, subtotal);
    const isFreeDelivery = subtotal > 999;

    return NextResponse.json({
      deliveryFee,
      isFreeDelivery,
      // Never expose totalWeight or per-item weights
    });
  } catch (error) {
    console.error('Delivery calculation error:', error);
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}
