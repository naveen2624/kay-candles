-- ================================================================
-- Kay Candles and Craft — Seed Data
-- Run AFTER schema.sql
-- ================================================================
-- Step 1: Run schema.sql first
-- Step 2: Run this file — it inserts products and variants
-- ================================================================

-- ---- Insert products and capture their IDs ----

-- Latte Candle (has variants)
WITH latte AS (
  INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
  VALUES (
    'Latte Candle',
    'Our signature latte candle collection — hand-poured soy wax infused with cozy café-inspired fragrances. Each scent is a warm hug in a jar, perfect for slow mornings and cozy evenings.',
    349, 'candles', 220,
    'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800&q=80',
    ARRAY['latte','cozy','soy','café','warm','bestseller'],
    40, true
  ) RETURNING id
)
INSERT INTO product_variants (product_id, name, image_url, stock, sort_order)
SELECT id, v.name, v.image_url, v.stock, v.sort_order FROM latte,
(VALUES
  ('Strawberry Latte', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80', 10, 1),
  ('Coffee Latte',     'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', 10, 2),
  ('Matcha Latte',     'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80', 10, 3),
  ('Peach Latte',      'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&q=80',  10, 4)
) AS v(name, image_url, stock, sort_order);

-- Peony Bliss (has variants)
WITH peony AS (
  INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
  VALUES (
    'Peony Bliss',
    'A luxurious floral candle available in a spectrum of beautiful colors. Each shade carries the same heavenly peony fragrance — choose the one that matches your aesthetic.',
    399, 'candles', 250,
    'https://images.unsplash.com/photo-1608181831718-c9fbe5f36f48?w=800&q=80',
    ARRAY['peony','floral','luxury','gift','romantic'],
    48, true
  ) RETURNING id
)
INSERT INTO product_variants (product_id, name, image_url, stock, sort_order)
SELECT id, v.name, v.image_url, v.stock, v.sort_order FROM peony,
(VALUES
  ('Blue',   'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80', 8, 1),
  ('Red',    'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&q=80',   8, 2),
  ('White',  'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&q=80', 8, 3),
  ('Purple', 'https://images.unsplash.com/photo-1550159930-40066082a4fc?w=600&q=80',   8, 4),
  ('Pink',   'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80', 8, 5),
  ('Brown',  'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&q=80', 8, 6)
) AS v(name, image_url, stock, sort_order);

-- Vanilla Dream (no variants)
INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
VALUES (
  'Vanilla Dream',
  'Creamy vanilla and warm sandalwood melt together in this best-selling candle. Burns for 45+ hours with a rich, comforting fragrance that fills any room.',
  299, 'candles', 200,
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
  ARRAY['vanilla','sandalwood','cozy','classic'], 20, false
);

-- Jasmine Garden (no variants)
INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
VALUES (
  'Jasmine Garden',
  'Intoxicating jasmine blooms captured in every pour. A romantic and elegant fragrance for your living space.',
  329, 'candles', 220,
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  ARRAY['jasmine','floral','romantic','elegant'], 18, false
);

-- Oud & Rose Luxury (no variants)
INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
VALUES (
  'Oud & Rose Luxury',
  'Premium oud wood with Bulgarian rose absolute. Our most luxurious fragrance for special occasions.',
  599, 'candles', 350,
  'https://images.unsplash.com/photo-1565793532057-67988793c06b?w=800&q=80',
  ARRAY['oud','rose','luxury','premium','gift'], 6, false
);

-- Lavender & Honey (no variants)
INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
VALUES (
  'Lavender & Honey',
  'Calming lavender paired with sweet honey notes. This aromatherapy candle promotes relaxation and better sleep.',
  379, 'candles', 300,
  'https://images.unsplash.com/photo-1608181831718-c9fbe5f36f48?w=800&q=80',
  ARRAY['lavender','honey','aromatherapy','sleep','calming'], 15, false
);

-- ---- CRAFTS (no variants) ----
INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
VALUES
  ('Pink Tulip Bouquet',
   'Handcrafted pink tulip bouquet made with premium pipecleaners. Never wilts, always beautiful. Perfect as home decor or a heartfelt gift.',
   249, 'crafts', 80,
   'https://images.unsplash.com/photo-1487530811015-780780169c0a?w=800&q=80',
   ARRAY['tulip','pink','flowers','handmade','decor','gift'], 25, false),

  ('Rainbow Rose Set',
   'Set of 6 vibrant rainbow roses, each handcrafted with care. Great for gifting or brightening any space.',
   399, 'crafts', 150,
   'https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=800&q=80',
   ARRAY['rose','rainbow','set','handmade','colorful'], 14, false),

  ('Daisy Flower Crown',
   'Delicate white daisies crafted into a wearable flower crown. Perfect for photoshoots, events, or as wall art.',
   299, 'crafts', 60,
   'https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?w=800&q=80',
   ARRAY['daisy','white','crown','wearable','photoshoot'], 10, false),

  ('Sunflower Vase Set',
   'Cheerful sunflowers in a decorative mini vase. Brings sunshine to any corner of your home.',
   449, 'crafts', 200,
   'https://images.unsplash.com/photo-1534278931827-8a259344abe7?w=800&q=80',
   ARRAY['sunflower','yellow','vase','decor','cheerful'], 8, false),

  ('Cherry Blossom Branch',
   'Elegant cherry blossom branch with soft pink pipecleaner flowers. A sophisticated piece for home or office.',
   349, 'crafts', 100,
   'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&q=80',
   ARRAY['cherry blossom','pink','branch','elegant'], 12, false),

  ('Candle & Flowers Gift Set',
   'Curated gift set with a rose candle and mini pipecleaner bouquet. Beautifully packaged for any occasion.',
   549, 'crafts', 330,
   'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
   ARRAY['gift','set','candle','flowers','bundle'], 5, false);
