'use client';

import { motion } from 'framer-motion';
import { Package, Calendar } from 'lucide-react';

export default function ProfileStats({ profile }) {
  // Format date safely
  const formatMemberSince = () => {
    if (!profile?.createdAt) return 'N/A';
    const date = new Date(profile.createdAt);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="h-full"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 h-full flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
        
        <div className="space-y-3 flex-1">
          <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-700">Items Uploaded</p>
                <p className="text-2xl font-bold text-blue-900">{profile?.itemsUploaded || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Member since {formatMemberSince()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
