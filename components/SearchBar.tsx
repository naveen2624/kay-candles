'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

type Props = {
  className?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function SearchBar({
  className,
  placeholder = 'Search candles, crafts…',
  size = 'md',
}: Props) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative flex items-center">
        <Search
          className={cn(
            'absolute left-4 text-blush-300 pointer-events-none',
            size === 'sm' && 'w-3.5 h-3.5',
            size === 'md' && 'w-4 h-4',
            size === 'lg' && 'w-5 h-5'
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full bg-white/90 border border-blush-200 rounded-full font-body text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 focus:border-transparent transition-all',
            size === 'sm' && 'pl-9 pr-4 py-2 text-xs',
            size === 'md' && 'pl-11 pr-5 py-3 text-sm',
            size === 'lg' && 'pl-13 pr-6 py-4 text-base'
          )}
        />
        {query && (
          <button
            type="submit"
            className={cn(
              'absolute right-3 bg-blush-400 hover:bg-blush-500 text-white rounded-full transition-colors font-body text-xs font-medium',
              size === 'sm' && 'px-2.5 py-1 text-[10px]',
              size === 'md' && 'px-3 py-1.5 text-xs',
              size === 'lg' && 'px-4 py-2 text-sm'
            )}
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
