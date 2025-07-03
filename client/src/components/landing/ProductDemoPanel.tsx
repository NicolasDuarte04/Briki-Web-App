import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Smartphone, Tablet, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useLocation } from 'wouter';

export const ProductDemoPanel: React.FC = () => {
  const [, navigate] = useLocation();

  const features = [
    "Real-time plan comparison",
    "AI-powered recommendations", 
    "Instant quote generation",
    "Document analysis"
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
                Live Platform
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Experience Briki{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Right Now
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Our platform is live and ready to help you find the perfect insurance coverage. 
              Start comparing plans and get instant quotes today.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
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
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white font-medium">{feature}</span>
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
                  Ready to Get Started?
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Join thousands of Colombians who are already using Briki to find better insurance coverage. 
                  Our AI assistant is ready to help you right now.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/ask-briki-ai')}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 hover:shadow-lg font-semibold group"
                  >
                    Start with AI Assistant
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/home')}
                    className="h-12 px-8 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Browse Plans
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