'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Eye, ImageIcon } from 'lucide-react';
import { MATERIAL_COLORS } from './constants';

export default function ItemCard({ item, index, onView, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image Section */}
      <div 
        className="relative h-48 bg-gray-100 cursor-pointer group overflow-hidden"
        onClick={() => onView(item)}
      >
        {item.imageUrl && !imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <Eye className="w-5 h-5 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Material Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${MATERIAL_COLORS[item.material] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {item.material}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-3 truncate">{item.title}</h3>
        
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-600">{item.ideasCount || 0} ideas</span>
          <span className="font-semibold text-green-600">+{item.thinkScore || 0} Th!nk</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(item)}
            className="flex-1 px-3 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="px-3 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
