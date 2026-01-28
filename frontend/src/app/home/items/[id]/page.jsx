'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Calendar, 
  Lightbulb,
  Loader2,
  ImageIcon,
  Check,
  Clock,
  RefreshCw,
  Sparkles,
  Recycle,
  Plus
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatIdea } from '@/lib/formatAI';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { MATERIAL_COLORS } from '@/components/items/constants';
import ItemFormModal from '@/components/items/ItemFormModal';
import DeleteItemModal from '@/components/items/DeleteItemModal';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Ideas states
  const [ideasLoading, setIdeasLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      const itemResult = await api.getItem(params.id);
      if (itemResult.item) {
        setItem(itemResult.item);
      }
    } catch (error) {
      console.error('Error loading item:', error);
      if (error.message?.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    setFormLoading(true);
    setFormError('');
    try {
      const result = await api.updateItem(item._id, formData);
      setItem(result.item);
      setShowEditModal(false);
    } catch (error) {
      setFormError(error.message || 'Failed to update item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.deleteItem(item._id);
      router.push('/home/ideas');
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setIdeasLoading(true);
    try {
      const result = await api.generateIdeas(item._id);
      // Preserve existing item data (especially imageUrl) to prevent flicker
      setItem(prev => ({ ...prev, ...result.item }));
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setIdeasLoading(false);
    }
  };

  const handleRegenerateIdeas = async () => {
    setIdeasLoading(true);
    try {
      const result = await api.regenerateIdeas(item._id);
      // Preserve existing item data (especially imageUrl) to prevent flicker
      setItem(prev => ({ ...prev, ...result.item }));
    } catch (error) {
      console.error('Error regenerating ideas:', error);
    } finally {
      setIdeasLoading(false);
    }
  };

  const handleCompleteIdea = async (ideaIndex) => {
    try {
      await api.completeIdea(item._id, ideaIndex);
      await loadData();
      if (refreshUser) refreshUser();
    } catch (error) {
      console.error('Error completing idea:', error);
    }
  };

  const handleGenerateMore = async () => {
    setIdeasLoading(true);
    try {
      const result = await api.generateMoreIdeas(item._id);
      // Preserve existing item data (especially imageUrl) to prevent flicker
      setItem(prev => ({ ...prev, ...result.item }));
    } catch (error) {
      console.error('Error generating more ideas:', error);
    } finally {
      setIdeasLoading(false);
    }
  };

  // Calculate status
  const getItemStatus = () => {
    if (!item?.ideas || item.ideas.length === 0) return 'draft';
    const completedCount = item.completedIdeas?.filter(c => c).length || 0;
    if (completedCount === item.ideas.length) return 'completed';
    if (completedCount > 0) return 'in-progress';
    return 'pending';
  };

  const status = getItemStatus();
  const completedCount = item?.completedIdeas?.filter(c => c).length || 0;
  const totalIdeas = item?.ideas?.length || 0;

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Item not found</h2>
          <button
            onClick={() => router.push('/home/ideas')}
            className="text-green-600 font-medium hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8faf8]">
      <Sidebar activeSection="ideas" />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <Header user={user} />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.push('/home/ideas')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Ideas
            </button>

            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-64 bg-gray-100">
                {item.imageUrl && !imageError ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                
                {/* Material Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${MATERIAL_COLORS[item.material] || 'bg-gray-100 text-gray-700'}`}>
                    <Recycle className="w-3.5 h-3.5 inline mr-1" />
                    {item.material}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                    status === 'completed' ? 'bg-green-500 text-white' :
                    status === 'in-progress' ? 'bg-blue-500 text-white' :
                    status === 'pending' ? 'bg-purple-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {status === 'completed' && <Check className="w-3.5 h-3.5 inline mr-1" />}
                    {status === 'in-progress' && <Clock className="w-3.5 h-3.5 inline mr-1" />}
                    {status === 'pending' && <Lightbulb className="w-3.5 h-3.5 inline mr-1" />}
                    {status === 'draft' && <Sparkles className="w-3.5 h-3.5 inline mr-1" />}
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Added {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                {totalIdeas > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{completedCount} of {totalIdeas} completed</span>
                      <span className="font-medium text-gray-900">{Math.round((completedCount / totalIdeas) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${(completedCount / totalIdeas) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Ideas Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Reuse Ideas
                </h2>
                {totalIdeas > 0 && (
                  <button
                    onClick={handleRegenerateIdeas}
                    disabled={ideasLoading}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${ideasLoading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                )}
              </div>

              {/* No Ideas State */}
              {totalIdeas === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No ideas generated yet</p>
                  <button
                    onClick={handleGenerateIdeas}
                    disabled={ideasLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
                  >
                    {ideasLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate Ideas
                  </button>
                </div>
              )}

              {/* Ideas List */}
              {totalIdeas > 0 && (
                <div className="space-y-3">
                  {item.ideas.map((idea, index) => {
                    const isCompleted = item.completedIdeas?.[index] === true;
                    const difficulty = item.difficulties?.[index] || 'Medium';
                    
                    return (
                      <div 
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                          isCompleted ? 'bg-green-50 border border-green-100' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <button
                          onClick={() => !isCompleted && handleCompleteIdea(index)}
                          disabled={isCompleted}
                          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                          }`}
                        >
                          {isCompleted && <Check className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                            {formatIdea(idea)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {difficulty}
                            </span>
                            {isCompleted && (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Generate More Button */}
                  <button
                    onClick={handleGenerateMore}
                    disabled={ideasLoading}
                    className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors disabled:opacity-50"
                  >
                    {ideasLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Generate More Ideas
                  </button>
                </div>
              )}
            </motion.div>

            {/* Reuse History */}
            {completedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Reuse History
                </h2>
                <div className="space-y-3">
                  {item.ideas.map((idea, index) => {
                    if (!item.completedIdeas?.[index]) return null;
                    return (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-gray-600 truncate flex-1">{idea.substring(0, 60)}...</span>
                        <span className="text-xs text-gray-400">Completed</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <ItemFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setFormError('');
        }}
        mode="edit"
        initialData={item ? {
          title: item.title,
          material: item.material,
          imageUrl: item.imageUrl || '',
        } : undefined}
        onSubmit={handleEditSubmit}
        loading={formLoading}
        error={formError}
      />

      {/* Delete Modal */}
      <DeleteItemModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemTitle={item?.title}
        loading={formLoading}
      />
    </div>
  );
}
