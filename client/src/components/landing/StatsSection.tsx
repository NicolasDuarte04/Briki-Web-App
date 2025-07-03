import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Clock, Shield, Star } from 'lucide-react';
import { useLanguage } from '../language-selector';

export const StatsSection: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      number: "50,000+",
      label: t('stats.users'),
      description: "Colombians trust Briki for their insurance needs"
    },
    {
      icon: <Award className="h-8 w-8" />,
      number: "1,200+",
      label: t('stats.plans'),
      description: "Comprehensive coverage options available"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      number: "35%",
      label: t('stats.savings'),
      description: "Average customer savings on premiums"
    },
    {
      icon: <Star className="h-8 w-8" />,
      number: "4.8/5",
      label: t('stats.rating'),
      description: "Customer satisfaction with our service"
    }
  ];

  const trustIndicators = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "SUPERSALUD Approved",
      description: "Licensed by Colombian authorities"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Industry Recognition",
      description: "Award-winning AI technology"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Trusted",
      description: "Growing network of satisfied users"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-24 relative overflow-hidden">
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
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Proven Results
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('stats.title')}
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {t('stats.subtitle')}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    {stat.icon}
                  </div>
                  
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, type: "spring" }}
                      className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                      {stat.number}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-5xl mx-auto border border-gray-100 dark:border-gray-700"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted & Regulated
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Operating with full compliance and industry recognition
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-md">
                    {indicator.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {indicator.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {indicator.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 