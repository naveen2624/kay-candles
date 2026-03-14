import CategoryPageLayout from '@/components/CategoryPageLayout';
import { getMockProductsByCategory } from '@/utils/mockData';

export const metadata = {
  title: 'Pipecleaner Flowers & Crafts | Kay Candles and Craft',
  description: 'Explore our handmade pipecleaner flowers and unique crafts.',
};

export default async function CraftsPage() {
  // In production: const products = await getProducts('crafts');
  const products = getMockProductsByCategory('crafts');

  return (
    <CategoryPageLayout
      category="crafts"
      title="Flowers & Crafts"
      subtitle="Handcrafted blooms that never fade"
      products={products}
      bannerImage="https://images.unsplash.com/photo-1487530811015-780780169c0a?w=1200&q=80"
    />
  );
}
