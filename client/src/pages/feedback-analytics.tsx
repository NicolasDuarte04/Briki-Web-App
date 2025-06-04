import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FeedbackAnalytics from '@/components/feedback/FeedbackAnalytics';
import { BarChart3, TrendingUp, Users, MessageSquare } from 'lucide-react';

export default function FeedbackAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Feedback Analytics
              </h1>
              <p className="text-gray-600">
                Real-time insights into user experience and satisfaction
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Real-time Data</h3>
                <p className="text-sm text-gray-600">Live feedback collection</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">User Insights</h3>
                <p className="text-sm text-gray-600">Behavioral patterns</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Actionable Data</h3>
                <p className="text-sm text-gray-600">Improvement opportunities</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FeedbackAnalytics />
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Collect Feedback</h4>
                  <p className="text-sm text-gray-600">
                    Users provide ratings, suggestions, bug reports, and feature requests through our floating widget
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Analyze Patterns</h4>
                  <p className="text-sm text-gray-600">
                    Real-time analytics identify trends, popular pages, and areas needing improvement
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Take Action</h4>
                  <p className="text-sm text-gray-600">
                    Use insights to make data-driven improvements to user experience and platform features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                  Rating
                </Badge>
                <span className="text-sm text-gray-600">Overall experience ratings from 1-5 stars</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  Suggestion
                </Badge>
                <span className="text-sm text-gray-600">Ideas for platform improvements and enhancements</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                  Bug Report
                </Badge>
                <span className="text-sm text-gray-600">Technical issues and problems encountered</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  Feature Request
                </Badge>
                <span className="text-sm text-gray-600">New functionality and capabilities users want</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}