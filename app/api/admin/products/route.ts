import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const PRODUCT_SELECT = `
  id, name, description, price, category, weight, image_url,
  tags, stock, has_variants, is_featured, is_new_arrival,
  discount_pct, discount_label, discount_desc, created_at,
  product_variants (
    id, product_id, name, image_url, stock, sort_order, is_out_of_stock
  ),
  product_fragrances (
    fragrance_id, is_available,
    fragrance:fragrances ( id, name, description, is_active, sort_order )
  )
`;

// GET — all products
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const products = (data ?? []).map((p: Record<string, unknown>) => ({
      ...p,
      product_variants: ((p.product_variants as (typeof p)[]) ?? []).sort(
        (a: Record<string, unknown>, b: Record<string, unknown>) =>
          (a.sort_order as number) - (b.sort_order as number),
      ),
    }));

    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST — create product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      category,
      weight,
      image_url,
      tags,
      stock,
      has_variants,
      is_featured,
      is_new_arrival,
      discount_pct,
      discount_label,
      discount_desc,
    } = body;

    if (!name || !description || !image_url || price == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price,
          category: category ?? "candles",
          weight: weight ?? 200,
          image_url,
          tags: tags ?? [],
          stock: stock ?? 0,
          has_variants: has_variants ?? false,
          is_featured: is_featured ?? false,
          is_new_arrival: is_new_arrival ?? false,
          discount_pct: discount_pct ?? 0,
          discount_label: discount_label || null,
          discount_desc: discount_desc || null,
        },
      ])
      .select(PRODUCT_SELECT)
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

// PATCH — update product fields
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Clean up empty strings to null
    if ("discount_label" in fields && fields.discount_label === "")
      fields.discount_label = null;
    if ("discount_desc" in fields && fields.discount_desc === "")
      fields.discount_desc = null;

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .update(fields)
      .eq("id", id)
      .select(PRODUCT_SELECT)
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE — delete product
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = getSupabase();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
