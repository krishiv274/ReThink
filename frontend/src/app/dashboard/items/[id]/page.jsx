'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Award, 
  Lightbulb,
  Loader2,
  ImageIcon,
  Share2
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { MATERIAL_COLORS } from '@/components/items/constants';
import ItemFormModal from '@/components/items/ItemFormModal';
import DeleteItemModal from '@/components/items/DeleteItemModal';

export default function ItemViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadData = async () => {
    try {
      // Load item
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
      router.push('/dashboard');
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading item...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <p className="text-gray-600 mb-6">The item you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection="items" />
      
      <div className="flex-1 ml-64">
        <Header user={user} />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/dashboard/items')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to My Items
            </button>

            {/* Main Content */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Image Section */}
              <div className="relative h-80 md:h-96 bg-gray-100">
                {item.imageUrl && !imageError ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-cover"
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-gray-300" />
                  </div>
                )}
                
                {/* Material Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${MATERIAL_COLORS[item.material] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {item.material}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Th!nk Score</p>
                        <p className="text-2xl font-bold text-green-900">+{item.thinkScore || 0}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-linear-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-700">Reuse Ideas</p>
                        <p className="text-2xl font-bold text-purple-900">{item.ideasCount || 0}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Ideas Section Placeholder */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Reuse Ideas</h2>
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      AI-powered reuse ideas coming soon! Upload more items to build your eco-score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

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
