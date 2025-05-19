import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  Search,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  CircleDollarSign,
  Shield,
  FileUp,
  Download,
  Filter,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { 
  LineChart, 
  Line, 
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
  Legend,
  Area,
  AreaChart
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import CompanyLayout from "@/components/layout/company-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Simulated performance data for the year
const yearlyPerformanceData = [
  { month: "Jan", thisYear: 32000, lastYear: 15000 },
  { month: "Feb", thisYear: 38000, lastYear: 17500 },
  { month: "Mar", thisYear: 45000, lastYear: 21000 },
  { month: "Apr", thisYear: 59000, lastYear: 28000 },
  { month: "May", thisYear: 52000, lastYear: 32000 },
  { month: "Jun", thisYear: 57000, lastYear: 34000 },
];

// Simulated insurance plans data
const insurancePlansData = [
  { 
    id: 1, 
    name: "Standard Travel", 
    type: "Travel", 
    coverage: "$500,000", 
    status: "Active",
    updated: "2 days ago" 
  },
  { 
    id: 2, 
    name: "Essential Health", 
    type: "Health", 
    coverage: "$250,000", 
    status: "Active",
    updated: "1 week ago" 
  },
  { 
    id: 3, 
    name: "Premier Travel", 
    type: "Travel", 
    coverage: "$1,000,000", 
    status: "Inactive",
    updated: "2 weeks ago" 
  },
  { 
    id: 4, 
    name: "Basic Auto", 
    type: "Auto", 
    coverage: "$50,000", 
    status: "Active",
    updated: "1 month ago" 
  },
];

// Simulated competitive analysis score
const competitiveScore = 78;

// Color constants
const CHART_COLORS = {
  thisYear: "#33BFFF",
  lastYear: "#0055CC",
  blue: "#1570EF",
  lightBlue: "#33BFFF",
  teal: "#06AED4",
  navy: "#0A2540",
  highlight: "#06AED4",
  background: "#01101F"
};

// Types of insurance for filter tabs
const insuranceTypes = ["Travel", "Health", "Auto", "Pet", "Home"];

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("year");
  const [selectedPlanType, setSelectedPlanType] = useState("Travel");

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Overview</h1>
          <p className="text-gray-400">Analyze your insurance plans and gain competitive insights</p>
        </div>
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Performance Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59] overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-xl">Plan Performance</CardTitle>
                  <Tabs defaultValue="year" className="w-auto" onValueChange={setTimeRange}>
                    <TabsList className="bg-[#01101F]">
                      <TabsTrigger value="year">This year</TabsTrigger>
                      <TabsTrigger value="quarter">Quarter</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={yearlyPerformanceData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.thisYear} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={CHART_COLORS.thisYear} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.lastYear} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={CHART_COLORS.lastYear} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        stroke="#556581"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#556581"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value >= 1000 ? `${value/1000}K` : value}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3A59" opacity={0.3} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#0A2540", 
                          borderColor: "#1E3A59",
                          borderRadius: "6px",
                          color: "#fff" 
                        }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#33BFFF", fontWeight: "bold" }}
                        formatter={(value) => [`$${value.toLocaleString()}`, '']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="thisYear" 
                        stroke={CHART_COLORS.thisYear} 
                        fillOpacity={1} 
                        fill="url(#colorThisYear)" 
                        name="This year"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lastYear" 
                        stroke={CHART_COLORS.lastYear} 
                        fillOpacity={1} 
                        fill="url(#colorLastYear)" 
                        name="Last year"
                      />
                      <Legend 
                        verticalAlign="top" 
                        align="left"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '10px' }}
                        formatter={(value) => <span style={{ color: '#fff', fontSize: '12px' }}>{value}</span>}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Insurance Plans Table */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader className="pb-2 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <CardTitle className="text-white text-xl">Insurance Plans</CardTitle>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <div className="relative w-full md:w-[240px]">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search plans"
                        className="pl-8 bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF] w-full"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="border-[#1E3A59] text-gray-400 hover:text-white hover:bg-[#1E3A59]">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Filter pills */}
                <div className="flex flex-wrap gap-2">
                  {insuranceTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedPlanType === type ? "default" : "outline"}
                      size="sm"
                      className={selectedPlanType === type ? 
                        "bg-[#1570EF] hover:bg-[#0E63D6] text-white" : 
                        "border-[#1E3A59] text-gray-300 hover:text-white hover:bg-[#1E3A59]"
                      }
                      onClick={() => setSelectedPlanType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1E3A59]">
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Coverage</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insurancePlansData.map((plan) => (
                        <tr 
                          key={plan.id} 
                          className="border-b border-[#1E3A59] hover:bg-[#01101F] cursor-pointer"
                        >
                          <td className="p-4 text-white text-sm">{plan.name}</td>
                          <td className="p-4 text-white text-sm">{plan.type}</td>
                          <td className="p-4 text-white text-sm">{plan.coverage}</td>
                          <td className="p-4">
                            <Badge
                              className={
                                plan.status === "Active" 
                                  ? "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20" 
                                  : "bg-amber-600/10 text-amber-500 hover:bg-amber-600/20 border-amber-500/20"
                              }
                            >
                              {plan.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-400 text-sm">{plan.updated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - 1/3 width */}
          <div className="space-y-6">
            {/* Competitive Analysis Score Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader className="pb-0">
                <CardTitle className="text-white">Competitive Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col items-center text-center">
                  <div className="text-7xl font-bold text-[#33BFFF] mb-1">{competitiveScore}%</div>
                  <p className="text-gray-300 mb-6">Better than average</p>
                  
                  {/* Chart visualization */}
                  <div className="w-full h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        {name: 'Jan', value: 52},
                        {name: 'Feb', value: 59},
                        {name: 'Mar', value: 63},
                        {name: 'Apr', value: 70},
                        {name: 'May', value: 74},
                        {name: 'Jun', value: 78},
                      ]}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={CHART_COLORS.lightBlue} 
                          strokeWidth={2}
                          dot={false}
                        />
                        <YAxis hide domain={[40, 90]} />
                        <XAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#1570EF] hover:bg-[#0E63D6] text-white text-sm"
                    onClick={() => window.location.href = '/company-dashboard/analysis'}
                  >
                    Benchmark Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center text-white border-[#1E3A59] hover:bg-[#01101F] hover:border-[#33BFFF]"
                  onClick={() => window.location.href = '/company-dashboard/upload'}
                >
                  <div className="flex items-center">
                    <FileUp className="h-4 w-4 mr-2 text-[#33BFFF]" />
                    <span>Upload New Plan</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center text-white border-[#1E3A59] hover:bg-[#01101F] hover:border-[#33BFFF]"
                >
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2 text-[#33BFFF]" />
                    <span>Export Report</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center text-white border-[#1E3A59] hover:bg-[#01101F] hover:border-[#33BFFF]"
                  onClick={() => window.location.href = '/company-dashboard/marketplace'}
                >
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-[#33BFFF]" />
                    <span>View Marketplace Profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            {/* Optimization Tips Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#33BFFF]" />
                  Plan Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Badge className="bg-amber-600/10 text-amber-500 mr-2">Auto</Badge>
                      <p className="text-white text-sm font-medium">Basic Auto Plan</p>
                    </div>
                    <Badge variant="outline" className="border-[#1E3A59] text-gray-400">20% below market</Badge>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Your coverage limit is significantly below market average. Consider increasing to remain competitive.
                  </p>
                </div>
                
                <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Badge className="bg-emerald-600/10 text-emerald-500 mr-2">Travel</Badge>
                      <p className="text-white text-sm font-medium">Standard Travel</p>
                    </div>
                    <Badge variant="outline" className="border-[#1E3A59] text-gray-400">Missing feature</Badge>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    92% of competitors include emergency evacuation. Add this feature to improve competitiveness.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="text-[#33BFFF] hover:text-white p-0 h-auto text-sm"
                  onClick={() => window.location.href = '/company-dashboard/analysis'}
                >
                  View all optimization suggestions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}