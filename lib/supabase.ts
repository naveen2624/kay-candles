import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ----------------------------------------------------------------
// CONSTANTS
// ----------------------------------------------------------------
export const DEFAULT_DISCOUNT_PCT = 15; // shown on all products minimum

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
  is_out_of_stock: boolean;
};

export type Fragrance = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export type ProductFragrance = {
  fragrance_id: string;
  is_available: boolean;
  fragrance: Fragrance;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "candles" | "crafts";
  weight: number;
  image_url: string;
  tags: string[];
  stock: number;
  has_variants: boolean;
  variants?: ProductVariant[];
  fragrances?: ProductFragrance[];
  created_at: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  discount_pct: number; // additional discount on top of DEFAULT
  discount_label: string | null;
  discount_desc: string | null;
};

export type Coupon = {
  id: string;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  is_active: boolean;
  expires_at: string | null;
  description: string | null;
};

export type Review = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};

export type Announcement = {
  id: string;
  text: string;
  link: string | null;
  is_active: boolean;
  sort_order: number;
};

export type OrderItem = {
  product_id: string;
  variant_id?: string;
  name: string;
  variant_name?: string;
  fragrance_name?: string;
  price: number;
  quantity: number;
  image_url: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amt: number;
  coupon_code?: string;
  total: number;
  payment_method: "COD" | "Razorpay";
  payment_id?: string;
  razorpay_order_id?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

// ----------------------------------------------------------------
// SELECTS
// ----------------------------------------------------------------
const PRODUCT_SELECT_WITH_VARIANTS = `
  id, name, description, price, category,
  image_url, tags, stock, has_variants, created_at,
  is_featured, is_new_arrival, discount_pct, discount_label, discount_desc,
  product_variants (
    id, product_id, name, image_url, stock, sort_order, is_out_of_stock
  ),
  product_fragrances (
    fragrance_id, is_available,
    fragrance:fragrances ( id, name, description, is_active, sort_order )
  )
`;

// ----------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------
function normalizeProduct(raw: Record<string, unknown>): Product {
  const variants = (raw.product_variants as ProductVariant[] | undefined) ?? [];
  const fragrances =
    (raw.product_fragrances as ProductFragrance[] | undefined) ?? [];
  return {
    ...(raw as unknown as Product),
    variants: variants.sort((a, b) => a.sort_order - b.sort_order),
    fragrances: fragrances.sort(
      (a, b) => a.fragrance.sort_order - b.fragrance.sort_order,
    ),
  };
}

// ----------------------------------------------------------------
// PRODUCT QUERIES
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
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(normalizeProduct);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIANTS)
    .eq("is_new_arrival", true)
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
// REVIEWS
// ----------------------------------------------------------------
export async function getReviewsForProduct(
  productId: string,
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Review[];
}

export async function addReview(
  review: Omit<Review, "id" | "created_at" | "is_approved">,
): Promise<void> {
  const { error } = await supabase.from("reviews").insert([review]);
  if (error) throw error;
}

// ----------------------------------------------------------------
// COUPONS
// ----------------------------------------------------------------
export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !data) return null;

  const coupon = data as Coupon;

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return null;
  // Check min order
  if (subtotal < coupon.min_order) return null;
  // Check max uses
  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses)
    return null;

  return coupon;
}

export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
): number {
  if (coupon.discount_type === "flat") return coupon.discount_value;
  return Math.floor((subtotal * coupon.discount_value) / 100);
}

// ----------------------------------------------------------------
// ANNOUNCEMENTS
// ----------------------------------------------------------------
export async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Announcement[];
}

// ----------------------------------------------------------------
// ORDERS
// ----------------------------------------------------------------
export async function getOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber.toUpperCase())
    .single();

  if (error || !data) return null;
  return data as Order;
}

export async function createOrder(
  order: Omit<Order, "id" | "created_at" | "order_number">,
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
// SERVER-SIDE ONLY — weight fetch
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
// DISCOUNT HELPERS
// ----------------------------------------------------------------
export function getTotalDiscountPct(product: Product): number {
  return DEFAULT_DISCOUNT_PCT + (product.discount_pct ?? 0);
}

export function getOriginalPrice(product: Product): number {
  const total = getTotalDiscountPct(product);
  return Math.round(product.price / (1 - total / 100));
}
