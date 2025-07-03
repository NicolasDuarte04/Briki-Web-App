import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, ArrowRight, Upload, Zap, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { useLanguage } from '../language-selector';

export const PDFSummaryAnimation: React.FC = () => {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const steps = [
    {
      icon: <Upload className="h-5 w-5" />,
      title: t('pdf.step1.title'),
      description: t('pdf.step1.description')
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: t('pdf.step2.title'),
      description: t('pdf.step2.description')
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: t('pdf.step3.title'),
      description: t('pdf.step3.description')
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {t('pdf.badge')}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {t('pdf.title')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  {t('pdf.titleHighlight')}
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('pdf.description')}
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/ask-briki-ai')}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 hover:shadow-lg font-semibold group"
              >
                {t('pdf.cta')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-600">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white text-lg">Document Analysis</span>
              </div>
              
              <div className="space-y-6 pt-6">
                {/* Document Upload Area */}
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-8 text-center bg-blue-50 dark:bg-blue-900/20">
                  <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('pdf.upload.title')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('pdf.upload.subtitle')}
                  </p>
                </div>

                {/* AI Processing Animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <Zap className="h-4 w-4 text-white" />
                    </motion.div>
                    <span className="font-medium text-gray-900 dark:text-white">{t('pdf.processing')}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('pdf.success1')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('pdf.success2')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('pdf.success3')}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 