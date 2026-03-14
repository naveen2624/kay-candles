import { Product } from "@/lib/supabase";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = { products: Product[] };

export default function FeaturedProducts({ products }: Props) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blush-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-3">
              Curated for You
            </p>
            <h2 className="font-display text-5xl font-light text-blush-900">
              Featured Products
            </h2>
          </div>
          <Link
            href="/candles"
            className="hidden sm:flex items-center gap-2 font-body text-sm text-blush-500 hover:text-blush-700 transition-colors group"
          >
            View all
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              className={`animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link
            href="/candles"
            className="inline-flex items-center gap-2 px-6 py-3 border border-blush-300 text-blush-600 font-body text-sm rounded-full hover:bg-blush-100 transition-colors"
          >
            View all products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
