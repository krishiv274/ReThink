'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import StatsCard from '@/components/ui/StatsCard';
import UploadSection from '@/components/ui/UploadSection';
import ItemsGrid from '@/components/ui/ItemsGrid';
import Leaderboard from '@/components/ui/Leaderboard';
import Achievements from '@/components/ui/Achievements';
import TokensSection from '@/components/ui/TokensSection';
import ActivityFeed from '@/components/ui/ActivityFeed';
import { Package, Coins, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    checkAuth();
  });

  const checkAuth = async () => {
    try {
      const result = await api.getProfile();
      if (result.user) {
        setUser(result.user);
      } else {
        router.push('/login');
      }
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username}! 👋
              </h1>
              <p className="text-gray-600">Here&apos;s what&apos;s happening with your eco-journey today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={Coins}
                label="Th!nk Tokens"
                value="1,250"
                change="+15.3%"
                color="purple"
              />
              <StatsCard
                icon={Package}
                label="Items Uploaded"
                value="24"
                change="+8.2%"
                color="blue"
              />
              <StatsCard
                icon={TrendingUp}
                label="Eco Score"
                value="87"
                change="+12.5%"
                color="green"
              />
              <StatsCard
                icon={Award}
                label="Achievements"
                value="8"
                change="+2"
                color="orange"
              />
            </div>

            {/* Quick Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <UploadSection />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ActivityFeed />
            </motion.div>
          </div>
        );

      case 'upload':
        return <UploadSection />;

      case 'items':
        return <ItemsGrid />;

      case 'leaderboard':
        return <Leaderboard />;

      case 'achievements':
        return <Achievements />;

      case 'tokens':
        return <TokensSection />;

      case 'activity':
        return <ActivityFeed />;

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-64">
        <Header user={user} />
        
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

