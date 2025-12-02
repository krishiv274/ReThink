'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import Achievements from '@/components/ui/Achievements';

export default function AchievementsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const result = await api.getProfile();
      if (result.user) {
        setUser(result.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      if (error.message?.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    const routes = {
      overview: '/dashboard',
      items: '/dashboard/items',
      leaderboard: '/dashboard/leaderboard',
      achievements: '/dashboard/achievements',
      tokens: '/dashboard/tokens',
      activity: '/dashboard/activity',
      profile: '/profile',
    };
    if (routes[section]) {
      router.push(routes[section]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection="achievements" onSectionChange={handleSectionChange} />
      
      <div className="flex-1 ml-64">
        <Header user={user} />
        
        <main className="p-8">
          <Achievements />
        </main>
      </div>
    </div>
  );
}
