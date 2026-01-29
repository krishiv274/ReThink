'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, Loader2, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { MATERIALS } from './constants';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

const DEFAULT_FORM_DATA = {
  title: '',
  material: 'Plastic',
  imageUrl: '',
};

export default function ItemFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode = 'create',
  initialData,
  loading = false,
  error = '',
}) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, ready
  const fileInputRef = useRef(null);
  const { upload, uploading, progress, error: uploadError } = useCloudinaryUpload();

  useEffect(() => {
    if (!isOpen) return;

    const id = setTimeout(() => {
      if (mode === 'edit' && initialData) {
        setFormData({
          title: initialData.title || '',
          material: initialData.material || 'Plastic',
          imageUrl: initialData.imageUrl || '',
        });
        setImagePreview(initialData.imageUrl || null);
        if (initialData.imageUrl) {
          setUploadState('ready');
        }
      } else {
        setFormData(DEFAULT_FORM_DATA);
        setImagePreview(null);
        setUploadState('idle');
      }
    }, 0);

    return () => clearTimeout(id);
  }, [isOpen, mode, initialData]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadState('uploading');
    try {
      const result = await upload(file);
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      setUploadState('ready');
    } catch (err) {
      setUploadState('idle');
      console.error('Upload failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      return;
    }
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  const handleClose = () => {
    if (!loading && !uploading) {
      setFormData(DEFAULT_FORM_DATA);
      setImagePreview(null);
      setUploadState('idle');
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
              disabled={loading || uploading}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image <span className="text-red-500">*</span>
              </label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!imagePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || uploading}
                  className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50/50 transition-all disabled:opacity-50"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload an image</span>
                  <span className="text-xs text-gray-400">JPG, PNG, WEBP (max 10MB)</span>
                </button>
              ) : (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  
                  {/* Upload Status Overlay */}
                  {uploadState === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                      <span className="text-white text-sm mt-2">Uploading... {progress}%</span>
                      <div className="w-32 h-1 bg-white/30 rounded-full mt-2">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {uploadState === 'ready' && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Change Image Button */}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-xs font-medium hover:bg-white transition-colors"
                    >
                      Change
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
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
                disabled={loading || uploading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                disabled={loading || uploading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white disabled:opacity-50 disabled:bg-gray-50"
              >
                {MATERIALS.filter(m => m !== 'All').map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>

            {(error || uploadError) && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error || uploadError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading || uploading}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading || uploadState !== 'ready'}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
