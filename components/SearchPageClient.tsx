'use client';

import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { mockProducts, searchMockProducts } from '@/utils/mockData';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import SimilarProducts from './SimilarProducts';

type Props = { query: string };

export default function SearchPageClient({ query }: Props) {
  // In production, use Supabase full-text search:
  // const results = await searchProducts(query);
  const results = useMemo(() => {
    if (!query) return mockProducts.slice(0, 8);
    return searchMockProducts(query);
  }, [query]);

  const candles = results.filter((p) => p.category === 'candles');
  const crafts = results.filter((p) => p.category === 'crafts');

  // Similar products: items not in results, same category range
  const suggestions = useMemo(() => {
    if (results.length > 0) return [];
    return mockProducts.slice(0, 4);
  }, [results]);

  return (
    <div className="min-h-screen bg-blush-50">
      {/* Search hero */}
      <div className="bg-white border-b border-blush-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-3">Search</p>
          <h1 className="font-display text-4xl font-light text-blush-900 mb-6">
            {query ? (
              <>Results for &ldquo;<em className="italic text-blush-400">{query}</em>&rdquo;</>
            ) : (
              'Discover our Collection'
            )}
          </h1>
          <SearchBar size="lg" placeholder="Search candles, flowers, gifts…" className="max-w-lg mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-blush-100 flex items-center justify-center mx-auto mb-5">
              <Search size={32} className="text-blush-200" />
            </div>
            <h2 className="font-accent text-xl text-blush-600 mb-2">No results found</h2>
            <p className="font-body text-sm text-blush-400 mb-8 max-w-xs mx-auto">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different keyword!
            </p>

            {suggestions.length > 0 && (
              <div className="mt-12">
                <h3 className="font-display text-3xl font-light text-blush-800 mb-8">
                  You might like these
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {suggestions.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-14">
            {/* Summary */}
            <p className="font-body text-sm text-blush-500">
              Found <strong className="text-blush-700">{results.length}</strong> result{results.length !== 1 ? 's' : ''}
              {query && <> for &ldquo;<strong className="text-blush-700">{query}</strong>&rdquo;</>}
            </p>

            {/* All results or split by category */}
            {!query ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <>
                {candles.length > 0 && (
                  <div>
                    <h2 className="font-display text-3xl font-light text-blush-900 mb-6">
                      Candles <span className="text-blush-300 text-xl">({candles.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {candles.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {crafts.length > 0 && (
                  <div>
                    <h2 className="font-display text-3xl font-light text-blush-900 mb-6">
                      Crafts <span className="text-blush-300 text-xl">({crafts.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {crafts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Similar / recommended */}
            {results.length < 4 && (
              <SimilarProducts
                products={mockProducts.filter((p) => !results.find((r) => r.id === p.id)).slice(0, 4)}
                title="You Might Also Like"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
