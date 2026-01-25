'use client';

import { motion } from 'framer-motion';
import { 
  Home,
  Upload,
  Lightbulb,
  Gift,
  Users,
  LogOut,
  Recycle,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Menu items matching the design
const menuItems = [
  { icon: Home, label: 'Home', href: '/dashboard', section: 'home' },
  { icon: Upload, label: 'Upload', href: '/dashboard/items', section: 'items' },
  { icon: Lightbulb, label: 'AI Ideas', href: '/dashboard/items', section: 'ideas' },
  { icon: Gift, label: 'Rewards', href: '/dashboard/profile', section: 'rewards' },
  { icon: Users, label: 'Community', href: '/dashboard/profile', section: 'community' },
];

export default function Sidebar({ activeSection }) {
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
    <div className="w-[200px] bg-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 pb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">ThingSaver</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.section;
          
          return (
            <motion.button
              key={item.section}
              onClick={() => router.push(item.href)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Pro Tip Card */}
      <div className="px-3 pb-4">
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-1.5 text-purple-600 text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            PRO TIP
          </div>
          <p className="text-purple-700 text-xs leading-relaxed">
            Clean glass jars before scanning for better AI recognition!
          </p>
        </div>
      </div>

      {/* Logout at bottom */}
      <div className="p-4 pt-0">
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </div>
    </div>
  );
}
