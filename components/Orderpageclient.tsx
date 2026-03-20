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
  Hammer,
  AlertCircle,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";

// ── Types ──────────────────────────────────────────────────────────
type OrderItem = {
  product_id: string;
  variant_id?: string;
  name: string;
  variant_name?: string;
  fragrance_name?: string;
  price: number;
  quantity: number;
  image_url: string;
};

type Order = {
  id: string;
  order_number: string | null;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amt: number;
  coupon_code?: string;
  total: number;
  payment_method: string;
  status: string;
  awb_number?: string | null;
  courier_name?: string | null;
  tracking_url?: string | null;
  created_at: string;
};

// ── Status config ──────────────────────────────────────────────────
const STATUS_MAP: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    description: string;
    step: number; // -1 = not on progress bar
  }
> = {
  pending: {
    label: "Order Placed",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description: "Your order has been placed and is awaiting confirmation.",
    step: 0,
  },
  received: {
    label: "Order Received",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description:
      "We've got your order! Preethi & Naveen will start on it soon.",
    step: 1,
  },
  making: {
    label: "Being Made",
    icon: Hammer,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    description: "Your order is being handcrafted with love. ✨",
    step: 2,
  },
  booked_shipment: {
    label: "Shipment Booked",
    icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    description:
      "Shipment booked! Your order will be handed to the courier soon.",
    step: 3,
  },
  dispatched: {
    label: "Dispatched",
    icon: Truck,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    description:
      "Your order is on its way! Estimated delivery: 3–5 business days.",
    step: 4,
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    description: "Your order has been delivered. We hope you love it! 🕯️",
    step: 5,
  },
  cancelled: {
    label: "Cancelled",
    icon: X,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    description:
      "This order has been cancelled. Contact us on WhatsApp for help.",
    step: -1,
  },
  // Legacy
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description: "Your order has been confirmed and is being prepared.",
    step: 1,
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    description:
      "Your order is on its way! Estimated delivery: 3–5 business days.",
    step: 4,
  },
};

const FALLBACK_STATUS = STATUS_MAP.pending;

function getStatus(status: string) {
  return (
    STATUS_MAP[status] ?? {
      ...FALLBACK_STATUS,
      label: status,
      description: "Your order is being processed.",
    }
  );
}

const PROGRESS_STEPS = [
  "pending",
  "received",
  "making",
  "booked_shipment",
  "dispatched",
  "delivered",
] as const;

// ── Item label ──────────────────────────────────────────────────────
function itemLabel(item: OrderItem): string {
  const parts = [item.name];
  if (item.variant_name) parts.push(item.variant_name);
  if (item.fragrance_name) parts.push(`${item.fragrance_name} fragrance`);
  return parts.join(" — ");
}

// ── Main component ──────────────────────────────────────────────────
export default function OrdersPageClient() {
  const [input, setInput] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim().toUpperCase();
    if (!q) return;

    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/orders/lookup?order_number=${encodeURIComponent(q)}`,
      );
      const data = await res.json();

      if (!res.ok || !data.order) {
        setError(
          "No order found. Check the number from your WhatsApp confirmation.",
        );
      } else {
        setOrder(data.order as Order);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Compute status config — always safe, never null
  const statusCfg = order ? getStatus(order.status) : null;
  const currentStep = order ? (statusCfg?.step ?? 0) : -1;

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
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.toUpperCase());
                  setError("");
                  if (!e.target.value) {
                    setOrder(null);
                    setSearched(false);
                  }
                }}
                placeholder="KCC-YYYYMMDD-XXXXXX"
                className="flex-1 bg-transparent font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none uppercase tracking-wide"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => {
                    setInput("");
                    setOrder(null);
                    setError("");
                    setSearched(false);
                  }}
                  className="text-blush-300 hover:text-blush-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-xl transition-colors disabled:bg-blush-200 flex items-center gap-2 shrink-0"
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
            <div className="flex items-start gap-2 mt-3 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-xs text-red-600">{error}</p>
                <a
                  href="https://wa.me/919787174450"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-green-600 hover:underline mt-0.5 block"
                >
                  Can&apos;t find it? Ask us on WhatsApp →
                </a>
              </div>
            </div>
          )}
        </form>

        {/* ── Order result ── */}
        {order && statusCfg && (
          <div className="bg-white rounded-2xl border border-blush-100 overflow-hidden animate-fade-up">
            {/* Status header */}
            <div
              className={cn(
                "px-6 py-5 border-b flex items-center gap-4",
                statusCfg.bg,
                statusCfg.border,
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0",
                  statusCfg.bg,
                  statusCfg.border,
                )}
              >
                <statusCfg.icon size={22} className={statusCfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-0.5">
                  Order Status
                </p>
                <p
                  className={cn(
                    "font-accent text-xl font-semibold",
                    statusCfg.color,
                  )}
                >
                  {statusCfg.label}
                </p>
                <p className="font-body text-xs text-blush-500 mt-0.5 leading-relaxed">
                  {statusCfg.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest">
                  Order
                </p>
                <p className="font-accent text-sm font-bold text-blush-700">
                  {order.order_number ?? "—"}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {order.status !== "cancelled" && currentStep >= 0 && (
              <div className="px-6 py-4 border-b border-blush-100 overflow-x-auto">
                <div className="flex items-center min-w-[480px]">
                  {PROGRESS_STEPS.map((step, i) => {
                    const s = getStatus(step);
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div
                        key={step}
                        className="flex items-center flex-1 last:flex-none"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                              active
                                ? "border-blush-400 bg-blush-400 shadow-md shadow-blush-200"
                                : done
                                  ? "border-blush-300 bg-blush-100"
                                  : "border-blush-100 bg-white",
                            )}
                          >
                            <s.icon
                              size={13}
                              className={
                                active
                                  ? "text-white"
                                  : done
                                    ? "text-blush-400"
                                    : "text-blush-200"
                              }
                            />
                          </div>
                          <span
                            className={cn(
                              "font-body text-[9px] mt-1 text-center leading-tight w-12",
                              active
                                ? "text-blush-600 font-semibold"
                                : done
                                  ? "text-blush-400"
                                  : "text-blush-200",
                            )}
                          >
                            {s.label.split(" ")[0]}
                          </span>
                        </div>
                        {i < PROGRESS_STEPS.length - 1 && (
                          <div
                            className={cn(
                              "flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all",
                              i < currentStep ? "bg-blush-300" : "bg-blush-100",
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shipment tracking (shown when booked/dispatched) */}
            {(order.awb_number || order.courier_name) && (
              <div className="px-6 py-4 border-b border-blush-100">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <p className="font-body text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    📦 Shipment Details
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="font-body text-[10px] text-indigo-400 uppercase tracking-wide mb-1">
                        Courier
                      </p>
                      <p className="font-accent text-sm font-bold text-indigo-800">
                        {order.courier_name ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-indigo-400 uppercase tracking-wide mb-1">
                        AWB Number
                      </p>
                      <p className="font-body text-sm font-bold text-indigo-800 font-mono tracking-widest">
                        {order.awb_number ?? "—"}
                      </p>
                    </div>
                  </div>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-body text-xs font-semibold rounded-xl transition-colors"
                    >
                      🔗 Track My Package →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Order details */}
            <div className="p-6 space-y-5">
              {/* Customer + date */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blush-50 rounded-xl">
                  <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-1.5">
                    Customer
                  </p>
                  <p className="font-body text-sm font-semibold text-blush-800">
                    {order.customer_name}
                  </p>
                  <p className="font-body text-xs text-blush-500 flex items-center gap-1 mt-0.5">
                    <Phone size={10} /> {order.phone}
                  </p>
                </div>
                <div className="p-4 bg-blush-50 rounded-xl">
                  <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-1.5">
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

              {/* Tracking info — shown when shipment is booked */}
              {(order.awb_number || order.courier_name) && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="font-body text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Truck size={10} /> Shipment Tracking
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {order.courier_name && (
                      <div>
                        <p className="font-body text-[10px] text-indigo-400 uppercase tracking-wide mb-1">
                          Courier
                        </p>
                        <p className="font-body text-sm font-bold text-indigo-800">
                          {order.courier_name}
                        </p>
                      </div>
                    )}
                    {order.awb_number && (
                      <div>
                        <p className="font-body text-[10px] text-indigo-400 uppercase tracking-wide mb-1">
                          AWB Number
                        </p>
                        <p className="font-body text-sm font-bold text-indigo-800 font-mono tracking-widest">
                          {order.awb_number}
                        </p>
                      </div>
                    )}
                  </div>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      <ExternalLink size={12} /> Track My Package
                    </a>
                  )}
                  {!order.tracking_url && (
                    <p className="font-body text-xs text-indigo-500">
                      Use AWB number on <strong>{order.courier_name}</strong>
                      &apos;s website to track your package.
                    </p>
                  )}
                </div>
              )}

              {/* Address */}
              <div>
                <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin size={10} /> Delivery Address
                </p>
                <p className="font-body text-sm text-blush-700 bg-blush-50 rounded-xl px-4 py-3 leading-relaxed">
                  {order.address}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-3">
                  Items Ordered
                </p>
                <div className="space-y-3">
                  {(order.items ?? []).map((item, i) => {
                    // Detect if fragrance was stored inside variant_name (old orders)
                    // vs new orders where fragrance_name is a separate field
                    const fragranceLabel = item.fragrance_name
                      ? item.fragrance_name
                      : null;
                    const variantLabel = item.variant_name || null;

                    return (
                      <div key={i} className="p-4 bg-blush-50 rounded-xl">
                        <div className="flex items-start gap-4">
                          {/* Product image */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-blush-100 shrink-0 border border-blush-200">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-blush-200" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-accent text-sm font-semibold text-blush-800 leading-snug mb-2">
                              {item.name}
                            </p>

                            {/* Variant + Fragrance pills */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {variantLabel && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blush-200 text-blush-600 text-[11px] font-body font-medium rounded-full">
                                  <span className="text-blush-300">
                                    Variant:
                                  </span>
                                  {variantLabel}
                                </span>
                              )}
                              {fragranceLabel && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blush-200 text-blush-600 text-[11px] font-body font-medium rounded-full">
                                  <span className="text-blush-300">🌸</span>
                                  {fragranceLabel}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-body text-xs text-blush-400">
                                Qty:{" "}
                                <strong className="text-blush-600">
                                  {item.quantity}
                                </strong>
                              </span>
                              <span className="font-display text-base font-semibold text-blush-700">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                {(order.discount_amt ?? 0) > 0 && (
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
                Need help? WhatsApp us
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

        {/* No result after search */}
        {searched && !order && !loading && !error && (
          <div className="text-center py-8">
            <p className="font-body text-sm text-blush-400">
              Enter your order number above to track your order.
            </p>
          </div>
        )}

        {/* Pre-search helper */}
        {!searched && (
          <div className="text-center space-y-1">
            <p className="font-body text-xs text-blush-400">
              Your order number was sent in your WhatsApp order confirmation.
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
