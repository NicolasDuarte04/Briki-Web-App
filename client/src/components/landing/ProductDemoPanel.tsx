import React from 'react';
import { motion } from 'framer-motion';
import { Play, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '../ui/button';

export const ProductDemoPanel: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden">
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
              <Play className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Interactive Demo
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Experience Briki{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                In Action
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              See how easy it is to find, compare, and purchase insurance with our 
              intuitive platform. Available on all your devices.
            </p>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Main Demo Screen */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 flex items-center px-4">
                  <span className="text-sm text-gray-500">app.briki.co</span>
                </div>
              </div>
              
              {/* Demo Content Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <Play className="h-8 w-8 text-blue-600 ml-1" />
                  </motion.div>
                </div>
                
                {/* Floating UI Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3"
                >
                  <div className="text-xs font-medium text-gray-900 dark:text-white">AI Assistant</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Ready to help</div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3"
                >
                  <div className="text-xs font-medium text-gray-900 dark:text-white">Quick Quote</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">$45/month</div>
                </motion.div>
              </div>
            </div>

            {/* Device Icons */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Monitor className="h-5 w-5" />
                <span className="text-sm">Desktop</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Tablet className="h-5 w-5" />
                <span className="text-sm">Tablet</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Smartphone className="h-5 w-5" />
                <span className="text-sm">Mobile</span>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 hover:shadow-xl hover:shadow-blue-500/25 font-semibold"
            >
              Try Interactive Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 