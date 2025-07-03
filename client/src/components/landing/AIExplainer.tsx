import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageCircle, Search, Target } from 'lucide-react';
import { useLanguage } from '../language-selector';

export const AIExplainer: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: t('ai.feature1.title'),
      description: t('ai.feature1.description')
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: t('ai.feature2.title'),
      description: t('ai.feature2.description')
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: t('ai.feature3.title'),
      description: t('ai.feature3.description')
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: t('ai.feature4.title'),
      description: t('ai.feature4.description')
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-20">
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
                {t('ai.badge')}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('ai.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                {t('ai.titleHighlight')}
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {t('ai.description')}
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-600 shadow-md mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
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