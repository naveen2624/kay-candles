-- ================================================================
-- Kay Candles and Craft — Full Schema (Run in Supabase SQL Editor)
-- ================================================================
-- If tables already exist, drop first:
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS product_variants CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- ================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- PRODUCTS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  price        INTEGER NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('candles', 'crafts')),
  weight       INTEGER NOT NULL,
  image_url    TEXT NOT NULL,
  tags         TEXT[] DEFAULT '{}',
  stock        INTEGER DEFAULT 0,
  has_variants BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- PRODUCT VARIANTS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  stock       INTEGER DEFAULT 0,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx
  ON product_variants(product_id);

-- ----------------------------------------------------------------
-- ORDERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name  TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address        TEXT NOT NULL,
  items          JSONB NOT NULL,
  subtotal       INTEGER NOT NULL,
  delivery_fee   INTEGER NOT NULL DEFAULT 0,
  total          INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'COD'
                   CHECK (payment_method IN ('COD', 'Razorpay')),
  payment_id     TEXT,
  razorpay_order_id TEXT,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read"  ON products;
CREATE POLICY "products_public_read"  ON products  FOR SELECT USING (true);

DROP POLICY IF EXISTS "variants_public_read"  ON product_variants;
CREATE POLICY "variants_public_read"  ON product_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "orders_public_insert"  ON orders;
CREATE POLICY "orders_public_insert"  ON orders    FOR INSERT WITH CHECK (true);

