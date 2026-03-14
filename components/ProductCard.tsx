"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Layers } from "lucide-react";
import { Product } from "@/lib/supabase";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "./ToastProvider";
import { cn } from "@/utils/cn";

type Props = {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
};

export default function ProductCard({ product, className }: Props) {
  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();

  const hasVariants =
    product.has_variants && (product.variants?.length ?? 0) > 0;
  const variantCount = product.variants?.length ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Products with variants must go to product page to pick a variant
    if (hasVariants) {
      window.location.href = `/product/${product.id}`;
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
    });
    showToast(`${product.name} added to cart!`);
    openCart();
  };

  const isNew =
    Date.now() - new Date(product.created_at).getTime() <
    14 * 24 * 60 * 60 * 1000;

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-blush-100 card-hover block",
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-blush-50">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Variant thumbnails strip (on hover) */}
        {hasVariants && (product.variants?.length ?? 0) > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/30 to-transparent">
            {product.variants!.slice(0, 5).map((v) => (
              <div
                key={v.id}
                className="relative w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0"
                title={v.name}
              >
                <Image
                  src={v.image_url}
                  alt={v.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
            ))}
            {variantCount > 5 && (
              <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-blush-600 text-[9px] font-bold shrink-0">
                +{variantCount - 5}
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="px-2.5 py-1 bg-blush-400 text-white text-[10px] font-body font-semibold tracking-wider uppercase rounded-full">
              New
            </span>
          )}
          {hasVariants && (
            <span className="px-2.5 py-1 bg-white/90 text-blush-600 text-[10px] font-body font-medium rounded-full flex items-center gap-1">
              <Layers size={9} /> {variantCount} options
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-blush-300 hover:text-blush-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Save to wishlist"
        >
          <Heart size={14} />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blush-400/95 hover:bg-blush-500 text-white text-sm font-body font-medium rounded-xl backdrop-blur-sm transition-colors"
          >
            <ShoppingBag size={15} />
            {hasVariants ? "Choose Option" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-1 font-medium">
          {product.category === "candles" ? "Scented Candle" : "Handcraft"}
        </p>
        <h3 className="font-accent text-base font-medium text-blush-900 leading-snug mb-1.5 group-hover:text-blush-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        {hasVariants && (
          <p className="font-body text-[11px] text-blush-400 mb-1.5">
            {product.variants!.map((v) => v.name).join(" · ")}
          </p>
        )}
        <p className="font-body text-xs text-blush-400 leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-blush-700">
            ₹{product.price}
          </span>
          <div className="flex gap-1">
            {product.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-blush-50 text-blush-400 text-[9px] font-body rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
