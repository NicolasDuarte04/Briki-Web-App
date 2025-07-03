import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      number: "50,000+",
      label: "Happy Customers",
      description: "Colombians trust Briki for their insurance needs"
    },
    {
      icon: <Award className="h-8 w-8" />,
      number: "1,200+",
      label: "Insurance Plans",
      description: "Comprehensive coverage options available"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      number: "< 2 min",
      label: "Average Quote Time",
      description: "Get personalized quotes in under 2 minutes"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      number: "95%",
      label: "Satisfaction Rate",
      description: "Customer satisfaction with our service"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
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
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Proven Results
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Numbers That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Speak
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              See why thousands of Colombians choose Briki as their trusted insurance partner. 
              Our track record speaks for itself.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600 group-hover:scale-110 transition-transform duration-300">
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

          {/* Additional Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Trusted by Leading Colombian Companies
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join the growing community of satisfied customers
              </p>
            </div>

            {/* Partner logos placeholder */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Partner {i}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Licensed and regulated by Colombian insurance authorities
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 