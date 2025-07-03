import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageCircle, Search, Target } from 'lucide-react';

export const AIExplainer: React.FC = () => {
  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Natural Conversations",
      description: "Chat with our AI in plain Spanish about your insurance needs. No technical jargon required."
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Plan Discovery",
      description: "Our AI analyzes thousands of insurance plans to find options that match your specific requirements."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Personalized Recommendations",
      description: "Get tailored suggestions based on your age, location, health, and financial situation."
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Continuous Learning",
      description: "Our AI gets smarter with every interaction, providing increasingly accurate recommendations."
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-64 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                AI Technology
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Powered by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                Advanced AI
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Our artificial intelligence understands Colombian insurance regulations, 
              market trends, and personal circumstances to provide expert-level guidance.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* AI Capabilities Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                See How Our AI Helps
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real examples of AI-powered assistance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-blue-600">1M+</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Plans Analyzed</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Insurance options processed</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-green-600">98%</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Accuracy Rate</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Recommendation precision</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-purple-600">24/7</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Always Available</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Round-the-clock assistance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 