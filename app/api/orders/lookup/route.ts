// app/api/orders/lookup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("order_number")?.trim() ?? "";
  const q = raw.toUpperCase();

  if (!q) {
    return NextResponse.json(
      { error: "order_number is required" },
      { status: 400 },
    );
  }

  const supabase = getSupabase();

  // 1. Exact match
  const { data: e1 } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", q)
    .maybeSingle();
  if (e1) return NextResponse.json({ order: e1 });

  // 2. Case-insensitive exact
  const { data: e2 } = await supabase
    .from("orders")
    .select("*")
    .ilike("order_number", q)
    .maybeSingle();
  if (e2) return NextResponse.json({ order: e2 });

  // 3. Suffix match — last segment after final hyphen
  const suffix = q.split("-").pop() ?? "";
  if (suffix.length >= 4) {
    const { data: e3 } = await supabase
      .from("orders")
      .select("*")
      .ilike("order_number", `%-${suffix}`)
      .maybeSingle();
    if (e3) return NextResponse.json({ order: e3 });
  }

  // 4. Any substring match (most flexible)
  if (q.length >= 4) {
    const { data: rows } = await supabase
      .from("orders")
      .select("*")
      .ilike("order_number", `%${q}%`);
    if (rows && rows.length === 1) return NextResponse.json({ order: rows[0] });
    if (rows && rows.length > 1) {
      // Multiple matches — return most recent
      const sorted = rows.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      return NextResponse.json({ order: sorted[0] });
    }
  }

  return NextResponse.json(
    { error: "Order not found", searched: q },
    { status: 404 },
  );
}
