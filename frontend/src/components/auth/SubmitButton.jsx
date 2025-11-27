'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function SubmitButton({ loading, text, loadingText }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className="flex w-full justify-center items-center gap-2 rounded-full bg-black px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black transition-colors"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? loadingText : text}
    </motion.button>
  );
}
