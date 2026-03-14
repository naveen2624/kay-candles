'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { cn } from '@/utils/cn';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/30 backdrop-blur-sm z-[70] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[80] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-blush-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-blush-400" />
            <h2 className="font-accent text-lg font-semibold text-blush-900">
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-blush-100 text-blush-600 text-xs font-body rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-blush-50 hover:bg-blush-100 flex items-center justify-center text-blush-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-blush-50 flex items-center justify-center mb-5">
                <ShoppingBag size={32} className="text-blush-200" />
              </div>
              <h3 className="font-accent text-lg text-blush-700 mb-2">Your cart is empty</h3>
              <p className="font-body text-sm text-blush-400 mb-6 max-w-xs">
                Add some beautiful candles or crafts to get started!
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-blush-400 text-white font-body text-sm rounded-full hover:bg-blush-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-blush-50 rounded-2xl border border-blush-100"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-blush-100">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-body text-sm font-medium text-blush-900 truncate">
                    {item.name}
                  </h4>
                  <p className="font-display text-base font-semibold text-blush-600 mt-0.5">
                    ₹{item.price * item.quantity}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="font-body text-sm text-blush-700 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-7 h-7 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-300 hover:text-red-400 hover:border-red-200 transition-colors shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-blush-100 px-6 py-5 space-y-4 bg-blush-50/50">
            {/* Free delivery notice */}
            {subtotal < 999 && (
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-blush-500">
                  Add ₹{999 - subtotal} more for free delivery!
                </span>
                <div className="flex-1 mx-3 h-1.5 bg-blush-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blush-400 rounded-full transition-all duration-300"
                    style={{ width: `${(subtotal / 999) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= 999 && (
              <p className="text-xs font-body text-green-600 text-center">
                🎉 You qualify for free delivery!
              </p>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-blush-600">Subtotal</span>
              <span className="font-display text-xl font-semibold text-blush-800">₹{subtotal}</span>
            </div>

            {/* CTA buttons */}
            <div className="space-y-2.5">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-xl transition-colors group"
              >
                Checkout
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex items-center justify-center w-full py-3 border border-blush-200 text-blush-600 font-body text-sm rounded-xl hover:bg-blush-50 transition-colors"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
