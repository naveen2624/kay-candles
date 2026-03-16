// components/Footer.tsx
import Link from "next/link";
import { Instagram, Mail, Phone, Heart, Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-blush-100 mt-20">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush-200 to-blush-400 flex items-center justify-center">
                <Flame size={16} className="text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-blush-800">
                Kay Candles and Craft
              </span>
            </div>
            <p className="font-body text-sm text-blush-500 leading-relaxed max-w-xs">
              Handcrafted with love in every pour and twist. Each piece is made
              to bring warmth, beauty, and joy to your space.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center text-blush-500 hover:bg-blush-200 hover:text-blush-700 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://wa.me/919787174450"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center text-blush-500 hover:bg-blush-200 hover:text-blush-700 transition-all"
                aria-label="WhatsApp"
              >
                <Phone size={17} />
              </a>
              <a
                href="mailto:hello@kaycandles.com"
                className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center text-blush-500 hover:bg-blush-200 hover:text-blush-700 transition-all"
                aria-label="Email"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div className="space-y-4">
            <h4 className="font-accent text-sm font-semibold text-blush-800 uppercase tracking-widest">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/candles", label: "Scented Candles" },
                { href: "/crafts", label: "Pipecleaner Flowers" },
                { href: "/crafts", label: "Gift Sets" },
                { href: "/search?q=new", label: "New Arrivals" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-blush-500 hover:text-blush-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info & Contact */}
          <div className="space-y-4">
            <h4 className="font-accent text-sm font-semibold text-blush-800 uppercase tracking-widest">
              Info
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/" },
                { label: "Shipping Policy", href: "/" },
                { label: "Return Policy", href: "/" },
                { label: "Contact Us", href: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-blush-500 hover:text-blush-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2 space-y-1.5">
              <p className="font-body text-xs text-blush-400 flex items-center gap-2">
                <Phone size={12} />
                +91 97871 74450
              </p>
              <p className="font-body text-xs text-blush-400 flex items-center gap-2">
                <Mail size={12} />
                hello@kaycandles.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blush-50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-blush-300">
            © {new Date().getFullYear()} Kay Candles and Craft. All rights
            reserved.
          </p>
          <p className="font-body text-xs text-blush-300 flex items-center gap-1">
            Made with{" "}
            <Heart size={10} className="text-blush-400 fill-blush-400" /> by
            hand
          </p>
        </div>
      </div>
    </footer>
  );
}
