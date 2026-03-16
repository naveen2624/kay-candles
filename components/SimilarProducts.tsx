// components/SimilarProducts.tsx
import { Product } from "@/lib/supabase";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  title?: string;
};

export default function SimilarProducts({
  products,
  title = "Similar Products",
}: Props) {
  if (!products.length) return null;

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-3">
            Explore More
          </p>
          <h2 className="font-display text-4xl font-light text-blush-900">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
