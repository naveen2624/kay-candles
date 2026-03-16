// app/candles/page.tsx
import CategoryPageLayout from "@/components/CategoryPageLayout";
import { getProducts } from "@/lib/supabase";

export const revalidate = 60;

export const metadata = {
  title: "Scented Candles | Kay Candles and Craft",
  description: "Browse our collection of handcrafted scented soy candles.",
};

export default async function CandlesPage() {
  const products = await getProducts("candles").catch(() => []);

  return (
    <CategoryPageLayout
      category="candles"
      title="Scented Candles"
      subtitle="Hand-poured with love, fragranced with nature"
      products={products}
      bannerImage="https://xcqewrligvirqwcebcyc.supabase.co/storage/v1/object/public/kaycandlesproducts/candles/candlecollection.jpeg"
    />
  );
}
