// components/CartPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
} from "lucide-react";
import { useCartStore, cartItemKey } from "@/lib/cartStore";
import { useRouter } from "next/navigation";

export default function CartPageClient() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore();
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const subtotal = getSubtotal();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) return;
    setIsLoading(true);
    fetch("/api/delivery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        subtotal,
      }),
    })
      .then((r) => r.json())
      .then((d) => setDeliveryFee(d.deliveryFee ?? 0))
      .catch(() => setDeliveryFee(subtotal > 999 ? 0 : 80))
      .finally(() => setIsLoading(false));
  }, [items, subtotal]);

  const total = subtotal + (deliveryFee ?? 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 bg-blush-50">
        <div className="w-24 h-24 rounded-full bg-blush-100 flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-blush-300" />
        </div>
        <h1 className="font-display text-4xl font-light text-blush-800 mb-3">
          Your cart is empty
        </h1>
        <p className="font-body text-blush-500 mb-8 text-center max-w-sm">
          Looks like you haven&apos;t added anything yet. Explore our
          handcrafted collection!
        </p>
        <Link
          href="/candles"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blush-400 text-white font-body font-medium rounded-full hover:bg-blush-500 transition-colors"
        >
          Shop Now <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-light text-blush-900">
              Your Cart
            </h1>
            <p className="font-body text-sm text-blush-400 mt-1">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 font-body text-sm text-blush-500 hover:text-blush-700 transition-colors"
          >
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const key = cartItemKey(item);
              return (
                <div
                  key={key}
                  className="flex gap-5 p-5 bg-white rounded-2xl border border-blush-100"
                >
                  {/* Image */}
                  <Link href={`/product/${item.id}`}>
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-blush-50 shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-accent text-base font-medium text-blush-900 hover:text-blush-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    {item.variantName && (
                      <p className="font-body text-xs text-blush-500 mt-0.5 font-medium">
                        {item.variantName}
                      </p>
                    )}
                    <p className="font-body text-xs text-blush-400 mt-0.5 capitalize">
                      {item.category === "candles"
                        ? "Scented Candle"
                        : "Handcraft"}
                    </p>
                    <p className="font-display text-xl font-semibold text-blush-700 mt-2">
                      ₹{item.price * item.quantity}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2 bg-blush-50 border border-blush-100 rounded-full px-1.5 py-1">
                        <button
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center font-body text-sm text-blush-800 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(key)}
                        className="flex items-center gap-1.5 text-xs font-body text-blush-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-xs font-body text-blush-300 hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={12} /> Clear cart
            </button>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-blush-100 p-6 space-y-4">
              <h2 className="font-accent text-lg font-semibold text-blush-900">
                Order Summary
              </h2>

              {/* Coupon placeholder */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-blush-50 border border-blush-100 rounded-xl">
                  <Tag size={13} className="text-blush-300" />
                  <input
                    placeholder="Coupon code"
                    className="flex-1 bg-transparent font-body text-xs text-blush-600 placeholder-blush-300 focus:outline-none"
                  />
                </div>
                <button className="px-3 py-2.5 border border-blush-200 text-blush-500 font-body text-xs rounded-xl hover:bg-blush-50 transition-colors">
                  Apply
                </button>
              </div>

              <div className="space-y-3 border-t border-blush-50 pt-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-blush-500">Subtotal</span>
                  <span className="text-blush-800 font-medium">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-blush-500">Delivery</span>
                  <span className="text-blush-800 font-medium">
                    {isLoading ? (
                      <span className="shimmer inline-block w-12 h-4 rounded" />
                    ) : deliveryFee === 0 ? (
                      <span className="text-green-600">FREE 🎉</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {subtotal < 999 && deliveryFee !== null && deliveryFee > 0 && (
                  <p className="text-[11px] font-body text-blush-400 bg-blush-50 rounded-lg px-3 py-2">
                    Add ₹{999 - subtotal} more for free delivery!
                  </p>
                )}
              </div>

              <div className="flex justify-between font-body border-t border-blush-100 pt-4">
                <span className="text-blush-700 font-semibold">Total</span>
                <span className="font-display text-2xl font-semibold text-blush-700">
                  ₹{isLoading ? "..." : total}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-blush-200 group"
              >
                Proceed to Checkout
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            <p className="text-center font-body text-xs text-blush-400">
              Secure checkout · COD · Razorpay UPI &amp; Cards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
