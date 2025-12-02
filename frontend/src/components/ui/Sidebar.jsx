'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Trophy, 
  Award, 
  Activity,
  Wallet,
  LogOut,
  Sparkles,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Menu items with dedicated routes
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', section: 'overview' },
  { icon: Package, label: 'My Items', href: '/dashboard/items', section: 'items' },
  { icon: Trophy, label: 'Leaderboard', href: '/dashboard/leaderboard', section: 'leaderboard' },
  { icon: Award, label: 'Achievements', href: '/dashboard/achievements', section: 'achievements' },
  { icon: Wallet, label: 'Th!nk Tokens', href: '/dashboard/tokens', section: 'tokens' },
  { icon: Activity, label: 'Activity', href: '/dashboard/activity', section: 'activity' },
  { icon: User, label: 'My Profile', href: '/dashboard/profile', section: 'profile' },
];

export default function Sidebar({ activeSection, onSectionChange }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo - Clickable to go to Dashboard */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">ReTh!nk</h1>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.section;
          
          return (
            <motion.button
              key={item.section}
              onClick={() => {
                // All sections now have dedicated routes
                router.push(item.href);
              }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </div>
    </div>
  );
}
