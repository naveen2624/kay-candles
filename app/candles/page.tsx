import CategoryPageLayout from '@/components/CategoryPageLayout';
import { getMockProductsByCategory } from '@/utils/mockData';

export const metadata = {
  title: 'Scented Candles | Kay Candles and Craft',
  description: 'Browse our collection of handcrafted scented soy candles.',
};

export default async function CandlesPage() {
  // In production: const products = await getProducts('candles');
  const products = getMockProductsByCategory('candles');

  return (
    <CategoryPageLayout
      category="candles"
      title="Scented Candles"
      subtitle="Hand-poured with love, fragranced with nature"
      products={products}
      bannerImage="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=1200&q=80"
    />
  );
}
