import { Product } from '@/lib/supabase';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Rose Petal Soy Candle',
    description: 'Hand-poured soy wax candle infused with real rose petals and essential oils. Burns for 40+ hours with a gentle floral fragrance that fills the room.',
    price: 349,
    category: 'candles',
    weight: 250,
    image_url: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&q=80',
    tags: ['rose', 'soy', 'floral', 'luxury', 'gift'],
    created_at: '2024-01-15T10:00:00Z',
    stock: 12,
  },
  {
    id: '2',
    name: 'Vanilla Dream Candle',
    description: 'Creamy vanilla and warm sandalwood blend in this luxurious hand-poured candle. Perfect for cozy evenings and self-care rituals.',
    price: 299,
    category: 'candles',
    weight: 200,
    image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
    tags: ['vanilla', 'sandalwood', 'cozy', 'warm', 'soy'],
    created_at: '2024-01-14T10:00:00Z',
    stock: 8,
  },
  {
    id: '3',
    name: 'Lavender & Honey Candle',
    description: 'Calming lavender paired with sweet honey notes. This aromatherapy candle promotes relaxation and better sleep.',
    price: 379,
    category: 'candles',
    weight: 300,
    image_url: 'https://images.unsplash.com/photo-1608181831718-c9fbe5f36f48?w=600&q=80',
    tags: ['lavender', 'honey', 'aromatherapy', 'sleep', 'calming'],
    created_at: '2024-01-13T10:00:00Z',
    stock: 15,
  },
  {
    id: '4',
    name: 'Jasmine Garden Candle',
    description: 'Intoxicating jasmine blooms captured in every pour. A romantic and elegant fragrance for your living space.',
    price: 329,
    category: 'candles',
    weight: 220,
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    tags: ['jasmine', 'floral', 'romantic', 'elegant'],
    created_at: '2024-01-12T10:00:00Z',
    stock: 20,
  },
  {
    id: '5',
    name: 'Peach Blossom Candle',
    description: 'Fresh and fruity peach blossoms with undertones of white musk. A perfect spring fragrance.',
    price: 289,
    category: 'candles',
    weight: 180,
    image_url: 'https://images.unsplash.com/photo-1574325485470-ab92efe7b6a3?w=600&q=80',
    tags: ['peach', 'fruity', 'spring', 'fresh', 'musk'],
    created_at: '2024-01-11T10:00:00Z',
    stock: 18,
  },
  {
    id: '6',
    name: 'Oud & Rose Luxury Candle',
    description: 'Premium oud wood with Bulgarian rose absolute. Our most luxurious fragrance for special occasions.',
    price: 599,
    category: 'candles',
    weight: 350,
    image_url: 'https://images.unsplash.com/photo-1565793532057-67988793c06b?w=600&q=80',
    tags: ['oud', 'rose', 'luxury', 'premium', 'gift'],
    created_at: '2024-01-10T10:00:00Z',
    stock: 6,
  },
  {
    id: '7',
    name: 'Pink Tulip Pipecleaner Bouquet',
    description: 'Handcrafted pink tulip bouquet made with premium pipecleaners. Never wilts, always beautiful. Perfect as home decor or a unique gift.',
    price: 249,
    category: 'crafts',
    weight: 80,
    image_url: 'https://images.unsplash.com/photo-1487530811015-780780169c0a?w=600&q=80',
    tags: ['tulip', 'pink', 'flowers', 'handmade', 'decor', 'gift'],
    created_at: '2024-01-09T10:00:00Z',
    stock: 25,
  },
  {
    id: '8',
    name: 'Rainbow Rose Pipecleaner Set',
    description: 'Set of 6 vibrant rainbow roses, each handcrafted with care. Great for gifting or brightening any space.',
    price: 399,
    category: 'crafts',
    weight: 150,
    image_url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=600&q=80',
    tags: ['rose', 'rainbow', 'set', 'handmade', 'colorful'],
    created_at: '2024-01-08T10:00:00Z',
    stock: 14,
  },
  {
    id: '9',
    name: 'White Daisy Pipecleaner Crown',
    description: 'Delicate white daisies crafted into a wearable flower crown. Perfect for photoshoots, events, or as wall art.',
    price: 299,
    category: 'crafts',
    weight: 60,
    image_url: 'https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?w=600&q=80',
    tags: ['daisy', 'white', 'crown', 'wearable', 'photoshoot'],
    created_at: '2024-01-07T10:00:00Z',
    stock: 10,
  },
  {
    id: '10',
    name: 'Sunflower Craft Vase Set',
    description: 'Cheerful sunflowers in a decorative mini vase. Handcrafted with love, brings sunshine to any corner.',
    price: 449,
    category: 'crafts',
    weight: 200,
    image_url: 'https://images.unsplash.com/photo-1534278931827-8a259344abe7?w=600&q=80',
    tags: ['sunflower', 'yellow', 'vase', 'decor', 'cheerful'],
    created_at: '2024-01-06T10:00:00Z',
    stock: 8,
  },
  {
    id: '11',
    name: 'Pink Cherry Blossom Branch',
    description: 'Elegant cherry blossom branch with soft pink flowers. A sophisticated piece for home or office decoration.',
    price: 349,
    category: 'crafts',
    weight: 100,
    image_url: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=600&q=80',
    tags: ['cherry blossom', 'pink', 'branch', 'elegant', 'japanese'],
    created_at: '2024-01-05T10:00:00Z',
    stock: 12,
  },
  {
    id: '12',
    name: 'Candle & Flowers Gift Set',
    description: 'Curated gift set including one rose petal candle and a mini pipecleaner bouquet. Beautifully packaged for any occasion.',
    price: 549,
    category: 'crafts',
    weight: 330,
    image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
    tags: ['gift', 'set', 'candle', 'flowers', 'bundle', 'special'],
    created_at: '2024-01-04T10:00:00Z',
    stock: 5,
  },
];

export function getMockProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getMockProductsByCategory(category: string): Product[] {
  return mockProducts.filter((p) => p.category === category);
}

export function searchMockProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getMockSimilarProducts(
  productId: string,
  category: string,
  price: number
): Product[] {
  return mockProducts
    .filter(
      (p) =>
        p.id !== productId &&
        p.category === category &&
        p.price >= price * 0.7 &&
        p.price <= price * 1.3
    )
    .slice(0, 4);
}
