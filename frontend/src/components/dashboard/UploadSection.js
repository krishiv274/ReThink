'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Image as ImageIcon, X, Sparkles, Loader2 } from 'lucide-react';

export default function UploadSection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAiSuggestions({
        itemName: 'Plastic Water Bottle',
        category: 'Plastic Container',
        ideas: [
          { title: 'Plant Watering System', difficulty: 'Easy', ecoPoints: 50 },
          { title: 'Bird Feeder', difficulty: 'Medium', ecoPoints: 75 },
          { title: 'Storage Container', difficulty: 'Easy', ecoPoints: 40 },
          { title: 'Desk Organizer', difficulty: 'Medium', ecoPoints: 60 },
        ],
        materials: ['Scissors', 'String', 'Paint (optional)'],
      });
      setAnalyzing(false);
    }, 2000);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setAiSuggestions(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Item</h2>
        <p className="text-gray-600">Take a photo or upload an image to get AI-powered reuse ideas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.label
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="block"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-black transition-colors cursor-pointer bg-gray-50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your image here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      Upload Image
                    </span>
                  </div>
                </div>
              </motion.label>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl overflow-hidden border-2 border-gray-200"
              >
                <img src={preview} alt="Preview" className="w-full h-96 object-cover" />
                <button
                  onClick={clearSelection}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {preview && !aiSuggestions && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-70 transition-colors"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze with GPT-5 Vision
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* AI Suggestions */}
        <AnimatePresence>
          {aiSuggestions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">AI Analysis</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Item:</strong> {aiSuggestions.itemName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {aiSuggestions.category}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Reuse Ideas</h3>
                <div className="space-y-3">
                  {aiSuggestions.ideas.map((idea, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{idea.title}</p>
                        <p className="text-xs text-gray-500">{idea.difficulty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-green-600">+{idea.ecoPoints} pts</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Save & Get Tutorials
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
