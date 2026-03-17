import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET — all fragrances
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("fragrances")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ fragrances: data ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch fragrances" },
      { status: 500 },
    );
  }
}

// PATCH — toggle fragrance availability for a product
export async function PATCH(req: NextRequest) {
  try {
    const { product_id, fragrance_id, is_available } = await req.json();

    if (!product_id || !fragrance_id || is_available == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Upsert — in case the row doesn't exist yet
    const { error } = await supabase
      .from("product_fragrances")
      .upsert([{ product_id, fragrance_id, is_available }], {
        onConflict: "product_id,fragrance_id",
      });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update fragrance availability" },
      { status: 500 },
    );
  }
}

// POST — add a new master fragrance
export async function POST(req: NextRequest) {
  try {
    const { name, description, sort_order } = await req.json();
    if (!name)
      return NextResponse.json({ error: "Name required" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("fragrances")
      .insert([
        {
          name,
          description: description || null,
          sort_order: sort_order ?? 99,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ fragrance: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create fragrance" },
      { status: 500 },
    );
  }
}
