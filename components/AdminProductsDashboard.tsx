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
  AlertCircle,
  Save,
  Eye,
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
  fragrance: { id: string; name: string; description: string | null };
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

type Fragrance = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

// ── Toast ──────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<
    { id: string; msg: string; type: "ok" | "err" }[]
  >([]);
  // useCallback so `show` has a stable reference — prevents infinite fetchAll loops
  const show = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

// ── Confirm dialog ─────────────────────────────────────────────────
function useConfirm() {
  const [state, setState] = useState<{
    msg: string;
    resolve: (v: boolean) => void;
  } | null>(null);
  const confirm = (msg: string) =>
    new Promise<boolean>((resolve) => setState({ msg, resolve }));
  const Dialog = state ? (
    <div className="fixed inset-0 z-[300] bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <p className="font-body text-sm text-blush-800 mb-5">{state.msg}</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              state.resolve(false);
              setState(null);
            }}
            className="flex-1 py-2.5 border border-blush-200 text-blush-600 font-body text-sm rounded-xl hover:bg-blush-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              state.resolve(true);
              setState(null);
            }}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-body text-sm rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ) : null;
  return { confirm, Dialog };
}

// ── Input helpers ──────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2.5 bg-blush-50 border border-blush-200 rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all";
const labelCls =
  "block font-body text-xs text-blush-600 font-semibold mb-1.5 uppercase tracking-wide";

// ── Empty product form ─────────────────────────────────────────────
const emptyProduct = (): Omit<
  Product,
  "id" | "created_at" | "product_variants" | "product_fragrances"
> => ({
  name: "",
  description: "",
  price: 0,
  category: "candles",
  weight: 200,
  image_url: "",
  tags: [],
  stock: 10,
  has_variants: false,
  is_featured: false,
  is_new_arrival: false,
  discount_pct: 0,
  discount_label: null,
  discount_desc: null,
});

// ── ProductForm modal ──────────────────────────────────────────────
function ProductFormModal({
  product,

  onSave,
  onClose,
}: {
  product: Product | null;
  allFragrances: Fragrance[];
  onSave: (data: Partial<Product>, isNew: boolean) => Promise<void>;
  onClose: () => void;
}) {
  const isNew = !product;
  const [form, setForm] = useState<
    Omit<
      Product,
      "id" | "created_at" | "product_variants" | "product_fragrances"
    >
  >(
    product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          weight: product.weight,
          image_url: product.image_url,
          tags: product.tags ?? [],
          stock: product.stock,
          has_variants: product.has_variants,
          is_featured: product.is_featured,
          is_new_arrival: product.is_new_arrival,
          discount_pct: product.discount_pct ?? 0,
          discount_label: product.discount_label ?? "",
          discount_desc: product.discount_desc ?? "",
        }
      : emptyProduct(),
  );
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

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
    await onSave({ ...form, id: product?.id }, isNew);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-blush-100 shadow-2xl w-full max-w-2xl my-6 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blush-100">
          <h2 className="font-accent text-lg font-bold text-blush-800">
            {isNew ? "Add New Product" : `Edit — ${product!.name}`}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-blush-50 flex items-center justify-center text-blush-400 hover:bg-blush-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name + Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Product Name *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Latte Candle"
              />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) =>
                  set("category", e.target.value as "candles" | "crafts")
                }
              >
                <option value="candles">Candles</option>
                <option value="crafts">Crafts</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              className={inputCls}
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the product…"
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className={labelCls}>Main Image URL *</label>
            <input
              className={inputCls}
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="https://..."
            />
            {form.image_url && (
              <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-blush-200">
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

          {/* Price + Weight + Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input
                type="number"
                className={inputCls}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <label className={labelCls}>Weight (g)</label>
              <input
                type="number"
                className={inputCls}
                value={form.weight}
                onChange={(e) => set("weight", Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <label className={labelCls}>Stock *</label>
              <input
                type="number"
                className={inputCls}
                value={form.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
                min={0}
              />
              <p className="font-body text-[10px] text-blush-400 mt-1">
                Set 0 to mark as Out of Stock
              </p>
            </div>
          </div>

          {/* Discount */}
          <div className="p-4 bg-blush-50 rounded-xl border border-blush-100 space-y-3">
            <p className="font-body text-xs font-semibold text-blush-600 uppercase tracking-wide">
              Discount (extra on top of default 15%)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Extra % Off</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.discount_pct}
                  onChange={(e) => set("discount_pct", Number(e.target.value))}
                  min={0}
                  max={85}
                />
              </div>
              <div>
                <label className={labelCls}>Label</label>
                <input
                  className={inputCls}
                  value={form.discount_label ?? ""}
                  onChange={(e) => set("discount_label", e.target.value)}
                  placeholder="Summer Sale"
                />
              </div>
              <div className="col-span-1">
                <label className={labelCls}>Total shown</label>
                <div className="px-3 py-2.5 bg-white border border-blush-200 rounded-xl font-accent text-sm font-bold text-blush-600">
                  {15 + (form.discount_pct || 0)}% OFF
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Discount Description</label>
              <input
                className={inputCls}
                value={form.discount_desc ?? ""}
                onChange={(e) => set("discount_desc", e.target.value)}
                placeholder="Extra 25% off on latte candles this season!"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag and press Enter"
              />
              <button
                onClick={addTag}
                className="px-3 py-2.5 bg-blush-400 text-white rounded-xl font-body text-xs hover:bg-blush-500 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-blush-100 text-blush-600 text-xs font-body rounded-full"
                >
                  {t}
                  <button
                    onClick={() =>
                      set(
                        "tags",
                        form.tags.filter((x) => x !== t),
                      )
                    }
                    className="text-blush-400 hover:text-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: "is_featured", label: "Featured Product", icon: Star },
              { key: "is_new_arrival", label: "New Arrival", icon: Sparkles },
              { key: "has_variants", label: "Has Variants", icon: Layers },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() =>
                  set(key as keyof typeof form, !form[key as keyof typeof form])
                }
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                  form[key as keyof typeof form]
                    ? "border-blush-400 bg-blush-50"
                    : "border-blush-100 hover:border-blush-200",
                )}
              >
                <Icon
                  size={15}
                  className={
                    form[key as keyof typeof form]
                      ? "text-blush-500"
                      : "text-blush-300"
                  }
                />
                <span
                  className={cn(
                    "font-body text-sm",
                    form[key as keyof typeof form]
                      ? "text-blush-700 font-medium"
                      : "text-blush-400",
                  )}
                >
                  {label}
                </span>
                {form[key as keyof typeof form] ? (
                  <ToggleRight size={18} className="ml-auto text-blush-400" />
                ) : (
                  <ToggleLeft size={18} className="ml-auto text-blush-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-blush-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-blush-200 text-blush-600 font-body text-sm rounded-xl hover:bg-blush-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.image_url.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blush-400 hover:bg-blush-500 text-white font-body text-sm font-medium rounded-xl transition-colors disabled:bg-blush-200"
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

  const save = async () => {
    setSaving(true);
    await onUpdate(variant.id, { name, image_url: imageUrl, stock });
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="p-3 bg-blush-50 rounded-xl border border-blush-200 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Variant Name</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Stock</label>
            <input
              type="number"
              className={inputCls}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Image URL</label>
          <input
            className={inputCls}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 border border-blush-200 text-blush-500 text-xs font-body rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blush-400 text-white text-xs font-body rounded-lg hover:bg-blush-500 transition-colors"
          >
            {saving ? (
              <RefreshCw size={11} className="animate-spin" />
            ) : (
              <Check size={11} />
            )}{" "}
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2.5 bg-white border border-blush-100 rounded-xl">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-blush-50 shrink-0">
        <Image
          src={variant.image_url}
          alt={variant.name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-blush-800 truncate">
          {variant.name}
        </p>
        <p className="font-body text-xs text-blush-400">
          Stock:{" "}
          <strong
            className={variant.stock === 0 ? "text-red-500" : "text-blush-700"}
          >
            {variant.stock}
          </strong>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-lg bg-blush-50 flex items-center justify-center text-blush-400 hover:bg-blush-100 transition-colors"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={() => onDelete(variant.id)}
          className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ── Add variant form ───────────────────────────────────────────────
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
    <div className="p-3 bg-blush-50 rounded-xl border-2 border-dashed border-blush-200 space-y-2.5">
      <p className="font-body text-xs font-semibold text-blush-500 uppercase tracking-wide">
        Add Variant
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Variant name (e.g. Blue)"
        />
        <input
          type="number"
          className={inputCls}
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          min={0}
          placeholder="Stock"
        />
      </div>
      <input
        className={inputCls}
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />
      <button
        onClick={save}
        disabled={saving || !name.trim() || !imageUrl.trim()}
        className="flex items-center gap-1.5 px-3 py-2 bg-blush-400 hover:bg-blush-500 text-white text-xs font-body font-medium rounded-lg transition-colors disabled:bg-blush-200"
      >
        {saving ? (
          <RefreshCw size={11} className="animate-spin" />
        ) : (
          <Plus size={11} />
        )}{" "}
        Add Variant
      </button>
    </div>
  );
}

// ── Fragrance availability toggle ──────────────────────────────────
function FragranceToggle({
  pf,
  productId,
  onToggle,
}: {
  pf: ProductFragranceRow;
  productId: string;
  onToggle: (
    productId: string,
    fragranceId: string,
    available: boolean,
  ) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const toggle = async () => {
    setLoading(true);
    await onToggle(productId, pf.fragrance_id, !pf.is_available);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-body font-medium transition-all",
        pf.is_available
          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100",
      )}
    >
      {loading ? (
        <RefreshCw size={11} className="animate-spin" />
      ) : pf.is_available ? (
        <ToggleRight size={14} />
      ) : (
        <ToggleLeft size={14} />
      )}
      {pf.fragrance.name}
      <span
        className={cn(
          "ml-auto text-[9px] font-semibold uppercase tracking-wide",
          pf.is_available ? "text-green-500" : "text-gray-400",
        )}
      >
        {pf.is_available ? "Available" : "Unavailable"}
      </span>
    </button>
  );
}

// ── Product expanded row ───────────────────────────────────────────
function ProductExpandedPanel({
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
    productId: string,
    fragranceId: string,
    available: boolean,
  ) => Promise<void>;
}) {
  const variants = product.product_variants ?? [];
  const fragrances = product.product_fragrances ?? [];

  return (
    <div className="mt-3 pt-3 border-t border-blush-100 grid sm:grid-cols-2 gap-5">
      {/* Variants */}
      {product.has_variants && (
        <div>
          <p className="font-body text-xs font-semibold text-blush-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Layers size={12} /> Variants ({variants.length})
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

      {/* Fragrances */}
      {fragrances.length > 0 && (
        <div>
          <p className="font-body text-xs font-semibold text-blush-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Flame size={12} /> Fragrances ({fragrances.length})
          </p>
          <div className="grid grid-cols-1 gap-2">
            {fragrances.map((pf) => (
              <FragranceToggle
                key={pf.fragrance_id}
                pf={pf}
                productId={product.id}
                onToggle={onFragranceToggle}
              />
            ))}
          </div>
          <p className="font-body text-[10px] text-blush-400 mt-2">
            Toggle to mark a fragrance as unavailable. It still shows on the
            product page but isn&apos;t greyed out.
          </p>
        </div>
      )}

      {!product.has_variants && fragrances.length === 0 && (
        <div className="col-span-2 text-center py-4">
          <p className="font-body text-xs text-blush-300">
            No variants or fragrances. Edit the product to enable has_variants,
            or run the fragrance seed SQL for candles.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────
export default function AdminProductsDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | "candles" | "crafts">(
    "all",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null | "new">(null);
  const { toasts, show } = useToast();
  const { confirm, Dialog } = useConfirm();

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, fRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/fragrances"),
      ]);
      const pData = await pRes.json();
      const fData = await fRes.json();
      setProducts(pData.products ?? []);
      setFragrances(fData.fragrances ?? []);
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // stable — intentionally no deps, fetches once on mount

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Product CRUD ───────────────────────────────────────────────
  const handleSaveProduct = async (data: Partial<Product>, isNew: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      if (isNew) {
        setProducts((p) => [result.product, ...p]);
      } else {
        setProducts((p) =>
          p.map((x) => (x.id === data.id ? { ...x, ...result.product } : x)),
        );
      }
      show(isNew ? "Product created!" : "Product updated!");
      setEditProduct(null);
    } catch (e) {
      show((e as Error).message || "Save failed", "err");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const ok = await confirm(
      `Delete "${product.name}"? This will also remove all its variants.`,
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

  const handleStockUpdate = async (productId: string, stock: number) => {
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

  // ── Variant CRUD ───────────────────────────────────────────────
  const handleVariantUpdate = async (id: string, data: Partial<Variant>) => {
    try {
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
    } catch {
      show("Variant update failed", "err");
    }
  };

  const handleVariantDelete = async (id: string) => {
    const ok = await confirm("Delete this variant?");
    if (!ok) return;
    try {
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
    } catch {
      show("Delete failed", "err");
    }
  };

  const handleVariantAdd = async (
    variantData: Omit<Variant, "id" | "is_out_of_stock">,
  ) => {
    try {
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
    } catch {
      show("Add variant failed", "err");
    }
  };

  // ── Fragrance toggle ───────────────────────────────────────────
  const handleFragranceToggle = async (
    productId: string,
    fragranceId: string,
    available: boolean,
  ) => {
    try {
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
    } catch {
      show("Toggle failed", "err");
    }
  };

  // ── Filtered list ──────────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchCat = catFilter === "all" || p.category === catFilter;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // ── Stock inline editor ────────────────────────────────────────
  function StockEditor({ product }: { product: Product }) {
    const [val, setVal] = useState(product.stock);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (editing) inputRef.current?.focus();
    }, [editing]);

    const save = () => {
      if (val !== product.stock) handleStockUpdate(product.id, val);
      setEditing(false);
    };

    return editing ? (
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          type="number"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          min={0}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-16 px-2 py-1 border-2 border-blush-300 rounded-lg font-body text-sm text-blush-800 focus:outline-none"
        />
      </div>
    ) : (
      <button
        onClick={() => setEditing(true)}
        className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-lg border font-body text-xs font-semibold transition-colors hover:border-blush-300",
          val === 0
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-green-50 border-green-200 text-green-700",
        )}
      >
        {val === 0 ? "Out of Stock" : `Stock: ${val}`}
        <Pencil size={9} className="opacity-50" />
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-blush-50 py-8 px-4 sm:px-6 lg:px-8">
      {Dialog}

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-4 z-[300] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-body animate-fade-up pointer-events-auto",
              t.type === "ok"
                ? "bg-white border-blush-200 text-blush-800"
                : "bg-red-50 border-red-200 text-red-800",
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-light text-blush-900">
              Products
            </h1>
            <p className="font-body text-sm text-blush-400 mt-1">
              {products.length} products ·{" "}
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
              className="flex items-center gap-2 px-3 py-2.5 bg-white border border-blush-200 text-blush-500 font-body text-sm rounded-xl hover:bg-blush-50 transition-colors"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setEditProduct("new")}
              className="flex items-center gap-2 px-5 py-2.5 bg-blush-400 hover:bg-blush-500 text-white font-body text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
              <Plus size={15} /> Add Product
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white border border-blush-200 rounded-xl">
            <Search size={14} className="text-blush-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or tags…"
              className="flex-1 bg-transparent font-body text-sm text-blush-700 placeholder-blush-300 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "candles", "crafts"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={cn(
                  "px-4 py-2.5 font-body text-sm rounded-xl border transition-all capitalize",
                  catFilter === cat
                    ? "bg-blush-400 text-white border-blush-400 shadow-sm"
                    : "bg-white text-blush-600 border-blush-200 hover:border-blush-300",
                )}
              >
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw
              size={24}
              className="animate-spin text-blush-300 mx-auto mb-3"
            />
            <p className="font-body text-sm text-blush-400">
              Loading products…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-blush-100">
            <Package size={32} className="text-blush-200 mx-auto mb-3" />
            <p className="font-accent text-blush-400">No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => {
              const isExpanded = expandedId === product.id;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-blush-100 overflow-hidden transition-all"
                >
                  {/* Main row */}
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-blush-50 shrink-0 border border-blush-100">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="text-[8px] font-body font-bold text-red-500 text-center px-1">
                              OUT OF
                              <br />
                              STOCK
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-accent text-base font-semibold text-blush-900 truncate">
                                {product.name}
                              </h3>
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-body font-semibold uppercase tracking-wide",
                                  product.category === "candles"
                                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                                    : "bg-pink-50 text-pink-600 border border-pink-200",
                                )}
                              >
                                {product.category}
                              </span>
                            </div>
                            <p className="font-body text-xs text-blush-400 mt-0.5 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                          {/* Price */}
                          <div className="text-right shrink-0">
                            <p className="font-display text-lg font-semibold text-blush-700">
                              ₹{product.price}
                            </p>
                            {product.discount_pct > 0 && (
                              <span className="font-body text-[10px] text-green-600 font-semibold">
                                {15 + product.discount_pct}% off
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Second row: stock + toggles + actions */}
                        <div className="flex items-center gap-2 flex-wrap mt-2.5">
                          <StockEditor product={product} />

                          {/* Featured toggle */}
                          <button
                            onClick={() =>
                              handleToggle(
                                product.id,
                                "is_featured",
                                !product.is_featured,
                              )
                            }
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-body font-semibold transition-colors",
                              product.is_featured
                                ? "bg-amber-50 border-amber-200 text-amber-600"
                                : "bg-blush-50 border-blush-200 text-blush-400 hover:border-blush-300",
                            )}
                          >
                            <Star size={9} /> Featured
                          </button>

                          {/* New arrival toggle */}
                          <button
                            onClick={() =>
                              handleToggle(
                                product.id,
                                "is_new_arrival",
                                !product.is_new_arrival,
                              )
                            }
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-body font-semibold transition-colors",
                              product.is_new_arrival
                                ? "bg-purple-50 border-purple-200 text-purple-600"
                                : "bg-blush-50 border-blush-200 text-blush-400 hover:border-blush-300",
                            )}
                          >
                            <Sparkles size={9} /> New Arrival
                          </button>

                          {/* Variant/fragrance count */}
                          {product.has_variants && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-blush-50 border border-blush-200 rounded-lg text-[10px] font-body text-blush-500">
                              <Layers size={9} />{" "}
                              {product.product_variants?.length ?? 0} variants
                            </span>
                          )}
                          {(product.product_fragrances?.length ?? 0) > 0 && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-blush-50 border border-blush-200 rounded-lg text-[10px] font-body text-blush-500">
                              <Flame size={9} />{" "}
                              {product.product_fragrances!.length} scents
                            </span>
                          )}

                          {/* Tags */}
                          {product.tags?.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-blush-50 text-blush-400 text-[9px] font-body rounded-full border border-blush-100"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blush-50">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blush-50 border border-blush-200 text-blush-600 text-xs font-body rounded-lg hover:bg-blush-100 transition-colors"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : product.id)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blush-50 border border-blush-200 text-blush-600 text-xs font-body rounded-lg hover:bg-blush-100 transition-colors"
                      >
                        <Layers size={11} />
                        {isExpanded ? "Hide" : "Variants & Fragrances"}
                        {isExpanded ? (
                          <ChevronUp size={10} />
                        ) : (
                          <ChevronDown size={10} />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          window.open(`/product/${product.id}`, "_blank")
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blush-50 border border-blush-200 text-blush-600 text-xs font-body rounded-lg hover:bg-blush-100 transition-colors"
                      >
                        <Eye size={11} /> View
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-500 text-xs font-body rounded-lg hover:bg-red-100 transition-colors ml-auto"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded variants/fragrances */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <ProductExpandedPanel
                        product={product}
                        onVariantUpdate={handleVariantUpdate}
                        onVariantDelete={handleVariantDelete}
                        onVariantAdd={handleVariantAdd}
                        onFragranceToggle={handleFragranceToggle}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product form modal */}
      {editProduct !== null && (
        <ProductFormModal
          product={editProduct === "new" ? null : editProduct}
          allFragrances={fragrances}
          onSave={handleSaveProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
}
