"use client";

import { useState } from "react";
import {
  Search,
  Package,
  CheckCircle,
  Truck,
  Clock,
  X,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getOrderByNumber, Order } from "@/lib/supabase";
import { cn } from "@/utils/cn";

const STATUS_CONFIG = {
  pending: {
    label: "Order Received",
    icon: Clock,
    color: "text-amber-500 bg-amber-50 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-blue-500 bg-blue-50 border-blue-200",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-500 bg-purple-50 border-purple-200",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-500 bg-green-50 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: X,
    color: "text-red-500 bg-red-50 border-red-200",
  },
};

export default function OrdersPageClient() {
  const [orderInput, setOrderInput] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);
    try {
      const result = await getOrderByNumber(orderInput.trim());
      if (!result)
        setError(
          "No order found with that number. Please check and try again.",
        );
      else setOrder(result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const status = order ? STATUS_CONFIG[order.status] : null;
  const StatusIcon = status?.icon ?? Clock;

  return (
    <div className="min-h-screen bg-blush-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-blush-100 flex items-center justify-center mx-auto mb-5">
            <Package size={28} className="text-blush-400" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-blush-900 mb-3">
            Track Your Order
          </h1>
          <p className="font-body text-sm text-blush-500 max-w-sm mx-auto">
            Enter your order number to see the latest status of your Kay Candles
            order.
          </p>
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl border border-blush-100 p-6 mb-6"
        >
          <label className="font-body text-xs text-blush-600 font-medium block mb-3">
            Order Number (e.g. KCC-20260315-ABC123)
          </label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-blush-50 border border-blush-200 rounded-xl focus-within:ring-2 focus-within:ring-blush-300 transition-all">
              <Search size={16} className="text-blush-300 shrink-0" />
              <input
                value={orderInput}
                onChange={(e) => {
                  setOrderInput(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="KCC-YYYYMMDD-XXXXXX"
                className="flex-1 bg-transparent font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none uppercase tracking-wide"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderInput.trim()}
              className="px-5 py-3 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-xl transition-colors disabled:bg-blush-200 flex items-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
          {error && (
            <p className="font-body text-xs text-red-500 mt-3 flex items-center gap-1.5">
              <X size={12} /> {error}
            </p>
          )}
        </form>

        {/* Order result */}
        {order && status && (
          <div className="bg-white rounded-2xl border border-blush-100 overflow-hidden animate-fade-up">
            {/* Status header */}
            <div
              className={cn(
                "px-6 py-5 border-b flex items-center gap-4",
                status.color.split(" ")[1],
                `border-${status.color.split(" ")[2]?.replace("border-", "")}`,
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                  status.color,
                )}
              >
                <StatusIcon size={22} />
              </div>
              <div>
                <p className="font-body text-xs text-blush-400 uppercase tracking-widest mb-0.5">
                  Order Status
                </p>
                <p
                  className={cn(
                    "font-accent text-xl font-semibold",
                    status.color.split(" ")[0],
                  )}
                >
                  {status.label}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-body text-xs text-blush-400">Order Number</p>
                <p className="font-accent text-sm font-bold text-blush-700">
                  {order.order_number}
                </p>
              </div>
            </div>

            {/* Order details */}
            <div className="p-6 space-y-5">
              {/* Customer info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blush-50 rounded-xl">
                  <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-1">
                    Customer
                  </p>
                  <p className="font-body text-sm font-semibold text-blush-800">
                    {order.customer_name}
                  </p>
                  <p className="font-body text-xs text-blush-500">
                    {order.phone}
                  </p>
                </div>
                <div className="p-4 bg-blush-50 rounded-xl">
                  <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-1">
                    Placed On
                  </p>
                  <p className="font-body text-sm font-semibold text-blush-800">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-body text-xs text-blush-500">
                    {order.payment_method}
                  </p>
                </div>
              </div>

              {/* Delivery address */}
              <div>
                <p className="font-body text-xs text-blush-400 uppercase tracking-widest mb-2">
                  Delivery Address
                </p>
                <p className="font-body text-sm text-blush-700 bg-blush-50 rounded-xl px-4 py-3 leading-relaxed">
                  {order.address}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="font-body text-xs text-blush-400 uppercase tracking-widest mb-3">
                  Items Ordered
                </p>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-blush-50 rounded-xl"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-blush-100 shrink-0">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-blush-800 truncate">
                          {item.name}
                        </p>
                        {item.variant_name && (
                          <p className="font-body text-xs text-blush-400">
                            {item.variant_name}
                          </p>
                        )}
                        <p className="font-body text-xs text-blush-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-body text-sm font-semibold text-blush-700 shrink-0">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="border-t border-blush-100 pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-blush-500">Subtotal</span>
                  <span className="text-blush-800">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-blush-500">Delivery</span>
                  <span className="text-blush-800">
                    {order.delivery_fee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${order.delivery_fee}`
                    )}
                  </span>
                </div>
                {order.discount_amt > 0 && (
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-green-600">
                      Discount ({order.coupon_code})
                    </span>
                    <span className="text-green-600">
                      - ₹{order.discount_amt}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-display text-xl font-semibold border-t border-blush-100 pt-2">
                  <span className="text-blush-700">Total</span>
                  <span className="text-blush-700">₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 py-4 bg-blush-50 border-t border-blush-100 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/919787174450"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-body text-sm font-medium rounded-xl transition-colors"
              >
                Contact Us on WhatsApp
              </a>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 flex-1 py-3 border border-blush-200 text-blush-600 font-body text-sm rounded-xl hover:bg-white transition-colors"
              >
                <ShoppingBag size={15} /> Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Empty state after search */}
        {searched && !order && !loading && !error && (
          <div className="text-center py-10">
            <p className="font-body text-sm text-blush-400">
              Enter your order number above to track your order.
            </p>
          </div>
        )}

        {/* Helper text */}
        {!searched && (
          <div className="text-center">
            <p className="font-body text-xs text-blush-400 mb-2">
              Your order number was shared when you placed your order via Email.
            </p>
            <a
              href="https://wa.me/919787174450"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-blush-500 hover:text-blush-700 underline underline-offset-2 transition-colors"
            >
              Can&apos;t find it? Ask us on WhatsApp →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
