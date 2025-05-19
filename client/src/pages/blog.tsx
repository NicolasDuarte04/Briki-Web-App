import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';

export default function BlogPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Blog</h1>
        <p className="text-center text-lg text-gray-500 max-w-3xl mx-auto">
          Stay informed with the latest insurance trends, tips, and insights from our experts.
        </p>
      </div>
    </PublicLayout>
  );
}