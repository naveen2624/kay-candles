// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Kay Candles and Craft",
  description:
    "Handcrafted scented candles and beautiful pipecleaner flowers. Artisan crafts made with love.",
  keywords:
    "candles, scented candles, pipecleaner flowers, handmade crafts, artisan",
  openGraph: {
    title: "Kay Candles and Craft",
    description:
      "Handcrafted scented candles and beautiful pipecleaner flowers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-blush-50">
        <ToastProvider>
          <Navbar />
          <CartDrawer />
          <main className="pt-16">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
