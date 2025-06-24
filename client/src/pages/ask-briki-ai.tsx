import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import NewBrikiAssistant from '@/components/briki-ai-assistant/NewBrikiAssistant';
import { PublicLayout } from '@/components/layout/public-layout';
import { ComparisonSidebar } from '@/components/comparison/ComparisonSidebar';

export default function AskBrikiAIPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Ask Briki AI - Your Insurance Assistant | Briki</title>
        <meta
          name="description"
          content="Chat with Briki AI to get personalized insurance recommendations. Our AI assistant helps you find the perfect coverage for your needs."
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Briki Assistant (Left Column) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="h-[800px] lg:h-[850px]">
                <NewBrikiAssistant />
              </div>
            </motion.div>

            {/* Comparison Sidebar (Right Column) */}
            <div className="hidden lg:block">
              <ComparisonSidebar />
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}