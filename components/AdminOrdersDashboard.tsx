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
  ChevronDown,
  RefreshCw,
  Search,
  Filter,
  Eye,
  FileText,
  Phone,
  MapPin,
  Mail,
  Tag,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Order, OrderItem } from "@/lib/supabase";

// ── Status configuration ───────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    next?: string[];
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    next: ["received", "cancelled"],
  },
  received: {
    label: "Order Received",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    next: ["making", "cancelled"],
  },
  making: {
    label: "Making",
    icon: Hammer,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    next: ["booked_shipment", "cancelled"],
  },
  booked_shipment: {
    label: "Shipment Booked",
    icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    next: ["dispatched"],
  },
  dispatched: {
    label: "Dispatched",
    icon: Truck,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    next: ["delivered"],
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    next: [],
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    next: [],
  },
};

// ── Item label helper ──────────────────────────────────────────────
function itemLabel(item: OrderItem): string {
  const parts = [item.name];
  if (item.variant_name) parts.push(item.variant_name);
  if (item.fragrance_name) parts.push(`${item.fragrance_name} fragrance`);
  return parts.join(" — ");
}

// ── Status badge ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        cfg.color,
        cfg.bg,
        cfg.border,
      )}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

// ── Status dropdown ────────────────────────────────────────────────
function StatusDropdown({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (id: string, status: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const nextStatuses = cfg.next ?? [];

  if (nextStatuses.length === 0) return <StatusBadge status={order.status} />;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
          cfg.color,
          cfg.bg,
          cfg.border,
          "hover:opacity-80",
        )}
      >
        <cfg.icon size={11} />
        {cfg.label}
        <ChevronDown
          size={10}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-blush-100 rounded-xl shadow-xl z-50 min-w-[180px] overflow-hidden">
          {nextStatuses.map((s) => {
            const next = STATUS_CONFIG[s];
            if (!next) return null;
            return (
              <button
                key={s}
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setOpen(false);
                  await onUpdate(order.id, s);
                  setLoading(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-blush-50 text-left",
                  next.color,
                )}
              >
                <next.icon size={13} />
                Mark as: {next.label}
              </button>
            );
          })}
        </div>
      )}
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
  onUpdate: (id: string, status: string) => Promise<void>;
}) {
  const handlePrint = () => {
    window.open(`/api/admin/orders/${order.id}/label`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-blush-100 shadow-2xl w-full max-w-2xl my-8 animate-fade-up">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blush-100">
          <div>
            <p className="font-body text-xs text-blush-400 uppercase tracking-widest">
              Order
            </p>
            <h2 className="font-accent text-lg font-bold text-blush-800">
              {order.order_number}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-blush-50 border border-blush-200 text-blush-600 text-xs font-body font-medium rounded-lg hover:bg-blush-100 transition-colors"
            >
              <FileText size={13} /> Print Label
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-blush-50 flex items-center justify-center text-blush-400 hover:bg-blush-100 transition-colors"
            >
              <XCircle size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-blush-500">Status:</span>
            <StatusDropdown order={order} onUpdate={onUpdate} />
          </div>

          {/* Customer info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blush-50 rounded-xl space-y-2">
              <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest font-semibold">
                Customer
              </p>
              <p className="font-accent text-sm font-semibold text-blush-800">
                {order.customer_name}
              </p>
              <a
                href={`tel:${order.phone}`}
                className="flex items-center gap-1.5 font-body text-xs text-blush-600 hover:text-blush-800"
              >
                <Phone size={11} /> {order.phone}
              </a>
              {order.email && (
                <p className="flex items-center gap-1.5 font-body text-xs text-blush-500">
                  <Mail size={11} /> {order.email}
                </p>
              )}
            </div>
            <div className="p-4 bg-blush-50 rounded-xl space-y-2">
              <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest font-semibold">
                Order Info
              </p>
              <p className="font-body text-xs text-blush-600">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="font-body text-xs text-blush-600">
                Payment: <strong>{order.payment_method}</strong>
              </p>
              {order.coupon_code && (
                <p className="flex items-center gap-1 font-body text-xs text-green-600">
                  <Tag size={10} /> Coupon: {order.coupon_code}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="p-4 bg-blush-50 rounded-xl">
            <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
              <MapPin size={10} /> Delivery Address
            </p>
            <p className="font-body text-sm text-blush-700 leading-relaxed">
              {order.address}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest font-semibold">
              Items Ordered
            </p>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-white border border-blush-100 rounded-xl"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-blush-50 shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-blush-800 truncate">
                    {item.name}
                  </p>
                  {item.variant_name && (
                    <p className="font-body text-xs text-blush-500">
                      Variant: <strong>{item.variant_name}</strong>
                    </p>
                  )}
                  {item.fragrance_name && (
                    <p className="font-body text-xs text-blush-500">
                      Fragrance: <strong>{item.fragrance_name}</strong>
                    </p>
                  )}
                  <p className="font-body text-xs text-blush-400">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-accent text-sm font-bold text-blush-700 shrink-0">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-blush-100 pt-4 space-y-2">
            <div className="flex justify-between font-body text-sm text-blush-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-blush-500">
              <span>Delivery</span>
              <span>
                {order.delivery_fee === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${order.delivery_fee}`
                )}
              </span>
            </div>
            {order.discount_amt > 0 && (
              <div className="flex justify-between font-body text-sm text-green-600">
                <span>Discount ({order.coupon_code})</span>
                <span>-₹{order.discount_amt}</span>
              </div>
            )}
            <div className="flex justify-between font-display text-lg font-semibold text-blush-800 border-t border-blush-100 pt-2">
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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status }),
      });
      const result = await res.json();

      if (!res.ok) {
        console.error("Status update rejected by server:", result);
        alert(
          `Status update failed: ${result.error ?? "Unknown error"}. Have you run the order-status-migration.sql in Supabase?`,
        );
        return;
      }

      // Update local state only after confirmed DB success
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: status as Order["status"] } : o,
        ),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: status as Order["status"] } : null,
        );
      }
    } catch (e) {
      console.error("Status update failed:", e);
      alert("Status update failed — check your internet connection.");
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      (o.order_number ?? "").toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.phone.includes(search);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = Object.keys(STATUS_CONFIG).map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  return (
    <div className="min-h-screen bg-blush-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-light text-blush-900">
              Orders
            </h1>
            <p className="font-body text-sm text-blush-400 mt-1">
              {orders.length} total orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blush-200 text-blush-600 font-body text-sm rounded-xl hover:bg-blush-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {stats.map(({ status, count }) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(status === filterStatus ? "all" : status)
                }
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  filterStatus === status
                    ? cn(cfg.bg, cfg.border, "shadow-sm")
                    : "bg-white border-blush-100 hover:border-blush-200",
                )}
              >
                <p
                  className={cn(
                    "font-display text-2xl font-semibold",
                    filterStatus === status ? cfg.color : "text-blush-700",
                  )}
                >
                  {count}
                </p>
                <p className="font-body text-[10px] text-blush-400 mt-0.5 leading-tight">
                  {cfg.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white border border-blush-200 rounded-xl">
            <Search size={15} className="text-blush-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number, name, or phone…"
              className="flex-1 bg-transparent font-body text-sm text-blush-700 placeholder-blush-300 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blush-200 rounded-xl">
            <Filter size={13} className="text-blush-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent font-body text-sm text-blush-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
                <option key={s} value={s}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders table */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw
              size={24}
              className="animate-spin text-blush-300 mx-auto mb-3"
            />
            <p className="font-body text-sm text-blush-400">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-blush-100">
            <Package size={32} className="text-blush-200 mx-auto mb-3" />
            <p className="font-accent text-blush-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-blush-100 p-5 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-accent text-sm font-bold text-blush-800">
                        {order.order_number ?? "—"}
                      </span>
                      <StatusBadge status={order.status} />
                      <span className="font-body text-xs text-blush-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <p className="font-body text-sm text-blush-700 font-medium">
                      {order.customer_name}
                    </p>
                    <p className="font-body text-xs text-blush-400">
                      {order.phone}
                    </p>
                    <p className="font-body text-xs text-blush-400 mt-1 line-clamp-1">
                      {order.address}
                    </p>

                    {/* Item summary */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {order.items.map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blush-50 border border-blush-100 text-blush-500 text-[10px] font-body rounded-full"
                        >
                          {itemLabel(item)} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3">
                    <p className="font-display text-xl font-semibold text-blush-700">
                      ₹{order.total}
                    </p>
                    <div className="flex gap-2">
                      <StatusDropdown
                        order={order}
                        onUpdate={handleStatusUpdate}
                      />
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blush-50 border border-blush-200 text-blush-600 text-xs font-body rounded-lg hover:bg-blush-100 transition-colors"
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            `/api/admin/orders/${order.id}/label`,
                            "_blank",
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blush-400 hover:bg-blush-500 text-white text-xs font-body rounded-lg transition-colors"
                      >
                        <FileText size={12} /> Label
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
