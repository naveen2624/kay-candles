// app/crafts/page.tsx
import CategoryPageLayout from "@/components/CategoryPageLayout";
import { getProducts } from "@/lib/supabase";

export const revalidate = 60;

export const metadata = {
  title: "Pipecleaner Flowers & Crafts | Kay Candles and Craft",
  description: "Explore our handmade pipecleaner flowers and unique crafts.",
};

export default async function CraftsPage() {
  const products = await getProducts("crafts").catch(() => []);

  return (
    <CategoryPageLayout
      category="crafts"
      title="Flowers & Crafts"
      subtitle="Handcrafted blooms that never fade"
      products={products}
      bannerImage="/hero/pipecleanercollection.jpeg"
    />
  );
}
