import HeroSection from '@/components/HeroSection';
import CategoryCards from '@/components/CategoryCards';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewArrivals from '@/components/NewArrivals';
import BrandStory from '@/components/BrandStory';
import { mockProducts } from '@/utils/mockData';

export default async function HomePage() {
  // In production, replace with Supabase queries:
  // const featured = await getFeaturedProducts(8);
  // const newArrivals = await getNewArrivals(4);
  
  const featured = mockProducts.slice(0, 8);
  const newArrivals = mockProducts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <CategoryCards />
      <FeaturedProducts products={featured} />
      <BrandStory />
      <NewArrivals products={newArrivals} />
    </div>
  );
}
