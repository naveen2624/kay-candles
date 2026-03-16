// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ----------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  image_url: string;
  stock: number;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "candles" | "crafts";
  weight: number; // server-side only — never render this
  image_url: string;
  tags: string[];
  stock: number;
  has_variants: boolean;
  variants?: ProductVariant[];
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  variant_id?: string;
  name: string;
  variant_name?: string;
  price: number;
  quantity: number;
  image_url: string;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "COD" | "Razorpay";
  payment_id?: string;
  razorpay_order_id?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

// ----------------------------------------------------------------
// SAFE PRODUCT SELECT (no weight exposed to client)
// ----------------------------------------------------------------
// const PRODUCT_SELECT = `
//   id, name, description, price, category,
//   image_url, tags, stock, has_variants, created_at
// `;

const PRODUCT_SELECT_WITH_VARIANTS = `
  id, name, description, price, category,
  image_url, tags, stock, has_variants, created_at,
  product_variants (
    id, product_id, name, image_url, stock, sort_order
  )
`;

// ----------------------------------------------------------------
// QUERIES
// ----------------------------------------------------------------

export async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIANTS)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(normalizeProduct);
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIANTS)
    .eq("id", id)
    .single();

  if (error) throw error;
  return normalizeProduct(data);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIANTS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(normalizeProduct);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIANTS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(normalizeProduct);
}

export async function getSimilarProducts(
  productId: string,
  category: string,
  price: number,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIANTS)
    .eq("category", category)
    .neq("id", productId)
    .gte("price", Math.floor(price * 0.7))
    .lte("price", Math.ceil(price * 1.4))
    .limit(4);

  if (error) throw error;
  return (data ?? []).map(normalizeProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIANTS)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) throw error;

  // Also filter by tags client-side (Supabase array contains is strict)
  const lower = query.toLowerCase();
  return (data ?? [])
    .map(normalizeProduct)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.toLowerCase().includes(lower)),
    );
}

// ----------------------------------------------------------------
// SERVER-SIDE ONLY — weight fetch (API routes only, never client)
// ----------------------------------------------------------------
export async function getProductWeightsForItems(
  items: { product_id: string; quantity: number }[],
): Promise<number> {
  const ids = items.map((i) => i.product_id);
  const { data, error } = await supabase
    .from("products")
    .select("id, weight")
    .in("id", ids);

  if (error || !data) return 200 * items.reduce((s, i) => s + i.quantity, 0);

  return items.reduce((total, item) => {
    const p = data.find(
      (d: { id: string; weight: number }) => d.id === item.product_id,
    );
    return total + (p?.weight ?? 200) * item.quantity;
  }, 0);
}

// ----------------------------------------------------------------
// ORDERS
// ----------------------------------------------------------------
export async function createOrder(
  order: Omit<Order, "id" | "created_at">,
): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// ----------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------
function normalizeProduct(raw: Record<string, unknown>): Product {
  const variants = (raw.product_variants as ProductVariant[] | undefined) ?? [];
  return {
    ...(raw as unknown as Product),
    variants: variants.sort((a, b) => a.sort_order - b.sort_order),
  };
}
