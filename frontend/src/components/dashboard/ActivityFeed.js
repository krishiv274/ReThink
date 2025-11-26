'use client';

import { motion } from 'framer-motion';
import { Clock, Upload, Award, Coins, TrendingUp } from 'lucide-react';

const activities = [
  { id: 1, type: 'upload', title: 'Uploaded Tin Can', description: 'Got 6 reuse ideas', time: '2 hours ago', icon: Upload, color: 'blue' },
  { id: 2, type: 'token', title: 'Earned 180 Th!nk Tokens', description: 'Tin Can project completed', time: '2 hours ago', icon: Coins, color: 'green' },
  { id: 3, type: 'achievement', title: 'Achievement Unlocked!', description: 'Plastic Warrior badge earned', time: '1 day ago', icon: Award, color: 'purple' },
  { id: 4, type: 'upload', title: 'Uploaded Old T-Shirt', description: 'AI suggested 4 creative ideas', time: '1 day ago', icon: Upload, color: 'blue' },
  { id: 5, type: 'token', title: 'Earned 120 Th!nk Tokens', description: 'T-Shirt upcycling project', time: '1 day ago', icon: Coins, color: 'green' },
  { id: 6, type: 'milestone', title: 'Reached 1000 Tokens!', description: 'Keep up the great work', time: '2 days ago', icon: TrendingUp, color: 'orange' },
  { id: 7, type: 'upload', title: 'Uploaded Cardboard Box', description: 'Got 7 amazing ideas', time: '2 days ago', icon: Upload, color: 'blue' },
  { id: 8, type: 'token', title: 'Earned 210 Th!nk Tokens', description: 'Cardboard project completed', time: '2 days ago', icon: Coins, color: 'green' },
];

export default function ActivityFeed() {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
        <p className="text-gray-600">Your latest eco-actions and achievements</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getColorClasses(activity.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
