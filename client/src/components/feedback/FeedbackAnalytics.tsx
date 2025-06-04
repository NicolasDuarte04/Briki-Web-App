import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Users, 
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface FeedbackSummary {
  totalFeedback: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
  feedbackByType: { type: string; count: number }[];
  feedbackByPage: { page: string; count: number; avgRating: number }[];
  trendData: { date: string; count: number; avgRating: number }[];
  recentFeedback: {
    id: string;
    type: string;
    rating?: number;
    comment: string;
    page: string;
    timestamp: string;
  }[];
}

interface FeedbackAnalyticsProps {
  dateRange?: '7d' | '30d' | '90d';
  autoRefresh?: boolean;
}

const FeedbackAnalytics: React.FC<FeedbackAnalyticsProps> = ({
  dateRange = '30d',
  autoRefresh = true
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [filterType, setFilterType] = useState<string>('all');

  const { data: feedbackSummary, isLoading, refetch } = useQuery<FeedbackSummary>({
    queryKey: ['/api/feedback/analytics', selectedDateRange, filterType],
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
  });

  const ratingColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
  const typeColors = {
    rating: '#3b82f6',
    suggestion: '#8b5cf6',
    bug: '#ef4444',
    feature: '#10b981'
  };

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const exportData = () => {
    if (!feedbackSummary) return;
    
    const csvData = feedbackSummary.recentFeedback.map(feedback => ({
      Date: feedback.timestamp,
      Type: feedback.type,
      Rating: feedback.rating || 'N/A',
      Comment: feedback.comment,
      Page: feedback.page
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-analytics-${selectedDateRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!feedbackSummary) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No feedback data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feedback Analytics</h2>
          <p className="text-gray-600">Real-time user experience insights</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackSummary.totalFeedback}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {feedbackSummary.averageRating.toFixed(1)}
                  </p>
                  <div className="flex">
                    {renderRatingStars(Math.round(feedbackSummary.averageRating))}
                  </div>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((feedbackSummary.totalFeedback / 1000) * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="pages">By Page</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={feedbackSummary.feedbackByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {feedbackSummary.feedbackByType.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={typeColors[entry.type as keyof typeof typeColors] || '#8884d8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={feedbackSummary.ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackSummary.ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium">{item.rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={(item.count / feedbackSummary.totalFeedback) * 100} 
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-16">
                      {item.count} ({((item.count / feedbackSummary.totalFeedback) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feedbackSummary.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip labelFormatter={formatDate} />
                  <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Feedback Count" />
                  <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#f59e0b" name="Avg Rating" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback by Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackSummary.feedbackByPage.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{page.page}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {renderRatingStars(Math.round(page.avgRating))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {page.avgRating.toFixed(1)} avg rating
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {page.count} feedback{page.count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackSummary.recentFeedback.slice(0, 5).map((feedback) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          feedback.type === 'rating' ? 'border-yellow-300 text-yellow-700' :
                          feedback.type === 'suggestion' ? 'border-blue-300 text-blue-700' :
                          feedback.type === 'bug' ? 'border-red-300 text-red-700' :
                          'border-green-300 text-green-700'
                        }`}
                      >
                        {feedback.type}
                      </Badge>
                      {feedback.rating && (
                        <div className="flex">
                          {renderRatingStars(feedback.rating)}
                        </div>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-1">{feedback.comment}</p>
                    <p className="text-sm text-gray-600">From: {feedback.page}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackAnalytics;