import SearchPageClient from '@/components/SearchPageClient';

type Props = {
  searchParams: { q?: string };
};

export function generateMetadata({ searchParams }: Props) {
  return {
    title: searchParams.q
      ? `Search: "${searchParams.q}" | Kay Candles and Craft`
      : 'Search | Kay Candles and Craft',
  };
}

export default function SearchPage({ searchParams }: Props) {
  return <SearchPageClient query={searchParams.q || ''} />;
}
