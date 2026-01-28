'use client';

import { Bell, Search, X, Loader2, Recycle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

export default function Header({ user }) {
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await api.getMyItems({ search: searchQuery, limit: 10 });
        setSearchResults(result.items || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (itemId) => {
    setShowResults(false);
    setSearchQuery('');
    router.push(`/home/items/${itemId}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <header className="bg-white px-6 py-4 sticky top-0 z-30 border-b border-gray-100">
      <div className="flex items-center justify-between gap-4">
        {/* Empty space for balance (sidebar toggle is on left) */}
        <div className="w-12" />

        {/* Centered Search Bar */}
        <div className="flex-1 max-w-xl mx-auto" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search items and ideas..."
              className="w-full pl-12 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                ) : (
                  <X className="w-4 h-4 text-gray-400" />
                )}
              </button>
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  {searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((item) => {
                        const hasIdeas = item.ideas && item.ideas.length > 0;
                        const completedCount = item.completedIdeas?.filter(c => c).length || 0;
                        
                        return (
                          <button
                            key={item._id}
                            onClick={() => handleResultClick(item._id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                          >
                            <div 
                              className="w-10 h-10 rounded-lg bg-gray-100 bg-cover bg-center flex-shrink-0"
                              style={{ backgroundImage: item.imageUrl ? `url('${item.imageUrl}')` : 'none' }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Recycle className="w-3 h-3 text-green-500" />
                                  {item.material}
                                </span>
                                {hasIdeas && (
                                  <span className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-purple-500" />
                                    {completedCount}/{item.ideas.length} done
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No items found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Avatar */}
          <button 
            onClick={() => router.push('/home/profile')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-200 hover:border-green-400 transition-colors"
          >
            {user?.avatar && !avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
