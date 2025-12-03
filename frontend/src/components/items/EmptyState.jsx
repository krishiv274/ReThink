'use client';

import { motion } from 'framer-motion';
import { Package, Plus } from 'lucide-react';

export default function EmptyState({ hasFilters, onUploadClick }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
      <p className="text-gray-500 mb-6">
        {hasFilters 
          ? 'Try adjusting your filters' 
          : 'Upload your first item to get started'}
      </p>
      {!hasFilters && (
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Upload First Item
        </button>
      )}
    </motion.div>
  );
}
