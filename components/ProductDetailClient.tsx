"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  ChevronRight,
  Star,
  Truck,
  RefreshCw,
  Shield,
  AlertCircle,
  Tag,
  Send,
  Loader2,
} from "lucide-react";
import {
  Product,
  ProductVariant,
  Review,
  getReviewsForProduct,
  addReview,
  getTotalDiscountPct,
  getOriginalPrice,
  DEFAULT_DISCOUNT_PCT,
} from "@/lib/supabase";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "./ToastProvider";
import { cn } from "@/utils/cn";

type Props = { product: Product };

export default function ProductDetailClient({ product }: Props) {
  const hasVariants =
    product.has_variants && (product.variants?.length ?? 0) > 0;
  const hasFragrances = (product.fragrances?.length ?? 0) > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedFragrance, setSelectedFragrance] = useState<string | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [attemptedAdd, setAttemptedAdd] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();

  const displayImage = selectedVariant?.image_url ?? product.image_url;
  const categoryLabel =
    product.category === "candles" ? "Scented Candles" : "Flowers & Crafts";
  const categoryHref = product.category === "candles" ? "/candles" : "/crafts";
  const totalDiscount = getTotalDiscountPct(product);
  const originalPrice = getOriginalPrice(product);

  // Check if selected variant is out of stock
  const variantOutOfStock = selectedVariant?.is_out_of_stock ?? false;
  const productOutOfStock = product.stock <= 0;
  const isOutOfStock = hasVariants ? variantOutOfStock : productOutOfStock;

  useEffect(() => {
    getReviewsForProduct(product.id)
      .then(setReviews)
      .catch(() => {});
  }, [product.id]);

  const avgRating = reviews.length
    ? Math.round(
        (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10,
      ) / 10
    : 0;

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      setAttemptedAdd(true);
      showToast("Please choose a variant first", "error");
      return;
    }
    if (hasFragrances && !selectedFragrance) {
      setAttemptedAdd(true);
      showToast("Please choose a fragrance first", "error");
      return;
    }
    if (isOutOfStock) {
      showToast("This item is currently out of stock", "error");
      return;
    }

    const cartEntry = {
      id: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantName: selectedVariant?.name ?? selectedFragrance ?? undefined,
      price: product.price,
      image_url: displayImage,
      category: product.category,
    };

    for (let i = 0; i < quantity; i++) addItem(cartEntry);
    showToast(
      `${product.name}${selectedVariant ? ` (${selectedVariant.name})` : selectedFragrance ? ` — ${selectedFragrance}` : ""} added to cart!`,
    );
    openCart();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    setSubmittingReview(true);
    try {
      await addReview({ product_id: product.id, ...reviewForm });
      setReviewSubmitted(true);
      setReviewForm({ name: "", rating: 5, comment: "" });
      showToast("Review submitted! It will appear after approval.", "success");
    } catch {
      showToast("Failed to submit review. Please try again.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-xs font-body text-blush-400">
        <Link href="/" className="hover:text-blush-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href={categoryHref}
          className="hover:text-blush-600 transition-colors"
        >
          {categoryLabel}
        </Link>
        <ChevronRight size={12} />
        <span className="text-blush-600 truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* ── Image panel ── */}
        <div className="space-y-4">
          <div
            className={cn(
              "relative h-[480px] rounded-3xl overflow-hidden bg-blush-50 border border-blush-100",
              isOutOfStock &&
                "after:absolute after:inset-0 after:bg-white/50 after:z-10",
            )}
          >
            <Image
              src={displayImage}
              alt={
                selectedVariant
                  ? `${product.name} – ${selectedVariant.name}`
                  : product.name
              }
              fill
              className={cn(
                "object-cover transition-all duration-500",
                isOutOfStock && "grayscale",
              )}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full">
                  <span className="font-accent text-sm font-semibold text-gray-500">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}
            {selectedVariant && !isOutOfStock && (
              <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-blush-100">
                <span className="font-body text-xs text-blush-700 font-medium">
                  {selectedVariant.name}
                </span>
              </div>
            )}
            {/* Discount badge */}
            {totalDiscount > 0 && (
              <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5">
                <span className="px-3 py-1.5 bg-blush-400 text-white text-xs font-body font-bold rounded-full shadow-sm">
                  {totalDiscount}% OFF
                </span>
                {product.discount_label && (
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-blush-600 text-[10px] font-body font-semibold rounded-full border border-blush-100">
                    {product.discount_label}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Variant thumbnails */}
          {hasVariants && (
            <div className="grid grid-cols-5 gap-2">
              {product.variants!.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    setAttemptedAdd(false);
                  }}
                  disabled={v.is_out_of_stock}
                  className={cn(
                    "relative h-16 rounded-xl overflow-hidden border-2 transition-all duration-200",
                    v.is_out_of_stock
                      ? "border-gray-200 opacity-50 cursor-not-allowed grayscale"
                      : selectedVariant?.id === v.id
                        ? "border-blush-400 scale-105 shadow-md shadow-blush-200"
                        : "border-blush-100 hover:border-blush-300 opacity-80 hover:opacity-100",
                  )}
                  title={
                    v.is_out_of_stock ? `${v.name} — Out of Stock` : v.name
                  }
                >
                  <Image
                    src={v.image_url}
                    alt={v.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {v.is_out_of_stock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                      <span className="text-[8px] font-body text-gray-500 font-semibold text-center px-1">
                        Out of Stock
                      </span>
                    </div>
                  )}
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
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={cn(
                        s <= Math.round(avgRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200",
                      )}
                    />
                  ))}
                </div>
                <span className="font-body text-xs text-blush-400">
                  {avgRating} ({reviews.length} review
                  {reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-1">
              {product.discount_desc && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blush-50 border border-blush-100 rounded-xl mb-2">
                  <Tag size={12} className="text-blush-400 shrink-0" />
                  <p className="font-body text-xs text-blush-600">
                    {product.discount_desc}
                  </p>
                </div>
              )}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-semibold text-blush-700">
                  ₹{product.price}
                </span>
                <span className="font-body text-sm text-blush-400 line-through">
                  ₹{originalPrice}
                </span>
                {totalDiscount > 0 && (
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-body font-semibold rounded-full">
                    Save {totalDiscount}%
                  </span>
                )}
              </div>
              {product.discount_pct > 0 && (
                <p className="font-body text-[11px] text-blush-400">
                  {DEFAULT_DISCOUNT_PCT}% base + {product.discount_pct}% extra ={" "}
                  {totalDiscount}% total discount
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-5 bg-blush-50/80 border border-blush-100 rounded-2xl">
            <p className="font-body text-sm text-blush-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Out of stock banner */}
          {isOutOfStock && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <AlertCircle size={16} className="text-gray-400 shrink-0" />
              <div>
                <p className="font-body text-sm font-semibold text-gray-600">
                  Currently Out of Stock
                </p>
                <p className="font-body text-xs text-gray-400 mt-0.5">
                  {hasVariants ? "This variant is" : "This product is"}{" "}
                  temporarily unavailable. Check back soon or contact us on
                  WhatsApp!
                </p>
              </div>
            </div>
          )}

          {/* ── Variant picker ── */}
          {hasVariants && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-body text-sm text-blush-700 font-semibold">
                  Choose Variant
                  {selectedVariant && (
                    <span className="ml-2 font-normal text-blush-400">
                      — {selectedVariant.name}
                    </span>
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
                    onClick={() => {
                      setSelectedVariant(v);
                      setAttemptedAdd(false);
                    }}
                    disabled={v.is_out_of_stock}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200 group",
                      v.is_out_of_stock
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                        : selectedVariant?.id === v.id
                          ? "border-blush-400 bg-blush-50 shadow-sm"
                          : attemptedAdd
                            ? "border-red-200 hover:border-blush-300"
                            : "border-blush-100 hover:border-blush-300",
                    )}
                  >
                    <div
                      className={cn(
                        "relative w-full h-16 rounded-lg overflow-hidden",
                        v.is_out_of_stock && "grayscale",
                      )}
                    >
                      <Image
                        src={v.image_url}
                        alt={v.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="100px"
                      />
                    </div>
                    <span
                      className={cn(
                        "font-body text-[11px] font-medium text-center leading-tight",
                        v.is_out_of_stock
                          ? "text-gray-400"
                          : selectedVariant?.id === v.id
                            ? "text-blush-700"
                            : "text-blush-500",
                      )}
                    >
                      {v.name}
                    </span>
                    {v.is_out_of_stock && (
                      <span className="font-body text-[9px] text-gray-400">
                        Out of stock
                      </span>
                    )}
                    {selectedVariant?.id === v.id && !v.is_out_of_stock && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blush-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-[8px]">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Fragrance picker (candles) ── */}
          {hasFragrances && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-body text-sm text-blush-700 font-semibold">
                  Choose Fragrance
                  {selectedFragrance && (
                    <span className="ml-2 font-normal text-blush-400">
                      — {selectedFragrance}
                    </span>
                  )}
                </label>
                {attemptedAdd && !selectedFragrance && (
                  <span className="flex items-center gap-1 text-xs text-red-500 font-body">
                    <AlertCircle size={12} /> Please select one
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.fragrances!.map((pf) => (
                  <button
                    key={pf.fragrance_id}
                    onClick={() => {
                      if (pf.is_available) {
                        setSelectedFragrance(pf.fragrance.name);
                        setAttemptedAdd(false);
                      }
                    }}
                    disabled={!pf.is_available}
                    className={cn(
                      "px-4 py-2 rounded-full border-2 font-body text-xs font-medium transition-all duration-200",
                      !pf.is_available
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed grayscale line-through"
                        : selectedFragrance === pf.fragrance.name
                          ? "border-blush-400 bg-blush-50 text-blush-700 shadow-sm"
                          : attemptedAdd
                            ? "border-red-200 text-blush-600 hover:border-blush-300"
                            : "border-blush-100 text-blush-600 hover:border-blush-300 hover:bg-blush-50",
                    )}
                  >
                    {pf.fragrance.name}
                    {!pf.is_available && (
                      <span className="ml-1 text-[9px] font-normal">
                        (Out of stock)
                      </span>
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
                {product.price >= 999
                  ? "Free delivery on this order!"
                  : "Free delivery above ₹999"}
              </p>
              <p className="font-body text-[11px] text-green-600 mt-0.5">
                Delivered within 3–5 business days
              </p>
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="font-body text-sm text-blush-600 font-medium">
                Quantity
              </label>
              <div className="flex items-center gap-3 bg-blush-50 border border-blush-200 rounded-full px-1 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-100 transition-colors font-bold text-lg leading-none"
                >
                  −
                </button>
                <span className="w-8 text-center font-body text-blush-800 font-medium">
                  {quantity}
                </span>
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
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-white font-body font-medium rounded-2xl transition-all duration-200 group",
                  isOutOfStock
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : (hasVariants && !selectedVariant) ||
                        (hasFragrances && !selectedFragrance)
                      ? "bg-blush-300 cursor-pointer hover:bg-blush-400"
                      : "bg-blush-400 hover:bg-blush-500 hover:shadow-lg hover:shadow-blush-200",
                )}
              >
                <ShoppingBag size={18} />
                {isOutOfStock
                  ? "Out of Stock"
                  : hasVariants && !selectedVariant
                    ? "Select a Variant First"
                    : hasFragrances && !selectedFragrance
                      ? "Select a Fragrance First"
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
              { icon: Truck, label: "Fast Delivery" },
              { icon: RefreshCw, label: "Easy Returns" },
              { icon: Shield, label: "Secure Order" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-1.5 p-3 bg-blush-50 rounded-xl border border-blush-100"
              >
                <badge.icon size={16} className="text-blush-400" />
                <span className="font-body text-[10px] text-blush-500 text-center">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div className="mt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-light text-blush-900">
              Customer Reviews
            </h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={cn(
                        s <= Math.round(avgRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200",
                      )}
                    />
                  ))}
                </div>
                <span className="font-body text-sm text-blush-500">
                  {avgRating} average from {reviews.length} review
                  {reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-blush-50 rounded-2xl border border-blush-100 mb-8">
            <p className="font-accent text-blush-400 mb-1">No reviews yet</p>
            <p className="font-body text-xs text-blush-300">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 bg-white rounded-2xl border border-blush-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-body text-sm font-semibold text-blush-800">
                      {review.name}
                    </p>
                    <p className="font-body text-[11px] text-blush-400">
                      {new Date(review.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <Star
                        key={s}
                        size={12}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="font-body text-sm text-blush-600 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Review form */}
        <div className="bg-blush-50 rounded-2xl border border-blush-100 p-6">
          <h3 className="font-accent text-lg font-semibold text-blush-800 mb-4">
            Write a Review
          </h3>
          {reviewSubmitted ? (
            <div className="text-center py-4">
              <p className="font-body text-sm text-green-600 font-medium">
                ✓ Review submitted! Thanks for your valueble Review.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-blush-600 font-medium block mb-1.5">
                    Your Name *
                  </label>
                  <input
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-blush-200 rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-blush-600 font-medium block mb-1.5">
                    Rating *
                  </label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setReviewForm((p) => ({ ...p, rating: s }))
                        }
                      >
                        <Star
                          size={24}
                          className={cn(
                            "transition-colors",
                            s <= reviewForm.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-blush-600 font-medium block mb-1.5">
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, comment: e.target.value }))
                  }
                  placeholder="Share your experience with this product…"
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-blush-200 rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="flex items-center gap-2 px-6 py-2.5 bg-blush-400 hover:bg-blush-500 text-white font-body text-sm font-medium rounded-full transition-colors disabled:bg-blush-200"
              >
                {submittingReview ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {submittingReview ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
