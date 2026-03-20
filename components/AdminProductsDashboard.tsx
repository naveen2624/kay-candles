"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Flame,
  Star,
  Sparkles,
  Search,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Save,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import { cn } from "@/utils/cn";

// ── Types ──────────────────────────────────────────────────────────
type Variant = {
  id: string;
  product_id: string;
  name: string;
  image_url: string;
  stock: number;
  sort_order: number;
  is_out_of_stock: boolean;
};
type ProductFragranceRow = {
  fragrance_id: string;
  is_available: boolean;
  fragrance: { id: string; name: string };
};
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "candles" | "crafts";
  weight: number;
  image_url: string;
  tags: string[];
  stock: number;
  has_variants: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  discount_pct: number;
  discount_label: string | null;
  discount_desc: string | null;
  created_at: string;
  product_variants?: Variant[];
  product_fragrances?: ProductFragranceRow[];
};

// ── Hooks ──────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<
    { id: string; msg: string; type: "ok" | "err" | "info" }[]
  >([]);
  const show = useCallback(
    (msg: string, type: "ok" | "err" | "info" = "ok") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((p) => [...p, { id, msg, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
    },
    [],
  );
  return { toasts, show };
}

function useConfirm() {
  const [state, setState] = useState<{
    msg: string;
    resolve: (v: boolean) => void;
  } | null>(null);
  const confirm = (msg: string) =>
    new Promise<boolean>((resolve) => setState({ msg, resolve }));
  const Dialog = state ? (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100">
        <p className="text-sm text-slate-700 mb-5 leading-relaxed">
          {state.msg}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              state.resolve(false);
              setState(null);
            }}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              state.resolve(true);
              setState(null);
            }}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ) : null;
  return { confirm, Dialog };
}

// ── Helpers ────────────────────────────────────────────────────────
const inp =
  "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-300 transition-all";
const lbl =
  "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

// ── Product Form Modal ─────────────────────────────────────────────
function ProductFormModal({
  product,
  onSave,
  onClose,
}: {
  product: Product | null;
  onSave: (data: Partial<Product>, isNew: boolean) => Promise<void>;
  onClose: () => void;
}) {
  const isNew = !product;
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    category: product?.category ?? ("candles" as "candles" | "crafts"),
    weight: product?.weight ?? 200,
    image_url: product?.image_url ?? "",
    tags: product?.tags ?? ([] as string[]),
    stock: product?.stock ?? 10,
    has_variants: product?.has_variants ?? false,
    is_featured: product?.is_featured ?? false,
    is_new_arrival: product?.is_new_arrival ?? false,
    discount_pct: product?.discount_pct ?? 0,
    discount_label: product?.discount_label ?? "",
    discount_desc: product?.discount_desc ?? "",
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"basic" | "pricing" | "flags">("basic");

  const set = (k: keyof typeof form, v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };
  const handleSave = async () => {
    if (!form.name.trim() || !form.image_url.trim()) return;
    setSaving(true);
    await onSave(
      {
        ...form,
        id: product?.id,
        discount_label: form.discount_label || null,
        discount_desc: form.discount_desc || null,
      },
      isNew,
    );
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-6 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="font-bold text-slate-800">
              {isNew ? "Add New Product" : "Edit Product"}
            </h2>
            {!isNew && (
              <p className="text-xs text-slate-400 mt-0.5">{product!.name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          {(["basic", "pricing", "flags"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2.5 text-xs font-semibold capitalize border-b-2 transition-colors -mb-px",
                tab === t
                  ? "border-blush-400 text-blush-600"
                  : "border-transparent text-slate-400 hover:text-slate-600",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {/* Basic tab */}
          {tab === "basic" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={lbl}>Product Name *</label>
                  <input
                    className={inp}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Latte Candle"
                  />
                </div>
                <div>
                  <label className={lbl}>Category</label>
                  <select
                    className={inp}
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    <option value="candles">🕯️ Candles</option>
                    <option value="crafts">🌸 Crafts</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Weight (grams)</label>
                  <input
                    type="number"
                    className={inp}
                    value={form.weight}
                    onChange={(e) => set("weight", Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className={lbl}>Description *</label>
                <textarea
                  className={inp}
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the product…"
                  style={{ resize: "vertical" }}
                />
              </div>
              <div>
                <label className={lbl}>Main Image URL *</label>
                <input
                  className={inp}
                  value={form.image_url}
                  onChange={(e) => set("image_url", e.target.value)}
                  placeholder="https://..."
                />
                {form.image_url && (
                  <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                    <Image
                      src={form.image_url}
                      alt="preview"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className={lbl}>Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className={inp}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Type and press Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2.5 bg-blush-400 text-white rounded-xl text-xs font-semibold hover:bg-blush-500 transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                    >
                      {t}
                      <button
                        onClick={() =>
                          set(
                            "tags",
                            form.tags.filter((x) => x !== t),
                          )
                        }
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Pricing tab */}
          {tab === "pricing" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    className={inp}
                    value={form.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    This is the price customer pays
                  </p>
                </div>
                <div>
                  <label className={lbl}>Stock *</label>
                  <input
                    type="number"
                    className={inp}
                    value={form.stock}
                    onChange={(e) => set("stock", Number(e.target.value))}
                    min={0}
                  />
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      form.stock === 0
                        ? "text-red-500 font-semibold"
                        : "text-slate-400",
                    )}
                  >
                    {form.stock === 0
                      ? "⚠️ Will show as Out of Stock"
                      : "Items available"}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blush-50 to-pink-50 rounded-2xl border border-blush-100 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-blush-700">
                    Discount (on top of default 15%)
                  </p>
                  <span className="px-2.5 py-1 bg-blush-400 text-white text-xs font-bold rounded-full">
                    {15 + (form.discount_pct || 0)}% TOTAL OFF
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Extra % Off</label>
                    <input
                      type="number"
                      className={inp}
                      value={form.discount_pct}
                      onChange={(e) =>
                        set("discount_pct", Number(e.target.value))
                      }
                      min={0}
                      max={85}
                    />
                  </div>
                  <div>
                    <label className={lbl}>Badge Label</label>
                    <input
                      className={inp}
                      value={form.discount_label ?? ""}
                      onChange={(e) => set("discount_label", e.target.value)}
                      placeholder="Summer Sale"
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Discount Description</label>
                  <input
                    className={inp}
                    value={form.discount_desc ?? ""}
                    onChange={(e) => set("discount_desc", e.target.value)}
                    placeholder="Extra 25% off this season!"
                  />
                </div>
                {form.price > 0 && (
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs text-slate-500">
                      Original price shown:
                    </span>
                    <span className="font-semibold text-slate-700 line-through text-sm">
                      ₹
                      {Math.round(
                        form.price /
                          (1 - (15 + (form.discount_pct || 0)) / 100),
                      )}
                    </span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="font-bold text-blush-600 text-sm">
                      ₹{form.price}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Flags tab */}
          {tab === "flags" && (
            <>
              <div className="space-y-2">
                {[
                  {
                    key: "is_featured",
                    label: "Featured Product",
                    desc: "Shows in Featured Products on homepage",
                    icon: Star,
                    activeColor: "bg-amber-50 border-amber-300",
                  },
                  {
                    key: "is_new_arrival",
                    label: "New Arrival",
                    desc: "Shows in New Arrivals section",
                    icon: Sparkles,
                    activeColor: "bg-purple-50 border-purple-300",
                  },
                  {
                    key: "has_variants",
                    label: "Has Variants",
                    desc: "Enable to add colour/style variants",
                    icon: Layers,
                    activeColor: "bg-blue-50 border-blue-300",
                  },
                ].map(({ key, label, desc, icon: Icon, activeColor }) => (
                  <button
                    key={key}
                    onClick={() =>
                      set(
                        key as keyof typeof form,
                        !form[key as keyof typeof form],
                      )
                    }
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      form[key as keyof typeof form]
                        ? activeColor
                        : "border-slate-100 hover:border-slate-200",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        form[key as keyof typeof form]
                          ? "bg-white shadow-sm"
                          : "bg-slate-50",
                      )}
                    >
                      <Icon
                        size={17}
                        className={
                          form[key as keyof typeof form]
                            ? "text-blush-500"
                            : "text-slate-300"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          form[key as keyof typeof form]
                            ? "text-slate-800"
                            : "text-slate-400",
                        )}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    {form[key as keyof typeof form] ? (
                      <ToggleRight
                        size={22}
                        className="text-blush-400 shrink-0"
                      />
                    ) : (
                      <ToggleLeft
                        size={22}
                        className="text-slate-300 shrink-0"
                      />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.image_url.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blush-400 hover:bg-blush-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:bg-slate-200 disabled:text-slate-400"
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inline stock editor ────────────────────────────────────────────
function StockEditor({
  product,
  onUpdate,
}: {
  product: Product;
  onUpdate: (id: string, stock: number) => Promise<void>;
}) {
  const [val, setVal] = useState(product.stock);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const save = async () => {
    if (val !== product.stock) {
      setSaving(true);
      await onUpdate(product.id, val);
      setSaving(false);
    }
    setEditing(false);
  };

  if (editing)
    return (
      <div className="flex items-center gap-1">
        <input
          ref={ref}
          type="number"
          value={val}
          min={0}
          onChange={(e) => setVal(Number(e.target.value))}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-16 px-2 py-1 border-2 border-blush-300 rounded-lg text-sm font-mono text-center focus:outline-none"
        />
        {saving && (
          <RefreshCw size={10} className="animate-spin text-slate-400" />
        )}
      </div>
    );

  return (
    <button
      onClick={() => setEditing(true)}
      title="Click to edit stock"
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all hover:opacity-80 cursor-pointer",
        val === 0
          ? "bg-red-50 border-red-200 text-red-600"
          : val <= 5
            ? "bg-amber-50 border-amber-200 text-amber-600"
            : "bg-green-50 border-green-200 text-green-700",
      )}
    >
      {val === 0 ? "Out of Stock" : val <= 5 ? `Low: ${val}` : `Stock: ${val}`}
      <Pencil size={8} className="opacity-50" />
    </button>
  );
}

// ── Variant row ────────────────────────────────────────────────────
function VariantRow({
  variant,
  onUpdate,
  onDelete,
}: {
  variant: Variant;
  onUpdate: (id: string, data: Partial<Variant>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(variant.name);
  const [imageUrl, setImageUrl] = useState(variant.image_url);
  const [stock, setStock] = useState(variant.stock);
  const [saving, setSaving] = useState(false);

  if (editing)
    return (
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <input
            className={cn(inp, "text-xs")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Variant name"
          />
          <input
            type="number"
            className={cn(inp, "text-xs")}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min={0}
            placeholder="Stock"
          />
        </div>
        <input
          className={cn(inp, "text-xs")}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              await onUpdate(variant.id, { name, image_url: imageUrl, stock });
              setSaving(false);
              setEditing(false);
            }}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 bg-blush-400 text-white text-xs font-semibold rounded-lg hover:bg-blush-500 transition-colors"
          >
            {saving ? (
              <RefreshCw size={10} className="animate-spin" />
            ) : (
              <Check size={10} />
            )}{" "}
            Save
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex items-center gap-3 p-2.5 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={variant.image_url}
          alt={variant.name}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 truncate">
          {variant.name}
        </p>
        <p
          className={cn(
            "text-[10px] font-medium",
            variant.stock === 0 ? "text-red-500" : "text-slate-400",
          )}
        >
          {variant.stock === 0 ? "Out of stock" : `Stock: ${variant.stock}`}
        </p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={() => onDelete(variant.id)}
          className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

// ── Add variant ────────────────────────────────────────────────────
function AddVariantForm({
  productId,
  onAdd,
}: {
  productId: string;
  onAdd: (v: Omit<Variant, "id" | "is_out_of_stock">) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState(10);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!name.trim() || !imageUrl.trim()) return;
    setSaving(true);
    await onAdd({
      product_id: productId,
      name,
      image_url: imageUrl,
      stock,
      sort_order: 99,
    });
    setName("");
    setImageUrl("");
    setStock(10);
    setSaving(false);
  };
  return (
    <div className="p-3 bg-blush-50 rounded-xl border-2 border-dashed border-blush-200 space-y-2">
      <p className="text-[10px] font-bold text-blush-500 uppercase tracking-wide">
        + Add Variant
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          className={cn(inp, "text-xs")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g. Blue)"
        />
        <input
          type="number"
          className={cn(inp, "text-xs")}
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="Stock"
        />
      </div>
      <input
        className={cn(inp, "text-xs")}
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />
      <button
        onClick={save}
        disabled={saving || !name.trim() || !imageUrl.trim()}
        className="flex items-center gap-1.5 px-3 py-2 bg-blush-400 hover:bg-blush-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:bg-slate-200 disabled:text-slate-400"
      >
        {saving ? (
          <RefreshCw size={10} className="animate-spin" />
        ) : (
          <Plus size={10} />
        )}{" "}
        Add Variant
      </button>
    </div>
  );
}

// ── Fragrance toggle ───────────────────────────────────────────────
function FragranceToggle({
  pf,
  productId,
  onToggle,
}: {
  pf: ProductFragranceRow;
  productId: string;
  onToggle: (pid: string, fid: string, avail: boolean) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        setLoading(true);
        await onToggle(productId, pf.fragrance_id, !pf.is_available);
        setLoading(false);
      }}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
        pf.is_available
          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100",
      )}
    >
      {loading ? (
        <RefreshCw size={10} className="animate-spin" />
      ) : pf.is_available ? (
        <ToggleRight size={13} />
      ) : (
        <ToggleLeft size={13} />
      )}
      {pf.fragrance.name}
    </button>
  );
}

// ── Expanded panel ─────────────────────────────────────────────────
function ExpandedPanel({
  product,
  onVariantUpdate,
  onVariantDelete,
  onVariantAdd,
  onFragranceToggle,
}: {
  product: Product;
  onVariantUpdate: (id: string, data: Partial<Variant>) => Promise<void>;
  onVariantDelete: (id: string) => Promise<void>;
  onVariantAdd: (v: Omit<Variant, "id" | "is_out_of_stock">) => Promise<void>;
  onFragranceToggle: (
    pid: string,
    fid: string,
    avail: boolean,
  ) => Promise<void>;
}) {
  const variants = product.product_variants ?? [];
  const fragrances = product.product_fragrances ?? [];

  return (
    <div className="border-t border-slate-100 mt-3 pt-4 grid sm:grid-cols-2 gap-5">
      {product.has_variants && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers size={11} /> Variants ({variants.length})
          </p>
          <div className="space-y-2">
            {variants.map((v) => (
              <VariantRow
                key={v.id}
                variant={v}
                onUpdate={onVariantUpdate}
                onDelete={onVariantDelete}
              />
            ))}
            <AddVariantForm productId={product.id} onAdd={onVariantAdd} />
          </div>
        </div>
      )}
      {fragrances.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Flame size={11} /> Fragrances (
            {fragrances.filter((f) => f.is_available).length}/
            {fragrances.length} available)
          </p>
          <div className="flex flex-wrap gap-2">
            {fragrances.map((pf) => (
              <FragranceToggle
                key={pf.fragrance_id}
                pf={pf}
                productId={product.id}
                onToggle={onFragranceToggle}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Green = available for selection. Toggle to enable/disable per
            product.
          </p>
        </div>
      )}
      {!product.has_variants && fragrances.length === 0 && (
        <div className="col-span-2 py-4 text-center">
          <p className="text-xs text-slate-300">
            No variants or fragrances configured.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────
export default function AdminProductsDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | "candles" | "crafts">(
    "all",
  );
  const [sortBy, setSortBy] = useState<
    "newest" | "price_asc" | "price_desc" | "stock_asc"
  >("newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null | "new">(null);
  const { toasts, show } = useToast();
  const { confirm, Dialog } = useConfirm();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── CRUD ──────────────────────────────────────────────────────
  const handleSave = async (data: Partial<Product>, isNew: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      if (isNew) setProducts((p) => [result.product, ...p]);
      else
        setProducts((p) =>
          p.map((x) => (x.id === data.id ? { ...x, ...result.product } : x)),
        );
      show(isNew ? "Product created! 🎉" : "Product updated!");
      setEditProduct(null);
    } catch (e) {
      show((e as Error).message || "Save failed", "err");
    }
  };

  const handleDelete = async (product: Product) => {
    const ok = await confirm(
      `Delete "${product.name}"? This will also remove all variants.`,
    );
    if (!ok) return;
    try {
      await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });
      setProducts((p) => p.filter((x) => x.id !== product.id));
      show("Product deleted.");
    } catch {
      show("Delete failed", "err");
    }
  };

  const handleStock = async (productId: string, stock: number) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, stock }),
      });
      setProducts((p) =>
        p.map((x) => (x.id === productId ? { ...x, stock } : x)),
      );
      show("Stock updated!");
    } catch {
      show("Stock update failed", "err");
    }
  };

  const handleToggle = async (
    productId: string,
    field: "is_featured" | "is_new_arrival",
    value: boolean,
  ) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, [field]: value }),
      });
      setProducts((p) =>
        p.map((x) => (x.id === productId ? { ...x, [field]: value } : x)),
      );
    } catch {
      show("Update failed", "err");
    }
  };

  const handleVariantUpdate = async (id: string, data: Partial<Variant>) => {
    await fetch("/api/admin/variants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    setProducts((p) =>
      p.map((prod) => ({
        ...prod,
        product_variants: prod.product_variants?.map((v) =>
          v.id === id ? { ...v, ...data } : v,
        ),
      })),
    );
    show("Variant updated!");
  };

  const handleVariantDelete = async (id: string) => {
    const ok = await confirm("Delete this variant?");
    if (!ok) return;
    await fetch("/api/admin/variants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProducts((p) =>
      p.map((prod) => ({
        ...prod,
        product_variants: prod.product_variants?.filter((v) => v.id !== id),
      })),
    );
    show("Variant deleted.");
  };

  const handleVariantAdd = async (
    variantData: Omit<Variant, "id" | "is_out_of_stock">,
  ) => {
    const res = await fetch("/api/admin/variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variantData),
    });
    const result = await res.json();
    setProducts((p) =>
      p.map((prod) =>
        prod.id === variantData.product_id
          ? {
              ...prod,
              product_variants: [
                ...(prod.product_variants ?? []),
                result.variant,
              ],
            }
          : prod,
      ),
    );
    show("Variant added!");
  };

  const handleFragranceToggle = async (
    productId: string,
    fragranceId: string,
    available: boolean,
  ) => {
    await fetch("/api/admin/fragrances", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        fragrance_id: fragranceId,
        is_available: available,
      }),
    });
    setProducts((p) =>
      p.map((prod) =>
        prod.id === productId
          ? {
              ...prod,
              product_fragrances: prod.product_fragrances?.map((pf) =>
                pf.fragrance_id === fragranceId
                  ? { ...pf, is_available: available }
                  : pf,
              ),
            }
          : prod,
      ),
    );
  };

  // ── Stats ──────────────────────────────────────────────────────
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const featuredCount = products.filter((p) => p.is_featured).length;

  // ── Filter + sort ──────────────────────────────────────────────
  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        (catFilter === "all" || p.category === catFilter) &&
        (!search ||
          p.name.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.includes(q)))
      );
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "stock_asc") return a.stock - b.stock;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[400] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-up pointer-events-auto",
              t.type === "ok"
                ? "bg-white border-slate-200 text-slate-800"
                : t.type === "err"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-blue-50 border-blue-200 text-blue-800",
            )}
          >
            {t.type === "ok" ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <AlertCircle size={14} className="text-red-500" />
            )}
            {t.msg}
          </div>
        ))}
      </div>

      {Dialog}

      {editProduct !== null && (
        <ProductFormModal
          product={editProduct === "new" ? null : editProduct}
          onSave={handleSave}
          onClose={() => setEditProduct(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Products</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {totalProducts} products ·{" "}
              {products.reduce(
                (s, p) => s + (p.product_variants?.length ?? 0),
                0,
              )}{" "}
              variants
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setEditProduct("new")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blush-400 hover:bg-blush-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Plus size={15} /> Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Products",
              value: totalProducts,
              icon: Package,
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Out of Stock",
              value: outOfStock,
              icon: AlertCircle,
              color: outOfStock > 0 ? "text-red-600" : "text-slate-400",
              bg: outOfStock > 0 ? "bg-red-50" : "bg-slate-50",
              border: outOfStock > 0 ? "border-red-100" : "border-slate-100",
            },
            {
              label: "Low Stock (≤5)",
              value: lowStock,
              icon: BarChart3,
              color: lowStock > 0 ? "text-amber-600" : "text-slate-400",
              bg: lowStock > 0 ? "bg-amber-50" : "bg-slate-50",
              border: lowStock > 0 ? "border-amber-100" : "border-slate-100",
            },
            {
              label: "Featured",
              value: featuredCount,
              icon: Star,
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Search size={14} className="text-slate-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or tags…"
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
          <div className="flex gap-2">
            {(["all", "candles", "crafts"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={cn(
                  "px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all capitalize",
                  catFilter === c
                    ? "bg-blush-400 text-white border-blush-400"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                )}
              >
                {c === "all"
                  ? "All"
                  : c === "candles"
                    ? "🕯️ Candles"
                    : "🌸 Crafts"}
              </button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm rounded-xl focus:outline-none shadow-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="stock_asc">Stock ↑</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw size={24} className="animate-spin mb-3" />
            <p className="text-sm">Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100">
            <ShoppingBag size={32} className="text-slate-200 mb-3" />
            <p className="text-slate-400 font-medium">No products found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((product) => {
              const isExpanded = expandedId === product.id;
              const totalDiscount = 15 + (product.discount_pct ?? 0);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-red-500 text-center leading-tight px-1">
                              OUT OF
                              <br />
                              STOCK
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm truncate">
                              {product.name}
                            </h3>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0",
                                product.category === "candles"
                                  ? "bg-amber-50 border-amber-200 text-amber-600"
                                  : "bg-pink-50 border-pink-200 text-pink-600",
                              )}
                            >
                              {product.category === "candles" ? "🕯️" : "🌸"}{" "}
                              {product.category}
                            </span>
                            {product.is_featured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
                                ⭐ Featured
                              </span>
                            )}
                            {product.is_new_arrival && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 border border-purple-200 text-purple-600 shrink-0">
                                ✨ New
                              </span>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-slate-700 text-sm">
                              ₹{product.price}
                            </p>
                            {totalDiscount > 0 && (
                              <p className="text-[10px] text-green-600 font-semibold">
                                {totalDiscount}% off
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-2.5 line-clamp-1">
                          {product.description}
                        </p>

                        {/* Controls row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <StockEditor
                            product={product}
                            onUpdate={handleStock}
                          />

                          <button
                            onClick={() =>
                              handleToggle(
                                product.id,
                                "is_featured",
                                !product.is_featured,
                              )
                            }
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all",
                              product.is_featured
                                ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300",
                            )}
                          >
                            <Star size={9} /> Featured
                          </button>

                          <button
                            onClick={() =>
                              handleToggle(
                                product.id,
                                "is_new_arrival",
                                !product.is_new_arrival,
                              )
                            }
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all",
                              product.is_new_arrival
                                ? "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300",
                            )}
                          >
                            <Sparkles size={9} /> New Arrival
                          </button>

                          {product.has_variants && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-[10px] font-bold text-blue-600">
                              <Layers size={9} />{" "}
                              {product.product_variants?.length ?? 0} variants
                            </span>
                          )}
                          {(product.product_fragrances?.length ?? 0) > 0 && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-[10px] font-bold text-rose-600">
                              <Flame size={9} />{" "}
                              {
                                product.product_fragrances!.filter(
                                  (f) => f.is_available,
                                ).length
                              }
                              /{product.product_fragrances!.length} scents
                            </span>
                          )}
                          {product.tags?.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-400 text-[9px] rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-slate-50 flex-wrap">
                          <button
                            onClick={() => setEditProduct(product)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Pencil size={10} /> Edit
                          </button>
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : product.id)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Layers size={10} />
                            {isExpanded ? "Hide" : "Variants & Scents"}
                            {isExpanded ? (
                              <ChevronUp size={9} />
                            ) : (
                              <ChevronDown size={9} />
                            )}
                          </button>
                          <a
                            href={`/product/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink size={10} /> View
                          </a>
                          <button
                            onClick={() => handleDelete(product)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 text-[11px] font-semibold rounded-lg hover:bg-red-100 transition-colors ml-auto"
                          >
                            <Trash2 size={10} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded panel */}
                    {isExpanded && (
                      <ExpandedPanel
                        product={product}
                        onVariantUpdate={handleVariantUpdate}
                        onVariantDelete={handleVariantDelete}
                        onVariantAdd={handleVariantAdd}
                        onFragranceToggle={handleFragranceToggle}
                      />
                    )}
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
