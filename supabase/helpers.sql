-- ================================================================
-- Kay Candles — Additional SQL Helpers
-- Run after migration.sql
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Function to increment coupon usage count
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_coupon_uses(p_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons SET uses_count = uses_count + 1
  WHERE code = p_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------
-- 2. Seed fragrances into ALL candle products
--    Run AFTER migration.sql and after your products exist.
--    This attaches all 7 fragrances to every candle product.
-- ----------------------------------------------------------------

-- First, get all candle product IDs and fragrance IDs:
-- Then insert into product_fragrances (all available by default)

DO $$
DECLARE
  v_product_id UUID;
  v_fragrance_id UUID;
BEGIN
  FOR v_product_id IN
    SELECT id FROM products WHERE category = 'candles'
  LOOP
    FOR v_fragrance_id IN
      SELECT id FROM fragrances WHERE is_active = TRUE
    LOOP
      INSERT INTO product_fragrances (product_id, fragrance_id, is_available)
      VALUES (v_product_id, v_fragrance_id, TRUE)
      ON CONFLICT (product_id, fragrance_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- ----------------------------------------------------------------
-- 3. Example: Mark a specific fragrance as out of stock for a product
--    Replace the UUIDs with actual values from your DB
-- ----------------------------------------------------------------
-- UPDATE product_fragrances
-- SET is_available = FALSE
-- WHERE product_id = 'your-product-uuid'
--   AND fragrance_id = (SELECT id FROM fragrances WHERE name = 'Berry Blast');

-- ----------------------------------------------------------------
-- 4. Example: Add discount to specific products
-- ----------------------------------------------------------------
-- UPDATE products SET discount_pct = 25, discount_label = 'Spring Sale', discount_desc = 'Extra 25% off on our signature Latte Candles this season!'
-- WHERE name = 'Latte Candle';

-- UPDATE products SET discount_pct = 20, discount_label = 'Floral Fest'
-- WHERE name = 'Peony Bliss';

-- ----------------------------------------------------------------
-- 5. Featured & New Arrivals management
--    Toggle these in Supabase table editor, or use these queries:
-- ----------------------------------------------------------------
-- Mark a product as featured:
-- UPDATE products SET is_featured = TRUE WHERE name = 'Latte Candle';

-- Mark a product as new arrival:
-- UPDATE products SET is_new_arrival = TRUE WHERE name = 'Peony Bliss';

-- Remove from new arrivals:
-- UPDATE products SET is_new_arrival = FALSE WHERE name = 'Vanilla Dream';

-- ----------------------------------------------------------------
-- 6. Manage announcements
-- ----------------------------------------------------------------
-- Add a new announcement:
-- INSERT INTO announcements (text, link, sort_order)
-- VALUES ('🎉 Summer Sale — up to 40% off!', '/candles', 5);

-- Deactivate an announcement:
-- UPDATE announcements SET is_active = FALSE WHERE text LIKE '%Spring%';

-- ----------------------------------------------------------------
-- 7. Add a review directly (admin use)
-- ----------------------------------------------------------------
-- INSERT INTO reviews (product_id, name, rating, comment, is_approved)
-- VALUES (
--   (SELECT id FROM products WHERE name = 'Latte Candle' LIMIT 1),
--   'Priya S.', 5, 'Absolutely love this! The fragrance is incredible and lasts so long.', TRUE
-- );

-- ----------------------------------------------------------------
-- 8. View all orders (admin)
-- ----------------------------------------------------------------
-- SELECT * FROM orders ORDER BY created_at DESC;

-- ----------------------------------------------------------------
-- 9. Fix: ensure orders table has the email column for Resend
-- ----------------------------------------------------------------
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;