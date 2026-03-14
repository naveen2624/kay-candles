import HeroSection from '@/components/HeroSection';
import CategoryCards from '@/components/CategoryCards';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewArrivals from '@/components/NewArrivals';
import BrandStory from '@/components/BrandStory';
import { getFeaturedProducts, getNewArrivals } from '@/lib/supabase';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(8).catch(() => []),
    getNewArrivals(4).catch(() => []),
  ]);

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
