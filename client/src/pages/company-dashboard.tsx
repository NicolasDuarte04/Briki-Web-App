import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { LineChart, BarChart, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { InsurancePlan as BasePlan, CompanyProfile, InsuranceCategory } from "@shared/types";
import CompanyLayout from "@/components/layout/company-layout";

// Extended InsurancePlan type that includes our dashboard-specific fields
interface ExtendedInsurancePlan extends BasePlan {
  subscribers?: number;
  trend?: number;
}

// Mock data for insurance plan analytics
interface MockPlan {
  id: number;
  name: string;
  category: string;
  subscribers: number;
  trend: number;
}

const mockPlans: MockPlan[] = [
  { id: 1, name: "Travel Pro", category: "travel", subscribers: 1243, trend: +12.5 },
  { id: 2, name: "Auto Shield Plus", category: "auto", subscribers: 876, trend: -3.2 },
  { id: 3, name: "Pet Care Complete", category: "pet", subscribers: 421, trend: +8.7 },
  { id: 4, name: "Health Essentials", category: "health", subscribers: 956, trend: +5.1 },
];

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch company data
  const { data: companyData, isLoading } = useQuery<CompanyProfile>({
    queryKey: ["/api/company/profile"],
    enabled: !!user?.id,
  });

  // Fetch plans data
  const { data: plansData, isLoading: plansLoading } = useQuery<ExtendedInsurancePlan[]>({
    queryKey: ["/api/company/plans"],
    enabled: !!user?.id,
  });

  useEffect(() => {
    // Welcoming toast when dashboard loads
    toast({
      title: "Welcome to your dashboard",
      description: "View your analytics and manage your insurance plans.",
    });
  }, [toast]);

  // Placeholder for analytics data
  const analyticsData = {
    totalPlans: plansData?.length || mockPlans.length,
    activeSubscribers: mockPlans.reduce((sum, plan) => sum + plan.subscribers, 0),
    monthlyGrowth: 8.4,
    competitiveRank: 3,
  };

  const renderPlanList = () => {
    const plans = plansData || mockPlans;

    if (plansLoading) {
      return Array(4).fill(0).map((_, i) => (
        <Card key={i} className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4 bg-slate-700" />
              <Skeleton className="h-10 w-full bg-slate-700" />
              <Skeleton className="h-4 w-1/2 bg-slate-700" />
            </div>
          </CardContent>
        </Card>
      ));
    }

    return plans.map((plan) => (
      <Card key={plan.id} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-white">{plan.name}</h3>
              <div className="text-sm text-slate-400 mt-1 capitalize">
                {plan.category} Insurance 
                {plan.subscribers !== undefined && (
                  <> • {plan.subscribers.toLocaleString()} subscribers</>
                )}
              </div>
            </div>
            {plan.trend !== undefined && (
              <Badge 
                variant={(plan.trend > 0) ? "success" : "destructive"}
                className={`mt-1 ${(plan.trend > 0) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}
              >
                {(plan.trend > 0) ? '+' : ''}{plan.trend}%
              </Badge>
            )}
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Competitive Index</span>
              <span>72/100</span>
            </div>
            <Progress value={72} className="h-1.5 bg-slate-700" />
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" size="sm" 
              className="text-xs bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
              View Details
            </Button>
            <Button variant="ghost" size="sm" 
              className="text-xs text-blue-300 hover:bg-blue-900/30 hover:text-blue-200">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <CompanyLayout activeNav="dashboard">
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-b from-slate-900 to-black text-white">
        <div className="p-4 md:p-6 space-y-6">
          {/* Welcome section */}
          <Card className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border-0 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {isLoading ? (
                      <Skeleton className="h-8 w-40 bg-blue-700/30" />
                    ) : (
                      `Welcome, ${companyData?.name || user?.companyProfile?.name || "Partner"}`
                    )}
                  </h1>
                  <p className="text-blue-200 mt-1">
                    Here's the latest on your insurance plans and market position
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

          {/* Tabs navigation */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-5">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
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
                Plans
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
              {/* Analytics overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-slate-300">Total Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{analyticsData.totalPlans}</span>
                      <span className="ml-2 text-sm text-green-400">+2 this month</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Most recent: Travel Pro Essential
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-slate-300">Active Subscribers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{analyticsData.activeSubscribers.toLocaleString()}</span>
                      <span className="ml-2 text-sm text-green-400">+175 this week</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      12% increase from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-slate-300">Monthly Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{analyticsData.monthlyGrowth}%</span>
                      <span className="ml-2 text-sm text-green-400">↑ 2.3%</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Exceeding target by 1.4%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-slate-300">Competitive Rank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">#{analyticsData.competitiveRank}</span>
                      <span className="ml-2 text-sm text-green-400">Improved 2 spots</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Top 5% in Travel Insurance
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium text-slate-300">Subscriber Growth</CardTitle>
                    <LineChart className="h-5 w-5 text-slate-400" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[240px] flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="text-center">
                        <BarChart className="h-16 w-16 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400">Interactive chart rendered here</p>
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 text-sm mt-2">
                          View detailed report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium text-slate-300">Plan Distribution</CardTitle>
                    <PieChart className="h-5 w-5 text-slate-400" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[240px] flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400">Interactive chart rendered here</p>
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 text-sm mt-2">
                          View detailed report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-5 mt-5">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold text-white">Your Insurance Plans</h2>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate("/company-plans")}
                >
                  Manage Plans
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderPlanList()}
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-5 mt-5">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
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
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-3">Analytics & Reports</h3>
                  <p className="text-slate-400 mb-6">
                    Detailed reports and analytics about your plans, subscribers, and market performance
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