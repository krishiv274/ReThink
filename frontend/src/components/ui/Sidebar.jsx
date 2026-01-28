'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Lightbulb,
  User,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useSidebar } from '@/contexts/SidebarContext';

// Menu items - simplified, productivity-focused
const menuItems = [
  { icon: Home, label: 'Home', href: '/home', section: 'home' },
  { icon: Lightbulb, label: 'My Ideas', href: '/home/ideas', section: 'ideas' },
  { icon: User, label: 'Profile', href: '/home/profile', section: 'profile' },
];

export default function Sidebar({ activeSection }) {
  const router = useRouter();
  const { isOpen, toggle, open, close } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);

  // Auto-reveal on cursor at left edge
  useEffect(() => {
    let timeout;
    
    const handleMouseMove = (e) => {
      // Check if cursor is at left edge (within 8px)
      if (e.clientX <= 8 && !isOpen) {
        // Add small delay to prevent accidental triggers
        timeout = setTimeout(() => {
          setIsHovering(true);
          open();
        }, 100);
      }
    };

    const handleMouseLeave = () => {
      if (timeout) clearTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen, open]);

  // Close sidebar when mouse leaves sidebar area (if opened by hover)
  const handleSidebarMouseLeave = () => {
    if (isHovering) {
      setIsHovering(false);
      close();
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNavigate = (href) => {
    router.push(href);
    // Close sidebar after navigation
    if (window.innerWidth < 1024 || isHovering) {
      setIsHovering(false);
      close();
    }
  };

  const handleToggle = () => {
    setIsHovering(false);
    toggle();
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={handleToggle}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsHovering(false); close(); }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onMouseLeave={handleSidebarMouseLeave}
            className="w-[240px] bg-white flex flex-col h-screen fixed left-0 top-0 z-40 shadow-xl border-r border-gray-100"
          >
            {/* Logo */}
            <div className="p-6 pt-16 pb-6">
              <button
                onClick={() => handleNavigate('/home')}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold text-gray-900">ReTh!nk</span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.section;
                
                return (
                  <motion.button
                    key={item.section}
                    onClick={() => handleNavigate(item.href)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
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
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-1.5 text-purple-600 text-xs font-semibold mb-2">
                  <Sparkles className="w-4 h-4" />
                  PRO TIP
                </div>
                <p className="text-purple-700 text-xs leading-relaxed">
                  Move your cursor to the left edge to reveal the sidebar!
                </p>
              </div>
            </div>

            {/* Logout at bottom */}
            <div className="p-4 pt-0 border-t border-gray-100 mt-2">
              <motion.button
                onClick={handleLogout}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
