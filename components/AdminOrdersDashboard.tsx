"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Package,
  Clock,
  Hammer,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  FileText,
  Phone,
  MapPin,
  Mail,
  Tag,
  X,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";

// ── Types ──────────────────────────────────────────────────────────
type OrderItem = {
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
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    dot: string;
    next: string[];
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    next: ["received", "cancelled"],
  },
  received: {
    label: "Order Received",
    icon: Package,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
    next: ["making", "cancelled"],
  },
  making: {
    label: "Making",
    icon: Hammer,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    dot: "bg-purple-500",
    next: ["booked_shipment", "cancelled"],
  },
  booked_shipment: {
    label: "Shipment Booked",
    icon: Truck,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-500",
    next: ["dispatched"],
  },
  dispatched: {
    label: "Dispatched",
    icon: Truck,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
    next: ["delivered"],
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
    next: [],
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-400",
    next: [],
  },
};
const getCfg = (s: string) => STATUS_CONFIG[s] ?? STATUS_CONFIG.pending;

// ── Helpers ────────────────────────────────────────────────────────
function itemLabel(item: OrderItem) {
  const parts = [item.name];
  if (item.variant_name) parts.push(item.variant_name);
  if (item.fragrance_name) parts.push(`${item.fragrance_name} fragrance`);
  return parts.join(" — ");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Shipment popup ─────────────────────────────────────────────────
function ShipmentPopup({
  order,
  onConfirm,
  onClose,
}: {
  order: Order;
  onConfirm: (data: {
    awb: string;
    courier: string;
    url: string;
  }) => Promise<void>;
  onClose: () => void;
}) {
  const [awb, setAwb] = useState(order.awb_number ?? "");
  const [courier, setCourier] = useState(order.courier_name ?? "");
  const [url, setUrl] = useState(order.tracking_url ?? "");
  const [saving, setSaving] = useState(false);

  const COURIERS = [
    "DTDC",
    "Delhivery",
    "Bluedart",
    "India Post",
    "Ecom Express",
    "Xpressbees",
    "Amazon Logistics",
    "Other",
  ];

  const handle = async () => {
    if (!awb.trim() || !courier.trim()) return;
    setSaving(true);
    await onConfirm({
      awb: awb.trim(),
      courier: courier.trim(),
      url: url.trim(),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
              <Truck size={16} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">
                Book Shipment
              </h3>
              <p className="text-xs text-slate-400">
                {order.order_number ?? order.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Customer info strip */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center shrink-0">
              <span className="font-bold text-blush-600 text-xs">
                {order.customer_name[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-700 text-sm truncate">
                {order.customer_name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {order.address.split(",").slice(0, 2).join(",")}
              </p>
            </div>
            {order.email && (
              <span className="ml-auto text-[10px] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full shrink-0">
                Email ✓
              </span>
            )}
          </div>

          {/* AWB Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              AWB / Tracking Number <span className="text-red-400">*</span>
            </label>
            <input
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 font-mono tracking-widest transition-all"
            />
          </div>

          {/* Courier */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Courier Partner <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {COURIERS.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => setCourier(c)}
                  className={cn(
                    "px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-all text-center",
                    courier === c
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-orange-300",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              placeholder="Or type courier name"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
            />
          </div>

          {/* Tracking URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Tracking Link{" "}
              <span className="text-slate-400 font-normal normal-case">
                (optional but recommended)
              </span>
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://track.delhivery.com/..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
            />
          </div>

          {/* Email notice */}
          <div
            className={cn(
              "flex items-start gap-2.5 p-3 rounded-xl border text-xs",
              order.email
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-amber-50 border-amber-200 text-amber-700",
            )}
          >
            <Mail size={13} className="shrink-0 mt-0.5" />
            <p>
              {order.email ? (
                <>
                  Shipment details will be emailed to{" "}
                  <strong>{order.email}</strong>
                </>
              ) : (
                <>
                  No email on file — customer will <strong>not</strong> receive
                  an email notification. Notify via WhatsApp.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={saving || !awb.trim() || !courier.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:bg-slate-200 disabled:text-slate-400"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Truck size={14} />
            )}
            {saving ? "Booking…" : "Confirm Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order detail modal ─────────────────────────────────────────────
function OrderModal({
  order,
  onClose,
  onUpdate,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (
    id: string,
    status: string,
    extra?: Record<string, string>,
  ) => Promise<void>;
}) {
  const cfg = getCfg(order.status);
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 border border-slate-100 animate-fade-up">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)} />
            <div>
              <h2 className="font-bold text-slate-800">
                {order.order_number ?? "—"}
              </h2>
              <p className="text-xs text-slate-400">
                {formatDate(order.created_at)} · {formatTime(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                window.open(`/api/admin/orders/${order.id}/label`, "_blank")
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FileText size={12} /> Print Label
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Status badge + next actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                cfg.color,
                cfg.bg,
                cfg.border,
              )}
            >
              <cfg.icon size={12} /> {cfg.label}
            </span>
            {cfg.next.length > 0 && (
              <div className="flex gap-2">
                {cfg.next.map((next) => {
                  const nc = getCfg(next);
                  return (
                    <button
                      key={next}
                      onClick={() => onUpdate(order.id, next)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80",
                        nc.color,
                        nc.bg,
                        nc.border,
                      )}
                    >
                      <nc.icon size={11} /> → {nc.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shipment tracking info (if booked) */}
          {(order.awb_number || order.courier_name) && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2.5">
                Shipment Info
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-wide">
                    Courier
                  </p>
                  <p className="text-sm font-semibold text-indigo-800 mt-0.5">
                    {order.courier_name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-wide">
                    AWB Number
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-mono font-semibold text-indigo-800">
                      {order.awb_number ?? "—"}
                    </p>
                    {order.awb_number && (
                      <button
                        onClick={() => copy(order.awb_number!)}
                        className="text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ExternalLink size={11} /> Track Package
                </a>
              )}
            </div>
          )}

          {/* Customer + order info grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Customer
              </p>
              <p className="font-semibold text-slate-800">
                {order.customer_name}
              </p>
              <a
                href={`tel:${order.phone}`}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                <Phone size={10} /> {order.phone}
              </a>
              {order.email && (
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail size={10} /> {order.email}
                </p>
              )}
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Order Info
              </p>
              <p className="text-xs text-slate-600">
                {formatDate(order.created_at)} at {formatTime(order.created_at)}
              </p>
              <p className="text-xs text-slate-600">
                Payment:{" "}
                <strong className="text-slate-800">
                  {order.payment_method}
                </strong>
              </p>
              {order.coupon_code && (
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <Tag size={9} /> Coupon: {order.coupon_code} (−₹
                  {order.discount_amt})
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={10} /> Delivery Address
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {order.address}
            </p>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Items
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-blush-50 shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.name}
                    </p>
                    {item.variant_name && (
                      <p className="text-xs text-slate-500">
                        Variant: {item.variant_name}
                      </p>
                    )}
                    {item.fragrance_name && (
                      <p className="text-xs text-slate-500">
                        🌸 {item.fragrance_name}
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-700 shrink-0">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-100 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Delivery</span>
              <span>
                {order.delivery_fee === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${order.delivery_fee}`
                )}
              </span>
            </div>
            {(order.discount_amt ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>−₹{order.discount_amt}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-slate-800 border-t border-slate-100 pt-2">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────
export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shipmentOrder, setShipmentOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (
    orderId: string,
    status: string,
    extra?: Record<string, string>,
  ) => {
    // Intercept booked_shipment — show popup unless extra data already provided
    if (status === "booked_shipment" && !extra) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setShipmentOrder(order);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          status,
          ...(extra
            ? {
                awb_number: extra.awb,
                courier_name: extra.courier,
                tracking_url: extra.url,
              }
            : {}),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        showToast(result.detail ?? result.error ?? "Update failed", "err");
        return;
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status, ...result.order } : o,
        ),
      );
      if (selectedOrder?.id === orderId)
        setSelectedOrder((p) => (p ? { ...p, status, ...result.order } : null));
      showToast(
        status === "booked_shipment"
          ? "Shipment booked & email sent! 🚚"
          : "Status updated!",
      );
    } catch {
      showToast("Update failed", "err");
    }
  };

  const handleShipmentConfirm = async (data: {
    awb: string;
    courier: string;
    url: string;
  }) => {
    if (!shipmentOrder) return;
    await handleStatusUpdate(shipmentOrder.id, "booked_shipment", data);
    setShipmentOrder(null);
  };

  // Analytics
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString(),
  );
  const pendingCount = orders.filter((o) =>
    ["pending", "received", "making"].includes(o.status),
  ).length;
  const dispatchedCount = orders.filter((o) =>
    ["booked_shipment", "dispatched"].includes(o.status),
  ).length;

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      (o.order_number ?? "").toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.phone.includes(search) ||
      (o.email ?? "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-5 right-5 z-[400] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-up",
            toast.type === "ok"
              ? "bg-white border-slate-200 text-slate-800"
              : "bg-red-50 border-red-200 text-red-800",
          )}
        >
          {toast.type === "ok" ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <AlertCircle size={14} className="text-red-500" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Shipment popup */}
      {shipmentOrder && (
        <ShipmentPopup
          order={shipmentOrder}
          onConfirm={handleShipmentConfirm}
          onClose={() => setShipmentOrder(null)}
        />
      )}

      {/* Order modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleStatusUpdate}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {orders.length} total · {filtered.length} shown
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Revenue",
              value: `₹${totalRevenue.toLocaleString("en-IN")}`,
              icon: IndianRupee,
              color: "text-green-600",
              bg: "bg-green-50",
              border: "border-green-100",
            },
            {
              label: "Today's Orders",
              value: todayOrders.length,
              icon: TrendingUp,
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Needs Action",
              value: pendingCount,
              icon: AlertCircle,
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "In Transit",
              value: dispatchedCount,
              icon: Truck,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              border: "border-indigo-100",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={cn(
                "bg-white rounded-2xl border p-5 shadow-sm",
                card.border,
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {card.label}
                </p>
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center",
                    card.bg,
                  )}
                >
                  <card.icon size={15} className={card.color} />
                </div>
              </div>
              <p className={cn("text-2xl font-bold", card.color)}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Status pill filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all",
              filterStatus === "all"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
            )}
          >
            All ({orders.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = orders.filter((o) => o.status === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() =>
                  setFilterStatus(filterStatus === key ? "all" : key)
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all",
                  filterStatus === key
                    ? cn(cfg.bg, cfg.border, cfg.color)
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Search size={14} className="text-slate-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, name, phone, or email…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-300 hover:text-slate-500"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw size={24} className="animate-spin mb-3" />
            <p className="text-sm">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100">
            <ShoppingBag size={32} className="text-slate-200 mb-3" />
            <p className="text-slate-400 font-medium">No orders found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((order) => {
              const cfg = getCfg(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Status dot + order number */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                        <span
                          className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)}
                        />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-sm">
                              {order.order_number ?? "—"}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                cfg.color,
                                cfg.bg,
                                cfg.border,
                              )}
                            >
                              {cfg.label}
                            </span>
                            {["booked_shipment", "dispatched"].includes(
                              order.status,
                            ) &&
                              order.awb_number && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 border border-indigo-200 text-indigo-600">
                                  <Truck size={8} /> {order.courier_name} ·{" "}
                                  {order.awb_number}
                                </span>
                              )}
                          </div>
                          <span className="font-bold text-slate-700 shrink-0">
                            ₹{order.total}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                          <span className="font-medium text-slate-600">
                            {order.customer_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={9} />
                            {order.phone}
                          </span>
                          {order.email && (
                            <span className="flex items-center gap-1 text-green-500">
                              <Mail size={9} />
                              {order.email}
                            </span>
                          )}
                          <span>{formatDate(order.created_at)}</span>
                        </div>

                        {/* Item chips */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {order.items.map((item, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] text-slate-500"
                            >
                              {itemLabel(item)} ×{item.quantity}
                            </span>
                          ))}
                        </div>

                        {/* Actions row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Status dropdown for next states */}
                          {cfg.next.length > 0 &&
                            cfg.next.map((next) => {
                              const nc = getCfg(next);
                              return (
                                <button
                                  key={next}
                                  onClick={() =>
                                    handleStatusUpdate(order.id, next)
                                  }
                                  className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all hover:opacity-80",
                                    nc.color,
                                    nc.bg,
                                    nc.border,
                                  )}
                                >
                                  <nc.icon size={10} /> {nc.label}
                                </button>
                              );
                            })}

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Eye size={10} /> Details
                          </button>
                          <button
                            onClick={() =>
                              window.open(
                                `/api/admin/orders/${order.id}/label`,
                                "_blank",
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blush-50 border border-blush-200 text-blush-600 text-[11px] font-medium rounded-lg hover:bg-blush-100 transition-colors"
                          >
                            <FileText size={10} /> Label
                          </button>
                          {order.tracking_url && (
                            <a
                              href={order.tracking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 text-[11px] font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <ExternalLink size={10} /> Track
                            </a>
                          )}
                          <a
                            href={`https://wa.me/91${order.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-600 text-[11px] font-medium rounded-lg hover:bg-green-100 transition-colors ml-auto"
                          >
                            <Phone size={10} /> WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
