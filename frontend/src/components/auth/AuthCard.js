'use client';

import { motion } from 'framer-motion';

export default function AuthCard({ children }) {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 space-y-8 border border-white/20">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
