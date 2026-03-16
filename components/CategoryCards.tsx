// components/CategoryCards.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const categories = [
  {
    title: "Scented Candles",
    subtitle: "Hand-poured • Soy Wax • Artisan",
    description:
      "Discover our collection of luxury scented candles crafted with premium soy wax and natural fragrances.",
    href: "/candles",
    image:
      "https://xcqewrligvirqwcebcyc.supabase.co/storage/v1/object/public/kaycandlesproducts/candles/candlecollection.jpeg",
    accent: "from-blush-300/80 to-blush-500/80",
    count: "12+ fragrances",
  },
  {
    title: "Pipecleaner Flowers & Crafts",
    subtitle: "Handmade • Unique • Forever Blooms",
    description:
      "Handcrafted flowers that never wilt — beautiful, colorful, and made with love for every space.",
    href: "/crafts",
    image:
      "https://xcqewrligvirqwcebcyc.supabase.co/storage/v1/object/public/kaycandlesproducts/pipecleanercrafts/pipecleanercollection.jpeg",
    accent: "from-rose-300/80 to-rose-500/80",
    count: "8+ designs",
  },
];

export default function CategoryCards() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-3">
            Our Collections
          </p>
          <h2 className="font-display text-5xl font-light text-blush-900">
            Shop by Category
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative h-[420px] rounded-3xl overflow-hidden block card-hover"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Background image */}
              <Image
                src={cat.image}
                alt={cat.title}
                height={480}
                width={480}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 blur-none group-hover:blur-sm"
              />

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.accent} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full font-body text-[11px] text-white tracking-widest uppercase">
                    {cat.count}
                  </span>
                </div>
                <h3 className="font-display text-4xl font-medium text-white leading-tight mb-2">
                  {cat.title}
                </h3>
                <p className="font-body text-sm text-white/80 leading-relaxed mb-4 max-w-xs">
                  {cat.description}
                </p>
                <div className="flex items-center gap-2 text-white font-body text-sm font-medium group-hover:gap-4 transition-all duration-200">
                  Explore Collection
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
