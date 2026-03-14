-- ================================================
-- Kay Candles and Craft — Supabase Database Schema
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------
-- PRODUCTS TABLE
-- ------------------------------------------------
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  price       INTEGER NOT NULL,               -- in INR
  category    TEXT NOT NULL CHECK (category IN ('candles', 'crafts')),
  weight      INTEGER NOT NULL,               -- in grams — never expose to frontend!
  image_url   TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  stock       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index on products
CREATE INDEX products_fts_idx ON products
  USING GIN (to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' ')));

-- ------------------------------------------------
-- ORDERS TABLE
-- ------------------------------------------------
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name   TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT NOT NULL,
  items           JSONB NOT NULL,             -- array of {product_id, name, price, quantity, image_url}
  subtotal        INTEGER NOT NULL,
  delivery_fee    INTEGER NOT NULL DEFAULT 0,
  total           INTEGER NOT NULL,
  payment_method  TEXT NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD', 'Razorpay')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------

-- Products: public read, no public write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

CREATE POLICY "Products are insertable by service role only"
  ON products FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Products are updatable by service role only"
  ON products FOR UPDATE USING (auth.role() = 'service_role');

-- Orders: only service role can read/write (for privacy)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders insertable by anyone"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders readable by service role only"
  ON orders FOR SELECT USING (auth.role() = 'service_role');

-- ------------------------------------------------
-- STORAGE
-- ------------------------------------------------
-- Run in Supabase Dashboard > Storage:
-- 1. Create bucket: product-images
-- 2. Set bucket to PUBLIC
-- 3. Add policy: Allow public reads on product-images

-- ------------------------------------------------
-- SAMPLE DATA
-- ------------------------------------------------
INSERT INTO products (name, description, price, category, weight, image_url, tags, stock) VALUES
  ('Rose Petal Soy Candle', 'Hand-poured soy wax candle infused with real rose petals and essential oils. Burns for 40+ hours with a gentle floral fragrance.', 349, 'candles', 250, 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&q=80', ARRAY['rose', 'soy', 'floral', 'luxury', 'gift'], 12),
  ('Vanilla Dream Candle', 'Creamy vanilla and warm sandalwood blend in this luxurious hand-poured candle. Perfect for cozy evenings and self-care rituals.', 299, 'candles', 200, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80', ARRAY['vanilla', 'sandalwood', 'cozy', 'warm', 'soy'], 8),
  ('Lavender & Honey Candle', 'Calming lavender paired with sweet honey notes. This aromatherapy candle promotes relaxation and better sleep.', 379, 'candles', 300, 'https://images.unsplash.com/photo-1608181831718-c9fbe5f36f48?w=600&q=80', ARRAY['lavender', 'honey', 'aromatherapy', 'sleep', 'calming'], 15),
  ('Jasmine Garden Candle', 'Intoxicating jasmine blooms captured in every pour. A romantic and elegant fragrance for your living space.', 329, 'candles', 220, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', ARRAY['jasmine', 'floral', 'romantic', 'elegant'], 20),
  ('Peach Blossom Candle', 'Fresh and fruity peach blossoms with undertones of white musk. A perfect spring fragrance.', 289, 'candles', 180, 'https://images.unsplash.com/photo-1574325485470-ab92efe7b6a3?w=600&q=80', ARRAY['peach', 'fruity', 'spring', 'fresh', 'musk'], 18),
  ('Oud & Rose Luxury Candle', 'Premium oud wood with Bulgarian rose absolute. Our most luxurious fragrance for special occasions.', 599, 'candles', 350, 'https://images.unsplash.com/photo-1565793532057-67988793c06b?w=600&q=80', ARRAY['oud', 'rose', 'luxury', 'premium', 'gift'], 6),
  ('Pink Tulip Pipecleaner Bouquet', 'Handcrafted pink tulip bouquet made with premium pipecleaners. Never wilts, always beautiful.', 249, 'crafts', 80, 'https://images.unsplash.com/photo-1487530811015-780780169c0a?w=600&q=80', ARRAY['tulip', 'pink', 'flowers', 'handmade', 'decor', 'gift'], 25),
  ('Rainbow Rose Pipecleaner Set', 'Set of 6 vibrant rainbow roses, each handcrafted with care. Great for gifting or brightening any space.', 399, 'crafts', 150, 'https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=600&q=80', ARRAY['rose', 'rainbow', 'set', 'handmade', 'colorful'], 14),
  ('White Daisy Pipecleaner Crown', 'Delicate white daisies crafted into a wearable flower crown. Perfect for photoshoots, events, or as wall art.', 299, 'crafts', 60, 'https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?w=600&q=80', ARRAY['daisy', 'white', 'crown', 'wearable', 'photoshoot'], 10),
  ('Sunflower Craft Vase Set', 'Cheerful sunflowers in a decorative mini vase. Handcrafted with love, brings sunshine to any corner.', 449, 'crafts', 200, 'https://images.unsplash.com/photo-1534278931827-8a259344abe7?w=600&q=80', ARRAY['sunflower', 'yellow', 'vase', 'decor', 'cheerful'], 8),
  ('Pink Cherry Blossom Branch', 'Elegant cherry blossom branch with soft pink flowers. A sophisticated piece for home or office decoration.', 349, 'crafts', 100, 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=600&q=80', ARRAY['cherry blossom', 'pink', 'branch', 'elegant', 'japanese'], 12),
  ('Candle & Flowers Gift Set', 'Curated gift set including one rose petal candle and a mini pipecleaner bouquet. Beautifully packaged.', 549, 'crafts', 330, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80', ARRAY['gift', 'set', 'candle', 'flowers', 'bundle', 'special'], 5);
