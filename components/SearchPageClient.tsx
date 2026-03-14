'use client';

import { Product } from '@/lib/supabase';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import { Search } from 'lucide-react';

type Props = {
  query: string;
  initialResults: Product[];
  suggestions: Product[];
};

export default function SearchPageClient({ query, initialResults, suggestions }: Props) {
  const candles = initialResults.filter((p) => p.category === 'candles');
  const crafts  = initialResults.filter((p) => p.category === 'crafts');

  return (
    <div className="min-h-screen bg-blush-50">
      <div className="bg-white border-b border-blush-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-xs text-blush-400 uppercase tracking-[0.25em] mb-3">Search</p>
          <h1 className="font-display text-4xl font-light text-blush-900 mb-6">
            {query
              ? <>Results for &ldquo;<em className="italic text-blush-400">{query}</em>&rdquo;</>
              : 'Discover our Collection'}
          </h1>
          <SearchBar size="lg" placeholder="Search candles, flowers, gifts…" className="max-w-lg mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {initialResults.length === 0 && query ? (
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
                <h3 className="font-display text-3xl font-light text-blush-800 mb-8">You might like these</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-14">
            <p className="font-body text-sm text-blush-500">
              Found <strong className="text-blush-700">{initialResults.length}</strong> result{initialResults.length !== 1 ? 's' : ''}
              {query && <> for &ldquo;<strong className="text-blush-700">{query}</strong>&rdquo;</>}
            </p>

            {!query ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {initialResults.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <>
                {candles.length > 0 && (
                  <div>
                    <h2 className="font-display text-3xl font-light text-blush-900 mb-6">
                      Candles <span className="text-blush-300 text-xl">({candles.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {candles.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </div>
                )}
                {crafts.length > 0 && (
                  <div>
                    <h2 className="font-display text-3xl font-light text-blush-900 mb-6">
                      Crafts <span className="text-blush-300 text-xl">({crafts.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {crafts.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </div>
                )}
              </>
            )}

            {initialResults.length < 4 && suggestions.length > 0 && (
              <div>
                <h3 className="font-display text-3xl font-light text-blush-800 mb-8">You might also like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {suggestions.filter((s) => !initialResults.find((r) => r.id === s.id)).slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
