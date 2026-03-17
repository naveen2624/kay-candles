import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

const navItems = [
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blush-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-blush-100 flex flex-col shrink-0 fixed top-0 left-0 bottom-0 z-40">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-blush-100">
          <div className="flex items-center gap-2.5">
            <div>
              <p className="font-accent text-sm font-bold text-blush-800 leading-tight">
                Kay Candles
              </p>
              <p className="font-body text-[10px] text-blush-400 leading-tight">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-blush-600 hover:bg-blush-50 hover:text-blush-800 transition-colors group"
            >
              <Icon
                size={16}
                className="text-blush-400 group-hover:text-blush-500 transition-colors"
              />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom link back to store */}
        <div className="px-3 py-4 border-t border-blush-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-body text-xs text-blush-400 hover:text-blush-600 hover:bg-blush-50 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 min-h-screen">{children}</main>
    </div>
  );
}
