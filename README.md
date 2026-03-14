# 🕯️ Kay Candles and Craft

Modern luxury e-commerce for handcrafted candles and pipecleaner flowers.
**Next.js 15 · Tailwind CSS · Supabase · Zustand · Razorpay**

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The `.env.local` file is pre-configured with your Supabase and Razorpay credentials.

---

## 🗄️ Supabase Setup (one-time)

1. Go to **[supabase.com](https://supabase.com)** → your project → **SQL Editor**
2. Run `supabase/schema.sql` — creates tables + RLS policies
3. Run `supabase/seed.sql` — inserts all products + variants
4. Go to **Storage** → create bucket named `product-images` → set to **Public**

---

## 📦 Product Structure

### Candles — with variants
Products like **Latte Candle** have sub-variants (Strawberry, Coffee, Matcha, Peach).
Each variant has its own image. The parent product holds the shared price.

On the **product page**:
- Customers must choose a variant before adding to cart
- Variant thumbnails are shown in a grid picker
- Cart shows: `Latte Candle (Strawberry Latte)`

### Crafts — no variants
Pipecleaner flowers are shown as standalone products — no variant picker shown.

### Adding new products

**Without variants (crafts / simple candles):**
```sql
INSERT INTO products (name, description, price, category, weight, image_url, tags, stock, has_variants)
VALUES ('My Product', 'Description...', 299, 'crafts', 100, 'https://...', ARRAY['tag1'], 10, false);
```

**With variants (candle collections):**
```sql
WITH p AS (
  INSERT INTO products (..., has_variants) VALUES (..., true) RETURNING id
)
INSERT INTO product_variants (product_id, name, image_url, stock, sort_order)
SELECT id, v.name, v.image_url, v.stock, v.sort_order FROM p,
(VALUES ('Variant 1', 'https://...', 10, 1), ('Variant 2', 'https://...', 10, 2)) AS v(name, image_url, stock, sort_order);
```

---

## 💳 Payment Flows

### Cash on Delivery
1. Customer fills form → clicks "Place Order via WhatsApp"
2. Order saved to `orders` table in Supabase
3. WhatsApp opens with pre-filled order message to `+91 97871 74450`

### Razorpay (UPI / Cards / Net Banking)
1. Customer selects "Online Payment" → clicks "Pay ₹X Securely"
2. `POST /api/razorpay` creates a Razorpay order server-side (key_secret never exposed)
3. Razorpay checkout modal opens (pink themed)
4. On success, `PUT /api/razorpay` verifies the HMAC signature
5. Order saved to Supabase with `payment_id` and `razorpay_order_id`
6. WhatsApp opens to confirm

---

## 🚚 Delivery Calculation

Calculated **server-side only** — product weights never sent to browser.

| Order Total | Rule |
|---|---|
| **Above ₹999** | FREE delivery 🎉 |
| Up to ₹999 | ₹80 per 500g, rounded up |

Examples: 700g → 1000g → ₹160 · 1200g → 1500g → ₹240

---

## 📁 Structure

```
app/
  page.tsx                 → Home (SSR, revalidate 60s)
  candles/page.tsx         → Candles listing
  crafts/page.tsx          → Crafts listing
  product/[id]/page.tsx    → Product detail + variant picker
  cart/page.tsx            → Cart
  checkout/page.tsx        → Checkout + COD + Razorpay
  search/page.tsx          → Search results
  api/delivery/route.ts    → Server-side delivery calc
  api/orders/route.ts      → Save order to Supabase
  api/razorpay/route.ts    → Create + verify Razorpay payment

components/
  ProductCard.tsx          → Shows variant count + thumbnail strip
  ProductDetailClient.tsx  → Full variant image grid picker
  CartDrawer.tsx           → Shows variant name per item
  CartPageClient.tsx       → Full cart with variant names
  CheckoutPageClient.tsx   → COD + live Razorpay

lib/
  supabase.ts              → All DB queries (variants joined)
  cartStore.ts             → Zustand, keyed by productId::variantId
  deliveryCalculator.ts    → Server-side weight → fee logic

supabase/
  schema.sql               → Tables + RLS (run first)
  seed.sql                 → Products + variants (run second)
```

---

## 🔑 Environment Variables

Already set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID    ← safe to expose (publishable)
RAZORPAY_KEY_SECRET            ← server-only, never in client code
```

> ⚠️ Never commit `.env.local` to git. Add it to `.gitignore`.
