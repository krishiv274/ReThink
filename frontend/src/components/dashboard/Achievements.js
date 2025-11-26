'use client';

import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

const achievements = [
  { id: 1, name: 'First Upload', description: 'Upload your first item', icon: '🎯', unlocked: true, progress: 100, date: '2025-11-15' },
  { id: 2, name: 'Eco Starter', description: 'Earn 100 Th!nk tokens', icon: '🌱', unlocked: true, progress: 100, date: '2025-11-18' },
  { id: 3, name: 'Creative Mind', description: 'Get 10 AI suggestions', icon: '💡', unlocked: true, progress: 100, date: '2025-11-20' },
  { id: 4, name: 'Plastic Warrior', description: 'Upcycle 5 plastic items', icon: '♻️', unlocked: true, progress: 100, date: '2025-11-22' },
  { id: 5, name: 'Token Collector', description: 'Earn 500 Th!nk tokens', icon: '🪙', unlocked: false, progress: 68, current: 340, target: 500 },
  { id: 6, name: 'Consistency King', description: 'Upload items for 7 days straight', icon: '🔥', unlocked: false, progress: 57, current: 4, target: 7 },
  { id: 7, name: 'Community Hero', description: 'Help 25 users with ideas', icon: '🤝', unlocked: false, progress: 24, current: 6, target: 25 },
  { id: 8, name: 'Master Upcycler', description: 'Complete 50 upcycling projects', icon: '👑', unlocked: false, progress: 42, current: 21, target: 50 },
  { id: 9, name: 'NFT Pioneer', description: 'Earn your first NFT badge', icon: '🎨', unlocked: false, progress: 0, current: 0, target: 1 },
];

const nftBadges = [
  { id: 1, name: 'Eco Beginner', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200', rarity: 'Common', owned: true },
  { id: 2, name: 'Green Guardian', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200', rarity: 'Rare', owned: true },
  { id: 3, name: 'Sustainability Expert', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200', rarity: 'Epic', owned: false },
  { id: 4, name: 'Planet Savior', image: 'https://images.unsplash.com/photo-1643916861364-02e63ce3e52f?w=200', rarity: 'Legendary', owned: false },
];

export default function Achievements() {
  const getRarityColor = (rarity) => {
    const colors = {
      Common: 'from-gray-400 to-gray-600',
      Rare: 'from-blue-400 to-blue-600',
      Epic: 'from-purple-400 to-purple-600',
      Legendary: 'from-orange-400 to-orange-600',
    };
    return colors[rarity] || colors.Common;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievements & NFT Badges</h2>
        <p className="text-gray-600">Track your progress and collect exclusive NFT badges</p>
      </div>

      {/* NFT Badges */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎨 NFT Badge Collection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nftBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${
                badge.owned ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div className="aspect-square relative">
                <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                {!badge.owned && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white text-xs font-bold rounded-full`}>
                  {badge.rarity}
                </div>
              </div>
              <div className="p-3 bg-white border-t border-gray-200">
                <p className="font-semibold text-sm text-gray-900">{badge.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-5 border ${
                achievement.unlocked
                  ? 'border-green-200 bg-green-50/30'
                  : 'border-gray-200'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                  achievement.unlocked ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gray-100'
                }`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>

                  {achievement.unlocked ? (
                    <p className="text-xs text-gray-500">Unlocked on {achievement.date}</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                          {achievement.current} / {achievement.target}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {achievement.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.05 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
