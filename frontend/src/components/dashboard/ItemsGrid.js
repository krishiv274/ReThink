'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, MoreVertical, Trash2, Edit, ExternalLink } from 'lucide-react';

const mockItems = [
  { id: 1, name: 'Plastic Bottle', category: 'Plastic', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', ideas: 5, tokens: 150, date: '2025-11-20' },
  { id: 2, name: 'Glass Jar', category: 'Glass', image: 'https://images.unsplash.com/photo-1622428051717-dcd8412959de?w=400', ideas: 3, tokens: 90, date: '2025-11-22' },
  { id: 3, name: 'Cardboard Box', category: 'Paper', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', ideas: 7, tokens: 210, date: '2025-11-24' },
  { id: 4, name: 'Old T-Shirt', category: 'Fabric', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', ideas: 4, tokens: 120, date: '2025-11-25' },
  { id: 5, name: 'Tin Can', category: 'Metal', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400', ideas: 6, tokens: 180, date: '2025-11-26' },
  { id: 6, name: 'Wine Cork', category: 'Organic', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', ideas: 2, tokens: 60, date: '2025-11-18' },
];

export default function ItemsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['All', 'Plastic', 'Glass', 'Paper', 'Fabric', 'Metal', 'Organic'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Items</h2>
          <p className="text-gray-600">Manage your uploaded items and reuse ideas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          >
            <option value="date">Date</option>
            <option value="tokens">Tokens</option>
            <option value="ideas">Ideas</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-48 bg-gray-100">
              <Image src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-900 mb-3">{item.name}</h3>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-600">{item.ideas} ideas</span>
                <span className="font-semibold text-green-600">+{item.tokens} Th!nk</span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Previous
        </button>
        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">
          1
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          2
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          3
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}
