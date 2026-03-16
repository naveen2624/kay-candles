import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST /api/coupon — validates a coupon code server-side
export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json(
        { valid: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return NextResponse.json({
        valid: false,
        error: "Coupon not found or inactive.",
      });
    }

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: "This coupon has expired.",
      });
    }

    // Check min order
    if (subtotal < data.min_order) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of ₹${data.min_order} required for this coupon.`,
      });
    }

    // Check max uses
    if (data.max_uses !== null && data.uses_count >= data.max_uses) {
      return NextResponse.json({
        valid: false,
        error: "This coupon has reached its usage limit.",
      });
    }

    // Calculate discount
    const discountAmt =
      data.discount_type === "flat"
        ? data.discount_value
        : Math.floor((subtotal * data.discount_value) / 100);

    return NextResponse.json({
      valid: true,
      coupon: data,
      discountAmt,
    });
  } catch (err) {
    console.error("Coupon validation error:", err);
    return NextResponse.json(
      { valid: false, error: "Server error." },
      { status: 500 },
    );
  }
}
