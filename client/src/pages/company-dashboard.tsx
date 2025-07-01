import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart, 
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  LineChart as LineChartIcon, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  TrendingUp,
  Eye,
  MousePointerClick,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { InsurancePlan as BasePlan, CompanyProfile } from "../../../shared/types";
import CompanyLayout from "../components/layout/company-layout";
import { format } from "date-fns";

// Types for analytics data
interface PlanAnalytics {
  planId: number;
  planName: string;
  category: string;
  provider: string;
  views: number;
  comparisons: number;
  conversions: number;
  conversionRate: number;
  timeSeries: Array<{
    date: string;
    views: number;
    comparisons: number;
    conversions: number;
  }>;
}

interface AnalyticsResponse {
  summaryStats: {
    totalViews: number;
    totalComparisons: number;
    totalConversions: number;
    totalPlans: number;
    averageConversionRate: number;
    plansByCategory: Record<string, number>;
  };
  plans: PlanAnalytics[];
  topPerformingPlans: Array<{
    id: number;
    name: string;
    category: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }>;
  lastUpdated: string;
}

// Chart theme colors
const CHART_COLORS = {
  primary: "#3b82f6", // blue-500
  secondary: "#8b5cf6", // violet-500
  success: "#10b981", // emerald-500
  warning: "#f59e0b", // amber-500
  danger: "#ef4444", // red-500
  info: "#06b6d4", // cyan-500
};

const CATEGORY_COLORS: Record<string, string> = {
  travel: CHART_COLORS.primary,
  auto: CHART_COLORS.secondary,
  pet: CHART_COLORS.success,
  health: CHART_COLORS.warning,
};

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch company data
  const { data: companyData, isLoading: companyLoading } = useQuery<CompanyProfile>({
    queryKey: ["/api/company/profile"],
    enabled: !!user?.id,
  });

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery<AnalyticsResponse>({
    queryKey: ["/api/company/analytics"],
    enabled: !!user?.id,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch plans data
  const { data: plansData, isLoading: plansLoading } = useQuery<BasePlan[]>({
    queryKey: ["/api/company/plans"],
    enabled: !!user?.id,
  });

  useEffect(() => {
    // Welcoming toast when dashboard loads
    if (companyData?.name) {
      toast({
        title: `Welcome back, ${companyData.name}!`,
        description: "Your analytics dashboard is ready.",
      });
    }
  }, [companyData?.name]);

  // Prepare time series data for charts
  const getAggregatedTimeSeries = () => {
    if (!analyticsData?.plans) return [];

    const aggregatedByDate = new Map<string, { views: number; comparisons: number; conversions: number }>();

    analyticsData.plans.forEach(plan => {
      plan.timeSeries.forEach(point => {
        const existing = aggregatedByDate.get(point.date) || { views: 0, comparisons: 0, conversions: 0 };
        aggregatedByDate.set(point.date, {
          views: existing.views + point.views,
          comparisons: existing.comparisons + point.comparisons,
          conversions: existing.conversions + point.conversions,
        });
      });
    });

    return Array.from(aggregatedByDate.entries())
      .map(([date, data]) => ({
        date,
        ...data,
        conversionRate: data.views > 0 ? (data.conversions / data.views) * 100 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  };

  // Prepare category distribution data
  const getCategoryDistribution = () => {
    if (!analyticsData?.summaryStats.plansByCategory) return [];
    
    return Object.entries(analyticsData.summaryStats.plansByCategory).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      color: CATEGORY_COLORS[category] || CHART_COLORS.info,
    }));
  };

  const renderStatCard = (title: string, value: number | string, change?: number, icon?: React.ReactNode) => {
    const isPositive = change && change > 0;
    
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {change !== undefined && (
              <span className={`ml-2 text-sm flex items-center ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(change)}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <p className="text-slate-300 text-sm mb-2">{format(new Date(label), 'MMM dd, yyyy')}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const isLoading = companyLoading || analyticsLoading;

  return (
    <CompanyLayout activeNav="dashboard">
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-b from-slate-900 to-black text-white min-h-screen">
        <div className="p-4 md:p-6 space-y-6">
          {/* Welcome section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border-0 shadow-xl backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {isLoading ? (
                        <Skeleton className="h-8 w-40 bg-blue-700/30" />
                      ) : (
                        `Welcome back, ${companyData?.name || "Partner"}`
                      )}
                    </h1>
                    <p className="text-blue-200 mt-1">
                      Your insurance analytics at a glance
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                      onClick={() => navigate("/company-dashboard/upload")}
                    >
                      Upload Plans
                    </Button>
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      onClick={() => navigate("/company-dashboard/analysis")}
                    >
                      View Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs navigation */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-5">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 backdrop-blur-sm">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="plans" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Plans Performance
              </TabsTrigger>
              <TabsTrigger 
                value="marketplace" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Marketplace
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-5 mt-5">
              {/* Summary Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Card key={i} className="bg-slate-800/50 border-slate-700/50">
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-24 mb-2 bg-slate-700" />
                        <Skeleton className="h-8 w-32 bg-slate-700" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <>
                    {renderStatCard(
                      "Total Views",
                      analyticsData?.summaryStats.totalViews || 0,
                      12.5,
                      <Eye className="h-4 w-4 text-blue-400" />
                    )}
                    {renderStatCard(
                      "Plan Comparisons",
                      analyticsData?.summaryStats.totalComparisons || 0,
                      8.3,
                      <MousePointerClick className="h-4 w-4 text-violet-400" />
                    )}
                    {renderStatCard(
                      "Conversions",
                      analyticsData?.summaryStats.totalConversions || 0,
                      15.7,
                      <ShoppingCart className="h-4 w-4 text-emerald-400" />
                    )}
                    {renderStatCard(
                      "Conversion Rate",
                      `${(analyticsData?.summaryStats.averageConversionRate || 0).toFixed(1)}%`,
                      undefined,
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                    )}
                  </>
                )}
              </motion.div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Time Series Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-medium text-slate-300">Performance Over Time</CardTitle>
                      <LineChartIcon className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent className="p-6">
                      {isLoading ? (
                        <Skeleton className="h-[300px] w-full bg-slate-700" />
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={getAggregatedTimeSeries()}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#94a3b8"
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                            />
                            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                              wrapperStyle={{ color: '#94a3b8' }}
                              iconType="line"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="views" 
                              stroke={CHART_COLORS.primary}
                              fillOpacity={1}
                              fill="url(#colorViews)"
                              strokeWidth={2}
                              name="Views"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="conversions" 
                              stroke={CHART_COLORS.success}
                              fillOpacity={1}
                              fill="url(#colorConversions)"
                              strokeWidth={2}
                              name="Conversions"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-medium text-slate-300">Plans by Category</CardTitle>
                      <PieChartIcon className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent className="p-6">
                      {isLoading ? (
                        <Skeleton className="h-[300px] w-full bg-slate-700" />
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={getCategoryDistribution()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {getCategoryDistribution().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: '1px solid #475569',
                                borderRadius: '8px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Top Performing Plans */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-300">Top Performing Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {Array(5).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full bg-slate-700" />
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Plan Name</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Category</th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Views</th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Conversions</th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Conv. Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsData?.topPerformingPlans.map((plan, index) => (
                              <tr key={plan.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <span className="text-white font-medium">{plan.name}</span>
                                    {index === 0 && (
                                      <Badge className="ml-2 bg-amber-500/20 text-amber-300">Top</Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge 
                                    variant="outline" 
                                    className="capitalize"
                                    style={{ 
                                      borderColor: CATEGORY_COLORS[plan.category] || CHART_COLORS.info,
                                      color: CATEGORY_COLORS[plan.category] || CHART_COLORS.info
                                    }}
                                  >
                                    {plan.category}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-right text-slate-300">{plan.views.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right text-slate-300">{plan.conversions.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right">
                                  <span className={`font-medium ${plan.conversionRate > 5 ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {plan.conversionRate.toFixed(2)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-5 mt-5">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center backdrop-blur-sm">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-3">Detailed Plan Analytics</h3>
                  <p className="text-slate-400 mb-6">
                    View individual plan performance metrics and insights
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/company-plans")}
                  >
                    Manage Plans
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-5 mt-5">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center backdrop-blur-sm">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-3">Marketplace Insights</h3>
                  <p className="text-slate-400 mb-6">
                    View competitive analysis and positioning of your insurance plans in the global marketplace
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/company-dashboard/marketplace")}
                  >
                    View Marketplace
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-5 mt-5">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center backdrop-blur-sm">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-3">Analytics & Reports</h3>
                  <p className="text-slate-400 mb-6">
                    Generate detailed reports about your plans, subscribers, and market performance
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/company-dashboard/reports")}
                  >
                    Generate Reports
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CompanyLayout>
  );
}