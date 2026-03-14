import { Product } from "@/lib/supabase";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type Props = { products: Product[] };

export default function NewArrivals({ products }: Props) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-blush-400" />
            <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] font-medium">
              Just Landed
            </p>
            <Sparkles size={14} className="text-blush-400" />
          </div>
          <h2 className="font-display text-5xl font-light text-blush-900">
            New Arrivals
          </h2>
          <p className="font-body text-blush-500 mt-3 max-w-md mx-auto text-sm">
            Fresh from the workshop — be the first to discover our latest
            creations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/search?q=new"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blush-50 border border-blush-200 text-blush-600 font-body text-sm font-medium rounded-full hover:bg-blush-100 transition-colors group"
          >
            See all new arrivals
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
