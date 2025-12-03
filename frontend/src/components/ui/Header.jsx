'use client';

import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function Header({ user }) {
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="bg-white border-b border-green-100 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, tutorials, ideas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <button 
            onClick={() => router.push('/dashboard/profile')}
            className="flex items-center gap-3 pl-4 border-l border-green-200 hover:bg-green-50 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-200">
              {user?.avatar && !avatarError ? (
                <div className="relative w-full h-full bg-linear-to-br from-green-500 to-emerald-600">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    fill
                    className="object-cover"
                    onError={() => setAvatarError(true)}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
