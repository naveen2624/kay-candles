import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST — create variant
export async function POST(req: NextRequest) {
  try {
    const { product_id, name, image_url, stock, sort_order } = await req.json();

    if (!product_id || !name || !image_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("product_variants")
      .insert([
        {
          product_id,
          name,
          image_url,
          stock: stock ?? 0,
          sort_order: sort_order ?? 99,
          is_out_of_stock: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ variant: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 },
    );
  }
}

// PATCH — update variant
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("product_variants")
      .update(fields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ variant: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update variant" },
      { status: 500 },
    );
  }
}

// DELETE — delete variant
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = getSupabase();
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete variant" },
      { status: 500 },
    );
  }
}
