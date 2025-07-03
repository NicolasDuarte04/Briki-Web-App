import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Smartphone, Tablet, CheckCircle, Search, Calculator, Brain } from 'lucide-react';
import { Button } from '../ui/button';
import { useLocation } from 'wouter';
import { useLanguage } from '../language-selector';

export const ProductDemoPanel: React.FC = () => {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Search className="h-5 w-5" />,
      title: t('demo.feature1.title'),
      description: t('demo.feature1.description')
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      title: t('demo.feature2.title'),
      description: t('demo.feature2.description')
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: t('demo.feature3.title'),
      description: t('demo.feature3.description')
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('demo.badge')}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('demo.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {t('demo.titleHighlight')}
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {t('demo.description')}
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Platform Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('cta.title')}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('cta.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/ask-briki-ai')}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 hover:shadow-lg font-semibold group"
                  >
                    {t('demo.cta')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/home')}
                    className="h-12 px-8 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('hero.ctaBrowse')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Device Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="flex justify-center gap-12 text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <span className="text-sm font-medium">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <Tablet className="h-5 w-5" />
              <span className="text-sm font-medium">Tablet</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm font-medium">Mobile</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 