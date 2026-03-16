// components/BrandStory.tsx
import { Heart, Leaf, Star } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every candle and craft is handmade by Kay with care and attention to detail.",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description:
      "We use only premium soy wax, natural fragrances, and eco-friendly materials.",
  },
  {
    icon: Star,
    title: "Unique Designs",
    description:
      "Each piece is one-of-a-kind — no two are exactly alike, just like you.",
  },
];

export default function BrandStory() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image composition */}
          <div className="relative h-[480px] hidden lg:block">
            <div className="absolute top-0 left-0 w-72 h-72 rounded-[2rem] overflow-hidden shadow-xl shadow-blush-100">
              <Image
                src="https://images.unsplash.com/photo-1574325485470-ab92efe7b6a3?w=600&q=80"
                height={120}
                width={120}
                alt="Candle making process"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-[2rem] overflow-hidden shadow-xl shadow-blush-100">
              <Image
                src="https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=500&q=80"
                height={120}
                width={120}
                alt="Handmade crafts"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-48 h-48 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80"
                height={120}
                width={120}
                alt="Gift set"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating quote */}
            <div className="absolute bottom-16 left-4 bg-blush-50 border border-blush-100 rounded-2xl px-5 py-4 shadow-sm max-w-[200px]">
              <p className="font-display text-sm italic text-blush-600 leading-relaxed">
                &ldquo;Crafting joy, one piece at a time&rdquo;
              </p>
              <p className="font-body text-[11px] text-blush-400 mt-1">— Kay</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-4">
                Our Story
              </p>
              <h2 className="font-display text-5xl font-light text-blush-900 leading-tight mb-6">
                Born from a passion for
                <em className="italic text-blush-400 block">handmade beauty</em>
              </h2>
              <p className="font-body text-blush-600 leading-relaxed mb-4">
                Kay Candles and Craft started as a kitchen-table hobby, pouring
                candles and twisting pipecleaners for friends and family. What
                began as a labor of love grew into something beautiful.
              </p>
              <p className="font-body text-blush-500 leading-relaxed text-sm">
                Every product you see is handcrafted by me — no factory, no
                shortcuts, just honest artisan work. I believe beautiful things
                shouldn&apos;t cost a fortune, and handmade gifts carry a warmth
                that mass-produced items never can.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-5">
              {values.map((value) => (
                <div key={value.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center shrink-0">
                    <value.icon size={18} className="text-blush-500" />
                  </div>
                  <div>
                    <h4 className="font-accent text-sm font-semibold text-blush-800 mb-1">
                      {value.title}
                    </h4>
                    <p className="font-body text-xs text-blush-500 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
