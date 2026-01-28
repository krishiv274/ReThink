'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { ItemFormModal } from '@/components/items';
import { formatIdea } from '@/lib/formatAI';
import { 
  Upload, 
  Sparkles, 
  Recycle,
  Lightbulb,
  Camera,
  Target,
  Check,
  ArrowRight,
  Plus,
  Clock,
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

// Tips for reusing items
const TIPS = [
  "Start with easy ideas to build momentum toward your monthly goal.",
  "Before disposing of anything, ask: 'Can this be reused or repurposed?'",
  "Old t-shirts make great cleaning rags or reusable bags.",
  "Glass jars are perfect for storing leftovers, spices, or homemade candles.",
  "Document your completed ideas to inspire others!",
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Calculate monthly progress
  const monthlyGoal = user?.monthlyGoal || 10;
  const monthlyCompleted = user?.monthlyCompleted || 0;
  const progressPercent = Math.min(100, Math.round((monthlyCompleted / monthlyGoal) * 100));
  const remaining = Math.max(0, monthlyGoal - monthlyCompleted);
  
  // Calculate days remaining in month
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysRemaining = lastDay.getDate() - now.getDate();

  // Display name (fallback to username)
  const displayName = user?.displayName || user?.username || 'there';

  // Fetch recent items with AI ideas
  useEffect(() => {
    const fetchRecentIdeas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/me?sortBy=date&limit=8`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setRecentIdeas(data.items || []);
        }
      } catch (error) {
        console.error('Error fetching recent ideas:', error);
      } finally {
        setIdeasLoading(false);
      }
    };

    if (!loading && user) {
      fetchRecentIdeas();
    }
  }, [user, loading]);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle upload submit
  const handleUploadSubmit = async (formData) => {
    setUploadLoading(true);
    setUploadError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      const result = await response.json();
      setShowUploadModal(false);
      router.push(`/home/items/${result.item._id}`);
    } catch (error) {
      setUploadError(error.message || 'Failed to upload item');
    } finally {
      setUploadLoading(false);
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  // Find next suggested action - navigate to item, never upload
  const getSuggestedItem = () => {
    if (!recentIdeas.length) return null;
    
    // Find item with pending ideas to continue
    const itemsWithPendingIdeas = recentIdeas.filter(item => {
      const completedCount = item.completedIdeas?.filter(c => c).length || 0;
      return item.ideas?.length > 0 && completedCount < item.ideas.length;
    });
    
    if (itemsWithPendingIdeas.length > 0) {
      return itemsWithPendingIdeas[0];
    }
    
    // Find item without ideas to generate
    const itemsWithoutIdeas = recentIdeas.filter(item => !item.ideas || item.ideas.length === 0);
    if (itemsWithoutIdeas.length > 0) {
      return itemsWithoutIdeas[0];
    }
    
    // Return most recent item
    return recentIdeas[0];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const suggestedItem = getSuggestedItem();

  return (
    <div className="flex min-h-screen bg-[#f8faf8]">
      <Sidebar activeSection="home" />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <Header user={user} />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Greeting & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {displayName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {monthlyCompleted > 0 
                    ? `${remaining} idea${remaining !== 1 ? 's' : ''} to reach your monthly goal`
                    : 'Start reusing to track progress'}
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all"
              >
                <Camera className="w-4 h-4" />
                Upload Item
              </motion.button>
            </div>

            {/* Stats & Progress Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Monthly Progress - Featured */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-5">
                  {/* Progress Circle */}
                  <div 
                    className="relative w-20 h-20 rounded-full flex-shrink-0"
                    style={{
                      background: `conic-gradient(#22c55e ${progressPercent}%, #f3f4f6 0)`
                    }}
                  >
                    <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">{progressPercent}%</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Monthly Goal</span>
                      <span className="text-xs text-gray-400 ml-auto">{daysRemaining}d left</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {monthlyCompleted}<span className="text-lg text-gray-400">/{monthlyGoal}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* All-Time Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Recycle className="w-4 h-4 text-blue-500" />
                      Items
                    </span>
                    <span className="font-bold text-gray-900">{user?.itemsUploaded || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Ideas Done
                    </span>
                    <span className="font-bold text-gray-900">{user?.totalIdeasCompleted || 0}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">New Item</p>
                  <p className="text-xs text-gray-500">Upload & get ideas</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/home/ideas')}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-300 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">My Ideas</p>
                  <p className="text-xs text-gray-500">View all items</p>
                </div>
              </button>

              {/* Suggested - navigates to item, never opens upload */}
              {suggestedItem ? (
                <button
                  onClick={() => router.push(`/home/items/${suggestedItem._id}`)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-green-700 text-sm">Resume</p>
                    <p className="text-xs text-green-600 truncate">{suggestedItem.title}</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => router.push('/home/ideas')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-green-700 text-sm">Get Started</p>
                    <p className="text-xs text-green-600 truncate">View all ideas</p>
                  </div>
                </button>
              )}
            </motion.div>

            {/* Tip of the Day */}
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-900 text-sm">Did you know?</h4>
                  <p className="text-xs text-amber-700 mt-0.5">{TIPS[tipIndex]}</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Items & Ideas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <button 
                  onClick={() => router.push('/home/ideas')}
                  className="text-sm text-green-600 font-medium hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {ideasLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                      <div className="h-28 bg-gray-100 rounded-lg mb-3" />
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : recentIdeas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentIdeas.slice(0, 4).map((item) => {
                    const hasIdeas = item.ideas && item.ideas.length > 0;
                    const completedCount = item.completedIdeas?.filter(c => c).length || 0;
                    const totalIdeas = item.ideas?.length || 0;
                    const firstIdea = hasIdeas ? formatIdea(item.ideas[0]) : null;
                    
                    return (
                      <motion.div
                        key={item._id}
                        whileHover={{ y: -2 }}
                        onClick={() => router.push(`/home/items/${item._id}`)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
                      >
                        <div className="relative h-28 bg-gray-100 overflow-hidden">
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundImage: item.imageUrl ? `url('${item.imageUrl}')` : 'none' }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-medium text-gray-700">
                            {item.material}
                          </div>
                          {hasIdeas && (
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                              completedCount === totalIdeas 
                                ? 'bg-green-500 text-white' 
                                : 'bg-white/90 backdrop-blur text-gray-700'
                            }`}>
                              {completedCount === totalIdeas ? (
                                <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Done</span>
                              ) : (
                                `${completedCount}/${totalIdeas}`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{item.title}</h4>
                          {firstIdea && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{firstIdea}</p>
                          )}
                          {!hasIdeas && (
                            <p className="text-xs text-purple-500 mt-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Generate ideas
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">No items yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload an item to get AI-generated reuse ideas</p>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Upload First Item
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <ItemFormModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadError('');
        }}
        onSubmit={handleUploadSubmit}
        mode="create"
        loading={uploadLoading}
        error={uploadError}
      />
    </div>
  );
}
