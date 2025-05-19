import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';

export default function AskBrikiPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Ask Briki</h1>
        <p className="text-center text-lg text-gray-500 max-w-3xl mx-auto">
          Get instant answers to all your insurance questions with our AI-powered assistant.
        </p>
      </div>
    </PublicLayout>
  );
}