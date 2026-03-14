import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'candles' | 'crafts';
  weight: number; // in grams — never expose to frontend
  image_url: string;
  tags: string[];
  created_at: string;
  stock?: number;
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
  payment_method: 'COD' | 'Razorpay';
  created_at: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
};

// Product queries
export async function getProducts(category?: string) {
  let query = supabase
    .from('products')
    .select('id, name, description, price, category, image_url, tags, created_at, stock')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, image_url, tags, created_at, stock')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, image_url, tags, created_at, stock')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);

  if (error) throw error;
  return data as Product[];
}

export async function getSimilarProducts(productId: string, category: string, price: number) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, image_url, tags, created_at, stock')
    .eq('category', category)
    .neq('id', productId)
    .gte('price', price * 0.7)
    .lte('price', price * 1.3)
    .limit(4);

  if (error) throw error;
  return data as Product[];
}

export async function getNewArrivals(limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, image_url, tags, created_at, stock')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Product[];
}

export async function getFeaturedProducts(limit = 8) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, image_url, tags, created_at, stock')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Product[];
}

// Get product weight server-side only (never returned to client)
export async function getProductWeight(id: string): Promise<number> {
  const { data, error } = await supabase
    .from('products')
    .select('weight')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data.weight;
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}
