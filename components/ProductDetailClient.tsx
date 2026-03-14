'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ChevronRight, Star, Truck, RefreshCw, Shield } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from './ToastProvider';

type Props = { product: Product };

const reviews = [
  { name: 'Priya S.', rating: 5, comment: 'Absolutely love this candle! The fragrance is incredible and lasts so long.', date: '2 days ago' },
  { name: 'Meena R.', rating: 5, comment: 'Ordered as a gift — my friend was delighted. Beautiful packaging too!', date: '1 week ago' },
  { name: 'Ananya K.', rating: 4, comment: 'Great quality handmade product. Will definitely order again.', date: '2 weeks ago' },
];

export default function ProductDetailClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
      });
    }
    showToast(`${product.name} added to cart!`);
    openCart();
  };

  const categoryLabel = product.category === 'candles' ? 'Scented Candles' : 'Flowers & Crafts';
  const categoryHref = product.category === 'candles' ? '/candles' : '/crafts';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-xs font-body text-blush-400">
        <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href={categoryHref} className="hover:text-blush-600 transition-colors">{categoryLabel}</Link>
        <ChevronRight size={12} />
        <span className="text-blush-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative h-[500px] rounded-3xl overflow-hidden bg-blush-50 border border-blush-100">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Tag chips */}
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blush-50 border border-blush-100 text-blush-500 text-xs font-body rounded-full capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="font-body text-xs text-blush-400 uppercase tracking-[0.2em] mb-2">
              {categoryLabel}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-light text-blush-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="font-body text-xs text-blush-400">({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-blush-700">₹{product.price}</span>
              <span className="font-body text-sm text-blush-400 line-through">₹{Math.round(product.price * 1.2)}</span>
              <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-body font-semibold rounded-full">
                Save {Math.round(((product.price * 0.2) / (product.price * 1.2)) * 100)}%
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 bg-blush-50/80 border border-blush-100 rounded-2xl">
            <p className="font-body text-sm text-blush-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Delivery notice */}
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
            <Truck size={16} className="text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-xs font-semibold text-green-700">
                {product.price >= 999 ? 'Free delivery on this order!' : 'Free delivery above ₹999'}
              </p>
              <p className="font-body text-[11px] text-green-600 mt-0.5">
                Delivered within 3–5 business days
              </p>
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="font-body text-sm text-blush-600 font-medium">Quantity</label>
              <div className="flex items-center gap-3 bg-blush-50 border border-blush-200 rounded-full px-1 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors font-bold"
                >
                  −
                </button>
                <span className="w-8 text-center font-body text-blush-800 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-blush-200 group"
              >
                <ShoppingBag size={18} />
                Add to Cart — ₹{product.price * quantity}
              </button>
              <button className="w-14 h-14 border border-blush-200 rounded-2xl flex items-center justify-center text-blush-300 hover:text-blush-500 hover:border-blush-300 hover:bg-blush-50 transition-all">
                <Heart size={18} />
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: 'Fast Delivery' },
              { icon: RefreshCw, label: 'Easy Returns' },
              { icon: Shield, label: 'Secure Order' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-1.5 p-3 bg-blush-50 rounded-xl border border-blush-100"
              >
                <badge.icon size={16} className="text-blush-400" />
                <span className="font-body text-[10px] text-blush-500 text-center">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="font-display text-3xl font-light text-blush-900 mb-8">
          Customer Reviews
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-blush-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-body text-sm font-semibold text-blush-800">{review.name}</p>
                  <p className="font-body text-[11px] text-blush-400">{review.date}</p>
                </div>
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, s) => (
                    <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="font-body text-sm text-blush-600 leading-relaxed italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
