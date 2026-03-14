import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ----------------------------------------------------------------
// POST /api/razorpay
// Creates a Razorpay order (server-side, key_secret never exposed)
// ----------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json(); // amount in INR (integer)

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;

    // Create order via Razorpay REST API
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Razorpay order creation failed:', err);
      return NextResponse.json({ error: 'Razorpay error' }, { status: 500 });
    }

    const order = await response.json();
    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Razorpay route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------
// PUT /api/razorpay
// Verifies payment signature after successful payment
// ----------------------------------------------------------------
export async function PUT(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json({ verified: false, error: 'Invalid signature' }, { status: 400 });
    }

    return NextResponse.json({ verified: true, payment_id: razorpay_payment_id });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
