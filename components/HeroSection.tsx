import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SearchBar from "./SearchBar";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-pink-mesh">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blush-200/40 blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blush-300/30 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-cream-200/20 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-blush-200 rounded-full animate-fade-up">
              <Sparkles size={13} className="text-blush-400" />
              <span className="font-body text-xs text-blush-600 tracking-widest uppercase font-medium">
                Handcrafted with Love
              </span>
            </div>

            <div className="animate-fade-up delay-100">
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light text-blush-900 leading-[0.95]">
                <span className="block italic font-medium text-blush-400">
                  Kay
                </span>
                <span className="block">Candles</span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-light text-blush-600 mt-2">
                  & Craft
                </span>
              </h1>
            </div>

            <p className="font-body text-blush-600 text-lg leading-relaxed max-w-md animate-fade-up delay-200">
              Artisan scented candles and handmade pipecleaner flowers — each
              piece crafted to bring warmth and beauty into your everyday.
            </p>

            <div className="animate-fade-up delay-300">
              <SearchBar />
            </div>

            <div className="flex items-center gap-4 animate-fade-up delay-400">
              <Link
                href="/candles"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blush-200 group"
              >
                Shop Candles
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/crafts"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/80 hover:bg-white border border-blush-200 text-blush-700 font-body font-medium rounded-full transition-all duration-200 hover:shadow-md"
              >
                Explore Crafts
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-2 animate-fade-up delay-500">
              {[
                { label: "100%", sub: "Handmade" },
                { label: "Free", sub: "Above ₹999" },
                { label: "Same Day", sub: "Dispatch" },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <p className="font-accent text-sm font-semibold text-blush-700">
                    {badge.label}
                  </p>
                  <p className="font-body text-[11px] text-blush-400 tracking-wide">
                    {badge.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual composition */}
          <div className="hidden lg:block relative h-[560px]">
            {/* Main image */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blush-200/50 animate-fade-up delay-200">
              <Image
                src="/Hero/candlecollection.jpeg"
                height={240}
                width={240}
                alt="Candle Collection"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Secondary image */}
            <div className="absolute bottom-12 left-0 w-60 h-60 rounded-[2rem] overflow-hidden shadow-xl shadow-blush-200/40 animate-fade-up delay-300">
              <Image
                src="/Hero/pipecleanercollection.jpeg"
                height={240}
                width={240}
                alt="Pipecleaner Collection"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Third image */}
            <div className="absolute top-40 left-20 w-44 h-44 rounded-[1.5rem] overflow-hidden shadow-lg shadow-blush-200/40 animate-fade-up delay-400">
              <Image
                src="/Hero/latte.jpeg"
                height={240}
                width={240}
                alt="Latte candle"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-32 right-8 bg-white rounded-2xl shadow-xl border border-blush-100 px-4 py-3 animate-float">
              <p className="font-display text-xs text-blush-400 italic">
                Free delivery
              </p>
              <p className="font-accent text-sm font-semibold text-blush-800">
                Orders above ₹999
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          className="w-full fill-white"
          preserveAspectRatio="none"
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
