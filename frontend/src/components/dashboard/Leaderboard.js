'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, username: 'EcoWarrior', tokens: 5420, ecoScore: 98, avatar: 'E', items: 142 },
  { rank: 2, username: 'GreenThumb', tokens: 4890, ecoScore: 95, avatar: 'G', items: 128 },
  { rank: 3, username: 'RecyclePro', tokens: 4560, ecoScore: 92, avatar: 'R', items: 115 },
  { rank: 4, username: 'UpcycleKing', tokens: 3980, ecoScore: 89, avatar: 'U', items: 98 },
  { rank: 5, username: 'PlanetSaver', tokens: 3720, ecoScore: 87, avatar: 'P', items: 92 },
  { rank: 6, username: 'ZeroWaste', tokens: 3450, ecoScore: 85, avatar: 'Z', items: 86 },
  { rank: 7, username: 'EcoNinja', tokens: 3210, ecoScore: 83, avatar: 'E', items: 79 },
  { rank: 8, username: 'GreenQueen', tokens: 2980, ecoScore: 80, avatar: 'G', items: 74 },
];

export default function Leaderboard() {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <Trophy className="w-5 h-5 text-gray-400" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-100 to-gray-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Leaderboard</h2>
        <p className="text-gray-600">Top contributors making a difference</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Top 3 Podium */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 border-b border-gray-200">
          <div className="flex items-end justify-center gap-4 max-w-2xl mx-auto">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center"
            >
              <div className="relative inline-block mb-3">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {mockLeaderboard[1].avatar}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Medal className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="font-bold text-gray-900">{mockLeaderboard[1].username}</p>
              <p className="text-2xl font-bold text-gray-700 mt-1">{mockLeaderboard[1].tokens}</p>
              <p className="text-xs text-gray-500">Th!nk Tokens</p>
              <div className="mt-4 h-24 bg-gradient-to-br from-gray-300 to-gray-500 rounded-t-lg"></div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 text-center"
            >
              <div className="relative inline-block mb-3">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {mockLeaderboard[0].avatar}
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="font-bold text-gray-900">{mockLeaderboard[0].username}</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{mockLeaderboard[0].tokens}</p>
              <p className="text-xs text-gray-500">Th!nk Tokens</p>
              <div className="mt-4 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-t-lg"></div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 text-center"
            >
              <div className="relative inline-block mb-3">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {mockLeaderboard[2].avatar}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Medal className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="font-bold text-gray-900">{mockLeaderboard[2].username}</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{mockLeaderboard[2].tokens}</p>
              <p className="text-xs text-gray-500">Th!nk Tokens</p>
              <div className="mt-4 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-lg"></div>
            </motion.div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="divide-y divide-gray-100">
          {mockLeaderboard.slice(3).map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 text-center">
                <span className="text-lg font-bold text-gray-400">#{user.rank}</span>
              </div>

              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(user.rank)} flex items-center justify-center text-lg font-bold text-white`}>
                {user.avatar}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.items} items uploaded</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">{user.tokens}</p>
                <p className="text-xs text-gray-500">Th!nk</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-600">{user.ecoScore}</p>
                <p className="text-xs text-gray-500">Eco Score</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
