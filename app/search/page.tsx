// app/search/page.tsx
import SearchPageClient from "@/components/SearchPageClient";
import { searchProducts, getFeaturedProducts } from "@/lib/supabase";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  return {
    title: q
      ? `Search: "${q}" | Kay Candles and Craft`
      : "Search | Kay Candles and Craft",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [results, featured] = await Promise.all([
    query
      ? searchProducts(query).catch(() => [])
      : getFeaturedProducts(8).catch(() => []),
    getFeaturedProducts(4).catch(() => []),
  ]);

  return (
    <SearchPageClient
      query={query}
      initialResults={results}
      suggestions={featured}
    />
  );
}
