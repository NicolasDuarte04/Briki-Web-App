import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import NewBrikiAssistant from '@/components/briki-ai-assistant/NewBrikiAssistant';
import { PublicLayout } from '@/components/layout/public-layout';

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Simplified Chat Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="h-[700px] lg:h-[800px]">
              <NewBrikiAssistant />
            </div>
          </motion.div>
        </div>
      </main>
    </PublicLayout>
  );
}