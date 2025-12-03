'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import { MATERIALS } from './constants';

const DEFAULT_FORM_DATA = {
  title: '',
  material: 'Plastic',
  imageUrl: '',
};

export default function ItemFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode = 'create', // 'create' or 'edit'
  initialData,
  loading = false,
  error = '',
}) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  useEffect(() => {
    if (!isOpen) return;

    const id = setTimeout(() => {
      if (mode === 'edit' && initialData) {
        setFormData({
          title: initialData.title || '',
          material: initialData.material || 'Plastic',
          imageUrl: initialData.imageUrl || '',
        });
      } else {
        setFormData(DEFAULT_FORM_DATA);
      }
    }, 0);

    return () => clearTimeout(id);
  }, [isOpen, mode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData(DEFAULT_FORM_DATA);
      onClose();
    }
  };

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Item' : 'Upload New Item';
  const submitLabel = isEdit ? 'Save Changes' : 'Upload Item';
  const SubmitIcon = isEdit ? Save : Plus;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Plastic Water Bottle"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all bg-white disabled:opacity-50 disabled:bg-gray-50"
              >
                {MATERIALS.filter(m => m !== 'All').map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all disabled:opacity-50 disabled:bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a valid image URL (e.g., from Unsplash, Imgur, etc.)
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-green-200 rounded-xl font-medium hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <SubmitIcon className="w-4 h-4" />
                    {submitLabel}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
