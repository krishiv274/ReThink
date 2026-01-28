'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Loader2, 
  Sparkles,
  Check,
  Recycle,
  Plus,
  Target,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatIdea } from '@/lib/formatAI';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { ItemFormModal } from '@/components/items';

export default function MyIdeasPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Monthly progress
  const monthlyGoal = user?.monthlyGoal || 10;
  const monthlyCompleted = user?.monthlyCompleted || 0;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getMyItems({
        limit: 50,
        sortBy: 'date',
        search: searchQuery || undefined,
      });
      setItems(result.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!authLoading && user) {
      const debounceTimer = setTimeout(() => {
        fetchItems();
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [authLoading, user, fetchItems]);

  const handleCompleteIdea = async (itemId, ideaIndex) => {
    try {
      await api.completeIdea(itemId, ideaIndex);
      fetchItems();
      if (refreshUser) refreshUser();
    } catch (error) {
      console.error('Error completing idea:', error);
    }
  };

  const toggleItemExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleUploadSubmit = async (formData) => {
    setFormLoading(true);
    setFormError('');
    try {
      await api.createItem(formData);
      setShowUploadModal(false);
      fetchItems();
    } catch (error) {
      setFormError(error.message || 'Failed to create item');
    } finally {
      setFormLoading(false);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (filter === 'with-ideas') return item.ideas && item.ideas.length > 0;
    if (filter === 'pending') return !item.ideas || item.ideas.length === 0;
    if (filter === 'completed') return item.completedIdeas?.some(c => c === true);
    return true;
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8faf8]">
      <Sidebar activeSection="ideas" />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <Header user={user} />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Ideas</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {monthlyCompleted}/{monthlyGoal} ideas completed this month
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                Upload Item
              </motion.button>
            </div>

            {/* Monthly Progress */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Monthly Progress</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{monthlyCompleted}/{monthlyGoal}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (monthlyCompleted / monthlyGoal) * 100)}%` }}
                />
              </div>
            </div>

            {/* Search & Filters - with proper spacing */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Items' },
                  { key: 'with-ideas', label: 'With Ideas' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'completed', label: 'Completed' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === f.key 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-1">No items found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {filter === 'all' ? 'Upload an item to get started!' : 'No items match your filter.'}
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Upload Item
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const isExpanded = expandedItems[item._id];
                  const hasIdeas = item.ideas && item.ideas.length > 0;
                  const completedCount = item.completedIdeas?.filter(c => c).length || 0;
                  const totalIdeas = item.ideas?.length || 0;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                    >
                      {/* Item Header */}
                      <div 
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => hasIdeas ? toggleItemExpanded(item._id) : router.push(`/home/items/${item._id}`)}
                      >
                        <div 
                          className="w-14 h-14 rounded-lg bg-gray-100 bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: item.imageUrl ? `url('${item.imageUrl}')` : 'none' }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Recycle className="w-3 h-3 text-green-500" />
                              {item.material}
                            </span>
                            {hasIdeas && (
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-purple-500" />
                                {completedCount}/{totalIdeas} done
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!hasIdeas && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/home/items/${item._id}`);
                              }}
                              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
                            >
                              Generate
                            </button>
                          )}
                          {hasIdeas && (
                            <div className="p-1.5">
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ideas List */}
                      {hasIdeas && isExpanded && (
                        <div className="px-4 pb-4 space-y-2">
                          {item.ideas.map((idea, index) => {
                            const isCompleted = item.completedIdeas?.[index] === true;
                            return (
                              <div 
                                key={index}
                                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                                  isCompleted ? 'bg-green-50' : 'bg-gray-50'
                                }`}
                              >
                                <button
                                  onClick={() => !isCompleted && handleCompleteIdea(item._id, index)}
                                  disabled={isCompleted}
                                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isCompleted 
                                      ? 'bg-green-500 border-green-500 text-white' 
                                      : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                                  }`}
                                >
                                  {isCompleted && <Check className="w-3 h-3" />}
                                </button>
                                <p className={`text-sm flex-1 ${isCompleted ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                  {formatIdea(idea)}
                                </p>
                              </div>
                            );
                          })}
                          <button
                            onClick={() => router.push(`/home/items/${item._id}`)}
                            className="text-xs text-green-600 font-medium hover:underline mt-2"
                          >
                            View details →
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <ItemFormModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadSubmit}
        mode="create"
        loading={formLoading}
        error={formError}
      />
    </div>
  );
}
