# 🕯️ Kay Candles and Craft — E-Commerce Website

A modern, luxury e-commerce website for handcrafted candles and pipecleaner flowers, built with Next.js 14, Tailwind CSS, Supabase, and Zustand.

---

## ✨ Features

- **Light pink luxury UI** — elegant fonts (Cormorant Garamond + DM Sans + Playfair Display)
- **Full e-commerce flow** — Home → Category → Product → Cart → Checkout
- **WhatsApp order integration** — Orders sent directly to WhatsApp
- **Server-side delivery calculation** — Weight logic hidden from frontend
- **Supabase backend** — Products, orders, image storage
- **Zustand cart** — Persistent across sessions
- **Product search** — Full-text search across names, descriptions, tags
- **Similar product recommendations** — By category and price range
- **Mobile-first responsive** — Works beautifully on all screen sizes
- **Razorpay-ready** — Placeholder payment structure for easy integration

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Set up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Storage** → Create bucket named `product-images` → Set to **Public**
4. Add a storage policy: Allow public SELECT on `product-images`

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
/app
  /candles          → Candles category page
  /crafts           → Crafts category page
  /product/[id]     → Product detail page
  /cart             → Cart page
  /checkout         → Checkout page
  /search           → Search results page
  /api/delivery     → Server-side delivery calculation
  /api/orders       → Order creation endpoint

/components
  Navbar            → Sticky nav with search + cart icon
  Footer            → Instagram + contact links
  HeroSection       → Homepage hero banner
  CategoryCards     → Category grid cards
  FeaturedProducts  → Product grid on homepage
  NewArrivals       → New products section
  BrandStory        → About/brand section
  ProductCard       → Reusable product card
  CartDrawer        → Slide-in cart panel
  SimilarProducts   → Recommendations section
  SearchBar         → Reusable search input
  ProductDetailClient → Product detail view
  CartPageClient    → Full cart page
  CheckoutPageClient → Checkout form + order placement
  SearchPageClient  → Search results view
  CategoryPageLayout → Shared layout for category pages
  ToastProvider     → Global toast notifications

/lib
  supabase.ts       → Supabase client + all DB queries
  cartStore.ts      → Zustand cart state
  deliveryCalculator.ts → Server-side delivery logic

/utils
  mockData.ts       → Dev fallback data (no Supabase needed)
  whatsappOrder.ts  → WhatsApp message formatter
  cn.ts             → Tailwind className utility

/supabase
  schema.sql        → Complete DB schema + sample data
```

---

## 🚚 Delivery Calculation Logic

The delivery fee is calculated **server-side only** via `/api/delivery`. Product weights are **never exposed to the frontend**.

| Order Total | Delivery |
|-------------|----------|
| Above ₹999  | FREE 🎉  |
| Up to ₹999  | ₹80 per 500g (rounded up) |

**Examples:**
- 700g order → rounded to 1000g → 2 × ₹80 = **₹160**
- 1200g order → rounded to 1500g → 3 × ₹80 = **₹240**

---

## 📦 WhatsApp Order Flow

1. User fills checkout form (name, phone, address)
2. Order saved to Supabase `orders` table
3. WhatsApp message auto-generated with order details
4. User redirected to WhatsApp with pre-filled message to `+91 97871 74450`

---

## 💳 Adding Razorpay (Future)

The checkout is structured for easy Razorpay integration:

```typescript
// In CheckoutPageClient.tsx, replace the COD handler with:

if (form.paymentMethod === 'Razorpay') {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    amount: total * 100, // in paise
    currency: 'INR',
    name: 'Kay Candles and Craft',
    description: 'Handcrafted with love',
    handler: async (response) => {
      // Verify payment on server, then place order
    },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
}
```

---

## 🗄️ Replacing Mock Data with Supabase

The app currently uses `utils/mockData.ts` as fallback. To use real Supabase data:

**In `app/page.tsx`:**
```typescript
// Replace:
const featured = mockProducts.slice(0, 8);
// With:
const featured = await getFeaturedProducts(8);
```

**In `app/candles/page.tsx`:**
```typescript
// Replace:
const products = getMockProductsByCategory('candles');
// With:
const products = await getProducts('candles');
```

Same pattern for `/crafts`, `/product/[id]`, and search.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary color | `blush-400` (#ff6b8a) |
| Background | `blush-50` (#fff5f7) |
| Heading font | Cormorant Garamond |
| Body font | DM Sans |
| Accent font | Playfair Display |
| Border radius | 2xl / 3xl |

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, featured, new arrivals |
| `/candles` | Candles listing with filters |
| `/crafts` | Crafts listing with filters |
| `/product/[id]` | Product detail with reviews |
| `/cart` | Cart with delivery preview |
| `/checkout` | Checkout form + WhatsApp order |
| `/search?q=...` | Search results |

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Storage)
- **Zustand** (cart state, persisted in localStorage)
- **Lucide React** (icons)
- **Google Fonts** (Cormorant Garamond, DM Sans, Playfair Display)
