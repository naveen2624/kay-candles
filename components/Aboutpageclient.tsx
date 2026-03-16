//components/Aboutpageclient.tsx
import Link from "next/link";
import { Heart, Leaf, Star, Flame, ArrowRight, Sparkles } from "lucide-react";

const timeline = [
  {
    year: "2021",
    title: "The First Pour",
    description:
      "Kay started making candles in her kitchen — gifting them to friends and family who kept asking for more.",
  },
  {
    year: "2022",
    title: "Pipecleaner Blooms",
    description:
      "The craft side was born when Kay began twisting pipecleaner flowers that would never wilt — a permanent little joy.",
  },
  {
    year: "2023",
    title: "Going Online",
    description:
      "Word spread on Instagram. Orders started coming in from across India and Kay Candles and Craft officially launched.",
  },
  {
    year: "2024",
    title: "Growing with Love",
    description:
      "Still every piece handmade, still every order packed with care. No factories, no shortcuts — just Kay and her craft.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Handmade Always",
    description:
      "Every single product is made by hand. No machines, no mass production — just careful, loving craftsmanship.",
  },
  {
    icon: Leaf,
    title: "Clean Ingredients",
    description:
      "We use premium soy wax, natural fragrance oils, and cotton wicks. Nothing harmful, nothing artificial.",
  },
  {
    icon: Star,
    title: "Unique Every Time",
    description:
      "Because each piece is handmade, no two are identical. You get something truly one-of-a-kind.",
  },
  {
    icon: Flame,
    title: "Made with Intention",
    description:
      "Every candle is poured with the intention that it will bring warmth and calm into your everyday life.",
  },
];

export default function AboutPageClient() {
  return (
    <div className="min-h-screen bg-blush-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white pt-20 pb-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blush-100/60 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blush-200/40 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="pb-20 pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blush-50 border border-blush-200 rounded-full mb-6">
                <Sparkles size={12} className="text-blush-400" />
                <span className="font-body text-xs text-blush-500 tracking-widest uppercase font-medium">
                  Our Story
                </span>
              </div>
              <h1 className="font-display text-6xl sm:text-7xl font-light text-blush-900 leading-[0.95] mb-6">
                Made by hand,
                <em className="italic text-blush-400 block mt-1">with love</em>
              </h1>
              <p className="font-body text-blush-600 text-lg leading-relaxed max-w-md mb-8">
                Kay Candles and Craft started as a quiet hobby and grew into
                something beautiful — a small business built on the belief that
                handmade things carry a warmth that nothing else can.
              </p>
              <Link
                href="/candles"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blush-200 group"
              >
                Shop the Collection
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Image collage */}
            <div className="hidden lg:block relative h-[540px]">
              <div className="absolute top-0 right-0 w-72 h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blush-200/50">
                <img
                  src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&q=80"
                  alt="Kay pouring candles"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-4 w-60 h-64 rounded-[2rem] overflow-hidden shadow-xl shadow-blush-200/40">
                <img
                  src="https://images.unsplash.com/photo-1487530811015-780780169c0a?w=500&q=80"
                  alt="Pipecleaner flowers"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-44 left-24 w-44 h-44 rounded-[1.5rem] overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1608181831718-c9fbe5f36f48?w=400&q=80"
                  alt="Candle close up"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating quote */}
              <div className="absolute bottom-28 right-4 bg-white rounded-2xl shadow-xl border border-blush-100 px-5 py-4 max-w-[190px]">
                <p className="font-display text-sm italic text-blush-500 leading-relaxed">
                  &ldquo;Every piece is poured with intention&rdquo;
                </p>
                <p className="font-body text-[11px] text-blush-400 mt-1.5">
                  — Kay
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* wave */}
        <svg
          viewBox="0 0 1440 60"
          className="w-full fill-blush-50 block -mb-px"
          preserveAspectRatio="none"
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blush-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-3">
              How It Started
            </p>
            <h2 className="font-display text-5xl font-light text-blush-900">
              Our Journey
            </h2>
          </div>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-blush-200 hidden sm:block" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className="flex gap-6 sm:gap-10 items-start animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Year bubble */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-blush-200 flex flex-col items-center justify-center shadow-sm z-10 relative">
                      <span className="font-display text-sm font-semibold text-blush-700 leading-none">
                        {item.year}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-2 pt-3">
                    <h3 className="font-accent text-lg font-semibold text-blush-800 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-blush-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-3">
              What We Stand For
            </p>
            <h2 className="font-display text-5xl font-light text-blush-900">
              Our Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="p-7 bg-blush-50 rounded-2xl border border-blush-100 hover:shadow-md hover:shadow-blush-100 transition-all duration-300 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-white border border-blush-200 flex items-center justify-center mb-5 group-hover:bg-blush-100 transition-colors">
                  <v.icon size={20} className="text-blush-400" />
                </div>
                <h3 className="font-accent text-base font-semibold text-blush-800 mb-2">
                  {v.title}
                </h3>
                <p className="font-body text-sm text-blush-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Kay ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blush-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-blush-100 overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-72 md:h-auto min-h-[320px]">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&q=80"
                  alt="Kay at work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
              </div>

              {/* Text */}
              <div className="p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-5">
                  <div className="w-8 h-px bg-blush-300" />
                  <span className="font-body text-xs text-blush-400 uppercase tracking-widest">
                    Meet the Maker
                  </span>
                </div>
                <h2 className="font-display text-4xl font-light text-blush-900 mb-4">
                  Hi, I&apos;m{" "}
                  <em className="italic text-blush-400">Preethi</em>
                </h2>
                <p className="font-body text-blush-600 text-sm leading-relaxed mb-4">
                  I&apos;m a self-taught candle maker and craft artist based in
                  India. I started making candles because I fell in love with
                  how a single flame could change the energy of a room — and
                  never looked back.
                </p>
                <p className="font-body text-blush-500 text-sm leading-relaxed mb-6">
                  Every product you order is made by me, packed by me, and sent
                  with genuine care. When you buy from Kay Candles and Craft,
                  you&apos;re supporting a one-woman small business — and that
                  means the world.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 font-body text-sm text-blush-500 hover:text-blush-700 transition-colors group w-fit"
                >
                  Say hello
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <Sparkles size={24} className="text-blush-300 mx-auto mb-4" />
          <h2 className="font-display text-5xl font-light text-blush-900 mb-4">
            Ready to find your
            <em className="italic text-blush-400 block">perfect scent?</em>
          </h2>
          <p className="font-body text-blush-500 mb-8 text-sm">
            Browse handcrafted candles and forever-blooming pipecleaner flowers,
            made just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/candles"
              className="px-8 py-3.5 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-full transition-all hover:shadow-lg hover:shadow-blush-200"
            >
              Shop Candles
            </Link>
            <Link
              href="/crafts"
              className="px-8 py-3.5 border border-blush-200 text-blush-600 font-body font-medium rounded-full hover:bg-blush-50 transition-all"
            >
              Shop Crafts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
