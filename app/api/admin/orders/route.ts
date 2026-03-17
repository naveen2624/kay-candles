import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: NextRequest) {
  try {
    const { order_id, status } = await req.json();

    const validStatuses = [
      "pending",
      "received",
      "making",
      "booked_shipment",
      "dispatched",
      "delivered",
      "cancelled",
    ];

    if (!order_id || !status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order_id or status" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}

// GET /api/admin/orders — get all orders (owner dashboard)
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
