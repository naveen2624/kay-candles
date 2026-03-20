"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Package, Flame, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-56 bg-slate-900 flex flex-col shrink-0 fixed top-0 left-0 bottom-0 z-40">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shrink-0">
            <Flame size={14} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">
              Kay Candles
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <ExternalLink size={12} />
          View Store
        </Link>
      </div>
    </aside>
  );
}
