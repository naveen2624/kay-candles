"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/supabase";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import { SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
// import { cn } from '@/utils/cn';

type Props = {
  category: string;
  title: string;
  subtitle: string;
  products: Product[];
  bannerImage: string;
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function CategoryPageLayout({
  category,
  title,
  subtitle,
  products,
  bannerImage,
}: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(1000);

  const priceMax = Math.max(...products.map((p) => p.price), 1000);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const q = search.toLowerCase();
      return (
        p.price <= maxPrice &&
        (search === "" ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)))
      );
    });

    if (sort === "price_asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return list;
  }, [products, search, sort, maxPrice]);

  const hasFilters = search !== "" || maxPrice < priceMax;

  const clearFilters = () => {
    setSearch("");
    setMaxPrice(priceMax);
    setSort("newest");
  };

  return (
    <div className="min-h-screen bg-blush-50">
      {/* Banner */}
      <div className="relative h-52 sm:h-64 overflow-hidden">
        <Image
          src={bannerImage}
          alt={title}
          height={120}
          width={120}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blush-900/60 via-blush-700/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="font-body text-xs text-blush-100 uppercase tracking-[0.25em] mb-2">
            Collection
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white mb-2">
            {title}
          </h1>
          <p className="font-body text-sm text-white/80">{subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search within category */}
            <div className="w-64">
              <SearchBar size="sm" placeholder={`Search ${category}…`} />
            </div>

            {/* Price filter */}
            <div className="flex items-center gap-2 bg-white border border-blush-200 rounded-full px-4 py-2">
              <SlidersHorizontal size={13} className="text-blush-400" />
              <span className="font-body text-xs text-blush-600">
                Up to ₹{maxPrice}
              </span>
              <input
                type="range"
                min={100}
                max={priceMax}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 accent-pink-400"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs font-body text-blush-500 hover:text-blush-700 transition-colors"
              >
                <X size={13} /> Clear filters
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-blush-400">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="font-body text-xs text-blush-700 bg-white border border-blush-200 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-200"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="font-body text-xs text-blush-400 mb-6">
          Showing {filtered.length} of {products.length} products
        </p>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-accent text-xl text-blush-400 mb-2">
              No products found
            </p>
            <p className="font-body text-sm text-blush-300 mb-5">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-blush-400 text-white font-body text-sm rounded-full hover:bg-blush-500 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
