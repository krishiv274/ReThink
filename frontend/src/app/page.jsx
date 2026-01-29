'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Recycle, 
  Sparkles,
  ArrowRight,
  Camera,
  Lightbulb,
  CheckCircle2,
  Star,
  Leaf,
  Upload,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const steps = [
    {
      icon: Camera,
      title: 'Upload Your Item',
      description: 'Take a photo of any item you want to reuse or repurpose',
      color: 'bg-blue-500',
    },
    {
      icon: Sparkles,
      title: 'Get AI Ideas',
      description: 'Our AI analyzes your item and generates creative reuse ideas',
      color: 'bg-purple-500',
    },
    {
      icon: CheckCircle2,
      title: 'Track Progress',
      description: 'Complete ideas and track your sustainability journey',
      color: 'bg-green-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Eco Enthusiast',
      quote: 'ReTh!nk completely changed how I look at everyday items. The AI suggestions are incredibly creative!',
      avatar: 'S',
    },
    {
      name: 'James K.',
      role: 'DIY Creator',
      quote: 'I\'ve saved so much money by reusing things I would have thrown away. Highly recommend!',
      avatar: 'J',
    },
    {
      name: 'Priya R.',
      role: 'Sustainability Blogger',
      quote: 'Finally an app that makes sustainability fun and accessible. Love the progress tracking!',
      avatar: 'P',
    },
  ];

  const features = [
    { icon: Zap, text: 'AI-Powered Ideas' },
    { icon: Recycle, text: 'Track Progress' },
    { icon: Leaf, text: 'Go Green' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ReTh!nk
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => router.push('/login')}
              className="px-5 py-2.5 text-gray-700 font-medium hover:text-green-600 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Sustainability</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Give Your Items a
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"> Second Life</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload any item and get creative AI-powered ideas to reuse, repurpose, and recycle. 
              Track your progress and make a real impact on the environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/signup')}
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-green-300 hover:bg-green-50/50 transition-all"
              >
                I Have an Account
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                  <feature.icon className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to start your sustainability journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                    <div className="relative inline-block mb-6">
                      <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md font-bold text-gray-700">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Eco-Warriors
            </h2>
            <p className="text-xl text-gray-600">
              See what our community is saying
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-xl mx-auto">
                Join thousands of people creating a more sustainable future, one reuse at a time.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/signup')}
                className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ReTh!nk
              </span>
            </div>
            <p className="text-gray-500 text-center">
              Building a sustainable future, one reuse at a time.
            </p>
            <p className="text-sm text-gray-400">
              © 2026 ReTh!nk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

