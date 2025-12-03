'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, RefreshCw, Loader2, CheckCircle, Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function IdeasSection({ 
  item, 
  ideas = [], 
  difficulties = [],
  completedIdeas = [],
  aiAnalyzed = false,
  onGenerateIdeas, 
  onRegenerateIdeas,
  onCompleteIdea,
  onGenerateMore,
  loading = false 
}) {
  const hasIdeas = ideas && ideas.length > 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completingIndex, setCompletingIndex] = useState(null);

  // Helper function to parse idea text
  const parseIdea = (ideaText) => {
    // Check if idea has **Title** format
    const titleMatch = ideaText.match(/^\*\*([^*]+)\*\*\s*/);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      const description = ideaText.replace(/^\*\*[^*]+\*\*\s*/, '').trim();
      return { title, description };
    }
    // Fallback: use full text as description
    return { title: null, description: ideaText };
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleNext = () => {
    if (currentIndex < ideas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = async (index) => {
    setCompletingIndex(index);
    await onCompleteIdea?.(index, difficulties[index]);
    setCompletingIndex(null);
  };

  const isCompleted = (index) => {
    return completedIdeas[index] === true;
  };

  const currentIdea = ideas[currentIndex];
  const isLastCard = currentIndex === ideas.length - 1;

  return (
    <div className="border-t border-green-100 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Reuse Ideas</h2>
            <p className="text-sm text-gray-600">
              {hasIdeas ? `${ideas.length} creative ways to reuse this item` : 'Get AI-powered sustainability ideas'}
            </p>
          </div>
        </div>

        {hasIdeas && (
          <button
            onClick={onRegenerateIdeas}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 text-center border border-green-100"
          >
            <Loader2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Analyzing Your Item...
            </h3>
            <p className="text-gray-600">
              Our AI is studying the image and material to generate creative reuse ideas
            </p>
          </motion.div>
        ) : hasIdeas ? (
          <div className="space-y-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {ideas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-green-600' 
                      : isCompleted(index)
                      ? 'w-2 bg-green-400'
                      : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Go to idea ${index + 1}`}
                />
              ))}
            </div>

            {/* Card Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-2xl p-8 border-2 transition-all ${
                  isCompleted(currentIndex)
                    ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-400'
                    : 'bg-white border-green-100 hover:border-green-200'
                }`}
              >
                {/* Completed Badge */}
                {isCompleted(currentIndex) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-full text-sm font-semibold shadow-lg">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </div>
                  </motion.div>
                )}

                {/* Card Number */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                      isCompleted(currentIndex)
                        ? 'bg-green-600'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {currentIndex + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Header with Title and Difficulty */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {parseIdea(currentIdea).title && (
                        <h3 className={`text-2xl font-bold transition-colors ${
                          isCompleted(currentIndex) ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          {parseIdea(currentIdea).title}
                        </h3>
                      )}
                      {!isCompleted(currentIndex) && (
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getDifficultyColor(difficulties[currentIndex])} whitespace-nowrap`}>
                          {difficulties[currentIndex] || 'Medium'}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className={`text-lg leading-relaxed mb-6 ${
                      isCompleted(currentIndex) ? 'text-green-900' : 'text-gray-700'
                    }`}>
                      {parseIdea(currentIdea).description}
                    </p>

                    {/* Action Button */}
                    {!isCompleted(currentIndex) && (
                      <button
                        onClick={() => handleComplete(currentIndex)}
                        disabled={completingIndex === currentIndex}
                        className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 rounded-xl font-semibold transition-all disabled:opacity-50"
                      >
                        {completingIndex === currentIndex ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Mark as Complete (+{difficulties[currentIndex] === 'Easy' ? '20' : difficulties[currentIndex] === 'Hard' ? '60' : '40'} pts)
                          </>
                        )}
                      </button>
                    )}

                    {isCompleted(currentIndex) && (
                      <div className="flex items-center gap-2 text-green-700 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        You've completed this idea and earned +{difficulties[currentIndex] === 'Easy' ? '20' : difficulties[currentIndex] === 'Hard' ? '60' : '40'} Th!nk Score!
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate More Button on Last Card */}
                {isLastCard && onGenerateMore && (
                  <div className="mt-8 pt-6 border-t border-green-200">
                    <button
                      onClick={onGenerateMore}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-green-300 hover:border-green-400 bg-green-50 hover:bg-green-100 rounded-xl font-semibold text-green-700 transition-all disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                      Generate 5 More Ideas
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-gray-600 font-medium">
                {currentIndex + 1} of {ideas.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentIndex === ideas.length - 1}
                className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* AI Generated Badge */}
            {aiAnalyzed && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 mt-4">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">AI-Generated Ideas</span>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-12 text-center border border-green-100 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-30" />
            
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
              >
                <Lightbulb className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Unlock AI-Powered Ideas
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Let our AI analyze this {item?.material?.toLowerCase() || 'item'} and suggest creative, sustainable ways to give it a second life.
              </p>
              
              <button
                onClick={onGenerateIdeas}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                Generate Ideas with AI
              </button>

              <p className="text-xs text-gray-500 mt-4">
                +50 Th!nk Score • Powered by Google Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
