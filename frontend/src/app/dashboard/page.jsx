'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { 
  Upload, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Recycle,
  Clock,
  Heart,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

// Sample data for Recent AI Ideas
const recentIdeas = [
  {
    id: 1,
    title: 'Mini Herb Garden',
    description: 'Turn your old pasta sauce jars into a delightful windowsill herb garden with minimal effort.',
    tag: 'Reuse',
    tagColor: 'green',
    fromItem: 'Glass Jar',
    fromColor: 'bg-red-50 text-red-600',
    toItem: 'Planter',
    toColor: 'bg-[#30e86e]/20 text-[#25b856]',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx9-seH8C6u_XlCDMZ8joDWwsO5ZglT85KHMgbCaMF-ROMhzwuz_jNVvZWDMoC5Cof9JmGj7Sr8tdlSz48UFOeXUO07XXTCsw-9CTTOg_JpDNBwwzGVoiD83RQ_ixz5XrWKJv7qmWXxuBewo7KOcvgpYPCsAtDek1Nf2fQvK4hlywCqjSghogYeXfp4-Sk6I1taaCULMTYSLpufQlvZncDHkbwnUPyzNak1zgVvD0rZX9_xjIs4z4onOkh29UdvRm2B4rxaNvwYuwh',
    time: '15m',
    tokens: '+50 Tokens',
  },
  {
    id: 2,
    title: 'Braided Tug Toy',
    description: "Don't toss that stained tee! Braid it into a durable and fun toy for your furry friend.",
    tag: 'Upcycle',
    tagColor: 'purple',
    fromItem: 'T-Shirt',
    fromColor: 'bg-blue-50 text-blue-600',
    toItem: 'Dog Toy',
    toColor: 'bg-purple-100 text-purple-700',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvJXEc5P4fK_pbs4DsposRAQ19XJG48KsJDrtH_r_aGgidIoZ_BYTWMIECF6yujODJBYHb2ftNQgR9AA_tg23dlb_p2LJdLfYrwh7eHll-F4qaUih-6rLJHcHteco8J8nTDWI-63Ecl9iQro05WAvSss23GU6uCoLnwPzu9Nob7hKICpyN1wNAWSwAGlSO7oqmEo6922-yGF_9wePRSyIO-qdX_xRxaHdGWZAXWQ-uQrtDhYocnM4fU1WXFW0tds_9_hm6rLtGDY38',
    time: '30m',
    tokens: '+75 Tokens',
  },
  {
    id: 3,
    title: 'DIY Bird Feeder',
    description: 'Attract local wildlife by converting a plastic soda bottle into a functional bird feeder.',
    tag: 'Reuse',
    tagColor: 'green',
    fromItem: 'Bottle',
    fromColor: 'bg-gray-100 text-gray-600',
    toItem: 'Feeder',
    toColor: 'bg-yellow-50 text-yellow-700',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6WN6uQvRJBivBtCYaD1gW5cSAdPcqXmJfXmqLepZGITWCKnuXX9JUl2zfFHcuBJxt2xlwcdexbjWdZhEvqzbRipWw8I16F7h9XDHADRDuyqcIJcO92zvrHg2mAIZbnIpM2JqszQNzk0JL2YEGgngUGQcm-ws2dMkJyVOwXhUizqAby5H03W4LgfXJKBP2UMmeyCVLudVmD64KiTvVdbh9R2-wdzNgPlrH2C324p7dyH_RsokFe-GybsKw4o5DCq6VUwyHS8gan6sY',
    time: '10m',
    tokens: '+40 Tokens',
  },
];

// Top savers leaderboard data
const topSavers = [
  { 
    rank: 1, 
    name: 'Sarah J.', 
    points: '5,240 pts',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTXaiRHHrESGNv4whhWKCK11dSrl0tWggPpvwij38PAe2fBk3lldqGk9D0tpo5ZrTANHKcgmF_Ybz3zlzUalFkQH4ZMzrLYWye5dqDkagvCIRRCliDWHbHihYkP4cPCFmpWuMRhCIGgRB_NHIsI7HzGtCiXmGs-F8Ul4CB5AVUs0mA5SMLFBxg68_YRMVf-Te9-CazPLuWGkE2sD0dICR40zDa21vcmAIFg9WVqaOHuF9AvPb7sp5AB0_52phBunIAxjg3eqFZJJfY',
    rankColor: 'text-yellow-500'
  },
  { 
    rank: 2, 
    name: 'Mike R.', 
    points: '4,800 pts',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvbF9GCOoSzic6OaV3whQjxIaOsZC89B1az-ObtoSZA_EBn6_xrcxM-LNrVVD7J72FPB9ahyxcfWPSeOYyiy47MweOFaQ2eH8gkbMGidaM89cUoFVv6hZTRQiaDvXpPYgf6iuAOZmeLzDN1Dzhixhjjxx50PEZw99iFFGhShMrh7VKcsAYhOaPMTfxRr-1JzkMcmzwFs5V9fwqBzM206HaYtNJTQD7b-edeG7OVVT-uEEnMXnEtWXuyc3eU6E1pSmGQTSM4qMXz0Ya',
    rankColor: 'text-gray-400'
  },
  { 
    rank: 3, 
    name: 'You', 
    points: '4,120 pts', 
    isYou: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpqUgUQ3u-rSSKEQ_rokK2a_bA8XsL6ruxtdNTa8R1I7zDslKhUta9pOh7nMYRMoZKw33KJWtS_rVb_3FjjaEqvtJ0b_dbJa90hSgHM0vUz3Z7YoI4HIn_GEk1GEqCZSoS7Eqd8KQTIO7ZGp9XMqfv8HpA-_HFbARe8A1ZU7-Cv_UazEdxmvliarP2f7QZyBj7QLFD98AGI3UXq_ZpP9cl4G9GopjsN9v1k1YgmJ1csr-4KFy2hdqnrb2j1N0w-8tsOe3SZ8yOUAJ9',
    rankColor: 'text-[#30e86e]'
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    router.push('/dashboard/items');
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8f6]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#30e86e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f8f6]">
      <Sidebar activeSection="home" />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden ml-[200px]">
        <Header user={user} />
        
        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 pb-20">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-[#111813] mb-2">
                  {getGreeting()}, {user?.username || 'Alex'}! 🌿
                </h2>
                <p className="text-[#63886f]">
                  Ready to make an impact? You&apos;ve saved 12 items this month.
                </p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/items')}
                className="bg-[#111813] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-gray-200 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Scan Item
              </button>
            </div>

            {/* Top Grid: Upload & Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Card: Upload Zone */}
              <div 
                className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer"
                onClick={() => router.push('/dashboard/items')}
              >
                {/* Background decoration - dot pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.15] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#30e86e 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative z-10 w-full max-w-md border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 ${
                    dragActive 
                      ? 'border-[#30e86e] bg-[#30e86e]/10' 
                      : 'border-[#dce5df] hover:border-[#30e86e] hover:bg-[#30e86e]/5'
                  }`}
                >
                  <div className={`bg-[#30e86e]/10 p-4 rounded-full text-[#30e86e] mb-2 transition-transform ${dragActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <Upload className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111813]">Scan New Item</h3>
                    <p className="text-sm text-[#63886f] mt-1">Drag & drop photos or click to browse</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/dashboard/items');
                    }}
                    className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    Select Files
                  </button>
                </div>
              </div>

              {/* Right Column: Stats & Leaderboard */}
              <div className="flex flex-col gap-6">
                {/* Progress Widget */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#63886f] mb-1">Monthly Goal</p>
                    <h4 className="text-2xl font-bold text-[#111813]">
                      450 <span className="text-base font-normal text-gray-400">/ 500</span>
                    </h4>
                    <p className="text-xs text-[#30e86e] font-bold mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      On track!
                    </p>
                  </div>
                  {/* CSS Circular Progress */}
                  <div 
                    className="relative w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: 'conic-gradient(#30e86e 85%, #f0f4f2 0)'
                    }}
                  >
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">85%</span>
                    </div>
                  </div>
                </div>

                {/* Leaderboard Widget */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#111813]">Top Savers</h3>
                    <button className="text-xs text-[#63886f] hover:text-[#30e86e] font-medium transition-colors">
                      View All
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {topSavers.map((saver) => (
                      <div 
                        key={saver.rank}
                        className={`flex items-center gap-3 ${
                          saver.isYou ? 'bg-[#30e86e]/10 -mx-2 px-2 py-1 rounded-lg' : ''
                        }`}
                      >
                        <div className={`font-bold text-sm w-4 ${saver.rankColor}`}>
                          {saver.rank}
                        </div>
                        <div 
                          className={`w-8 h-8 rounded-full bg-cover bg-center ${saver.isYou ? 'border border-[#30e86e]' : ''}`}
                          style={{ backgroundImage: `url('${saver.avatar}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${saver.isYou ? 'text-[#25b856] font-bold' : 'text-gray-800'}`}>
                            {saver.name}
                          </p>
                          <p className={`text-xs ${saver.isYou ? 'text-[#25b856]' : 'text-[#63886f]'}`}>
                            {saver.points}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent AI Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#111813]">Recent AI Ideas</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {recentIdeas.map((idea) => (
                  <motion.div
                    key={idea.id}
                    whileHover={{ y: -4 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${idea.image}')` }}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-[#111813] shadow-sm flex items-center gap-1">
                        {idea.tagColor === 'green' ? (
                          <Recycle className="w-3 h-3 text-[#30e86e]" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-purple-500" />
                        )}
                        {idea.tag}
                      </div>
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#30e86e]">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 ${idea.fromColor} text-[10px] font-bold uppercase tracking-wide rounded-md`}>
                          {idea.fromItem}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-300" />
                        <span className={`px-2 py-1 ${idea.toColor} text-[10px] font-bold uppercase tracking-wide rounded-md`}>
                          {idea.toItem}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#111813] mb-1">{idea.title}</h4>
                      <p className="text-xs text-[#63886f] line-clamp-2 mb-4">{idea.description}</p>
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {idea.time}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#25b856]">
                          {idea.tokens}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Card 4 - Inspiration */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => router.push('/dashboard/items')}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#FFFACD]/30" />
                    <div className="text-center p-6 relative z-10">
                      <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                      <p className="font-bold text-sm text-[#111813]">Scan something else!</p>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1 items-center justify-center text-center">
                    <h4 className="font-bold text-[#111813] mb-2">Need Inspiration?</h4>
                    <p className="text-xs text-[#63886f] mb-4">
                      Upload a photo of any household item to generate new ideas.
                    </p>
                    <button className="text-[#25b856] font-bold text-xs hover:underline uppercase tracking-wide">
                      Browse Gallery
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
