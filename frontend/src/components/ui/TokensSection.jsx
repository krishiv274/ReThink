'use client';

import { motion } from 'framer-motion';
import { Coins, TrendingUp, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

const transactions = [
  { id: 1, type: 'earn', amount: 150, reason: 'Uploaded Plastic Bottle', date: '2025-11-26 10:30 AM', txHash: '0x1a2b...3c4d' },
  { id: 2, type: 'earn', amount: 90, reason: 'Completed Glass Jar Upcycle', date: '2025-11-25 3:45 PM', txHash: '0x5e6f...7g8h' },
  { id: 3, type: 'earn', amount: 210, reason: 'Cardboard Box Ideas', date: '2025-11-24 11:20 AM', txHash: '0x9i0j...1k2l' },
  { id: 4, type: 'redeem', amount: -50, reason: 'Redeemed Discount Coupon', date: '2025-11-23 2:15 PM', txHash: '0x3m4n...5o6p' },
  { id: 5, type: 'earn', amount: 120, reason: 'T-Shirt Upcycling Project', date: '2025-11-22 9:00 AM', txHash: '0x7q8r...9s0t' },
  { id: 6, type: 'earn', amount: 180, reason: 'Tin Can Reuse Ideas', date: '2025-11-21 4:30 PM', txHash: '0xauev...wxyz' },
];

export default function TokensSection() {
  const totalTokens = 1250;
  const weeklyChange = 15.3;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Th!nk Tokens</h2>
        <p className="text-gray-600">Your blockchain-backed eco rewards</p>
      </div>

      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Coins className="w-8 h-8" />
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+{weeklyChange}%</span>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Balance</p>
          <p className="text-4xl font-bold">{totalTokens}</p>
          <p className="text-sm opacity-75 mt-2">Th!nk Tokens</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Earned</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">950</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-900">Redeemed</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">50</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </motion.div>
      </div>

      {/* Blockchain Info */}
      <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Polygon Blockchain</h3>
            <p className="text-sm text-gray-600 mb-3">
              Your tokens are secured on Polygon testnet with full transparency and immutability.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                View on Polygonscan
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Redeem Tokens
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Transaction History</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'earn' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {tx.type === 'earn' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">{tx.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{tx.date}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <a 
                        href={`https://mumbai.polygonscan.com/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        {tx.txHash}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    tx.type === 'earn' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </p>
                  <p className="text-xs text-gray-500">Th!nk</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
