// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { cn } from "@/utils/cn";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getItemCount, openCart } = useCartStore();
  const router = useRouter();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-blush-100"
            : "bg-blush-50/90 backdrop-blur-sm",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex flex-col leading-none">
                <Image
                  src="/logo.png"
                  alt="Kay Candles & Craft Logo"
                  width={240}
                  height={240}
                  className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors tracking-wide"
              >
                Home
              </Link>
              <Link
                href="/candles"
                className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors tracking-wide"
              >
                Candles
              </Link>
              <Link
                href="/crafts"
                className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors tracking-wide"
              >
                Crafts
              </Link>
              <Link
                href="/about"
                className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors tracking-wide"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors tracking-wide"
              >
                Contact
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-blush-600 hover:text-blush-400 hover:bg-blush-100 rounded-full transition-all"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-blush-600 hover:text-blush-400 hover:bg-blush-100 rounded-full transition-all"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blush-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-blush-600 hover:text-blush-400 hover:bg-blush-100 rounded-full transition-all"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blush-100 bg-white/98 backdrop-blur-md animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/candles", label: "Candles" },
                { href: "/crafts", label: "Crafts" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-body text-blush-700 hover:text-blush-500 py-2 border-b border-blush-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="relative animate-fade-up">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candles, crafts, flowers…"
                className="w-full px-6 py-4 pr-14 bg-white rounded-2xl shadow-2xl border border-blush-100 font-body text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 text-base"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-blush-400 hover:text-blush-600"
              >
                <Search size={20} />
              </button>
            </form>
            <p className="text-center text-white/70 text-xs mt-3 font-body">
              Press ESC to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
