'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag, Heart, ChevronRight, Star,
  Truck, RefreshCw, Shield, AlertCircle,
} from 'lucide-react';
import { Product, ProductVariant } from '@/lib/supabase';
import { useCartStore, cartItemKey } from '@/lib/cartStore';
import { useToast } from './ToastProvider';
import { cn } from '@/utils/cn';

type Props = { product: Product };

const reviews = [
  { name: 'Priya S.', rating: 5, comment: 'Absolutely love this! The fragrance is incredible and lasts so long.', date: '2 days ago' },
  { name: 'Meena R.', rating: 5, comment: 'Ordered as a gift — my friend was delighted. Beautiful packaging too!', date: '1 week ago' },
  { name: 'Ananya K.', rating: 4, comment: 'Great quality handmade product. Will definitely order again.', date: '2 weeks ago' },
];

export default function ProductDetailClient({ product }: Props) {
  const hasVariants = product.has_variants && (product.variants?.length ?? 0) > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [attemptedAdd, setAttemptedAdd] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();

  const displayImage = selectedVariant?.image_url ?? product.image_url;
  const categoryLabel = product.category === 'candles' ? 'Scented Candles' : 'Flowers & Crafts';
  const categoryHref  = product.category === 'candles' ? '/candles' : '/crafts';

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      setAttemptedAdd(true);
      showToast('Please choose a variant first', 'error');
      return;
    }

    const cartEntry = {
      id: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantName: selectedVariant?.name,
      price: product.price,
      image_url: displayImage,
      category: product.category,
    };

    for (let i = 0; i < quantity; i++) addItem(cartEntry);
    showToast(
      `${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} added to cart!`
    );
    openCart();
  };

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
        {/* ── Image panel ── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative h-[480px] rounded-3xl overflow-hidden bg-blush-50 border border-blush-100">
            <Image
              src={displayImage}
              alt={selectedVariant ? `${product.name} – ${selectedVariant.name}` : product.name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {selectedVariant && (
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-blush-100">
                <span className="font-body text-xs text-blush-700 font-medium">
                  {selectedVariant.name}
                </span>
              </div>
            )}
          </div>

          {/* Variant thumbnails (if has_variants) */}
          {hasVariants && (
            <div className="grid grid-cols-5 gap-2">
              {product.variants!.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVariant(v); setAttemptedAdd(false); }}
                  className={cn(
                    'relative h-16 rounded-xl overflow-hidden border-2 transition-all duration-200',
                    selectedVariant?.id === v.id
                      ? 'border-blush-400 scale-105 shadow-md shadow-blush-200'
                      : 'border-blush-100 hover:border-blush-300 opacity-80 hover:opacity-100'
                  )}
                  title={v.name}
                >
                  <Image
                    src={v.image_url}
                    alt={v.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
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

        {/* ── Details panel ── */}
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
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="font-body text-xs text-blush-400">({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-blush-700">
                ₹{product.price}
              </span>
              <span className="font-body text-sm text-blush-400 line-through">
                ₹{Math.round(product.price * 1.2)}
              </span>
              <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-body font-semibold rounded-full">
                Save 17%
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 bg-blush-50/80 border border-blush-100 rounded-2xl">
            <p className="font-body text-sm text-blush-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* ── Variant picker ── */}
          {hasVariants && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-body text-sm text-blush-700 font-semibold">
                  Choose Variant
                  {selectedVariant && (
                    <span className="ml-2 font-normal text-blush-400">— {selectedVariant.name}</span>
                  )}
                </label>
                {attemptedAdd && !selectedVariant && (
                  <span className="flex items-center gap-1 text-xs text-red-500 font-body">
                    <AlertCircle size={12} /> Please select one
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {product.variants!.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVariant(v); setAttemptedAdd(false); }}
                    className={cn(
                      'relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200 group',
                      selectedVariant?.id === v.id
                        ? 'border-blush-400 bg-blush-50 shadow-sm'
                        : attemptedAdd
                          ? 'border-red-200 hover:border-blush-300'
                          : 'border-blush-100 hover:border-blush-300'
                    )}
                  >
                    <div className="relative w-full h-16 rounded-lg overflow-hidden">
                      <Image
                        src={v.image_url}
                        alt={v.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="100px"
                      />
                    </div>
                    <span className={cn(
                      'font-body text-[11px] font-medium text-center leading-tight',
                      selectedVariant?.id === v.id ? 'text-blush-700' : 'text-blush-500'
                    )}>
                      {v.name}
                    </span>
                    {selectedVariant?.id === v.id && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blush-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-[8px]">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                  className="w-8 h-8 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors font-bold text-lg leading-none"
                >
                  −
                </button>
                <span className="w-8 text-center font-body text-blush-800 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors font-bold text-lg leading-none"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-4 text-white font-body font-medium rounded-2xl transition-all duration-200 group',
                  hasVariants && !selectedVariant
                    ? 'bg-blush-300 cursor-pointer hover:bg-blush-400'
                    : 'bg-blush-400 hover:bg-blush-500 hover:shadow-lg hover:shadow-blush-200'
                )}
              >
                <ShoppingBag size={18} />
                {hasVariants && !selectedVariant
                  ? 'Select a Variant First'
                  : `Add to Cart — ₹${product.price * quantity}`}
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
        <h2 className="font-display text-3xl font-light text-blush-900 mb-8">Customer Reviews</h2>
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
