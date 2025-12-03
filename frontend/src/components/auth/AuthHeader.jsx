'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="text-center flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className="w-12 h-12 bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-gray-900 tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-2 text-sm text-gray-500"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
