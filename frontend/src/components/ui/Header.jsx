'use client';

import { Bell, Search, Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header({ user }) {
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="bg-white px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for ideas, items, or users..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* EcoTokens */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Coins className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">1,240 EcoTokens</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <button 
            onClick={() => router.push('/dashboard/profile')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-200 hover:border-green-400 transition-colors"
          >
            {user?.avatar && !avatarError ? (
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
