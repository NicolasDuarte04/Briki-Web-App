import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, ArrowRight } from 'lucide-react';

export const PDFSummaryAnimation: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  AI-Powered Analysis
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Upload Your Documents,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Get Instant Insights
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Our AI assistant can analyze your existing insurance documents, 
                medical records, and financial information to provide personalized 
                recommendations and identify coverage gaps.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Upload Documents</h3>
                  <p className="text-gray-600 dark:text-gray-300">Drag & drop your insurance PDFs, medical records, or financial documents</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300">Our AI extracts key information and identifies your coverage needs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Personalized Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get tailored insurance suggestions based on your unique situation</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animation Side - Placeholder for now */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-600">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Document Analysis</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full mb-2"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-3/4"></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-full"></div>
                    <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-4/5"></div>
                    <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 