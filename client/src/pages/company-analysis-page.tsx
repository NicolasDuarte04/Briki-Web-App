import { useState } from "react";
import {
  BarChart4,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Filter,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  ZoomIn,
  Shield,
  Radar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import CompanyLayout from "../components/layout/company-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useToast } from "../hooks/use-toast";

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
  Area,
  AreaChart,
  Radar as RechartsRadar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

// Sample insurance plan data
const insurancePlans = [
  {
    id: 1,
    name: "Standard Travel",
    type: "Travel",
    coverage: "$500,000",
    price: "$25/month",
    competitiveScore: 78,
    status: "Active",
    chartColor: "#33BFFF"
  },
  {
    id: 2,
    name: "Premier Travel",
    type: "Travel",
    coverage: "$1,000,000",
    price: "$45/month",
    competitiveScore: 63,
    status: "Inactive",
    chartColor: "#0074FF"
  },
  {
    id: 3,
    name: "Basic Auto",
    type: "Auto",
    coverage: "$50,000",
    price: "$120/month",
    competitiveScore: 42,
    status: "Active",
    chartColor: "#1570EF"
  },
  {
    id: 4,
    name: "Essential Health",
    type: "Health",
    coverage: "$250,000",
    price: "$180/month",
    competitiveScore: 67,
    status: "Active",
    chartColor: "#06AED4"
  },
];

// Market comparison data
const marketComparisonData = [
  { name: "Base Price", you: 80, average: 65, best: 45 },
  { name: "Coverage", you: 85, average: 65, best: 90 },
  { name: "Features", you: 60, average: 55, best: 95 },
  { name: "Flexibility", you: 75, average: 50, best: 85 },
  { name: "Claims Process", you: 90, average: 70, best: 95 },
];

// Feature comparison data
const featureComparisonData = [
  { feature: "Emergency Medical", yourPlan: true, competitors: 98 },
  { feature: "Trip Cancellation", yourPlan: true, competitors: 92 },
  { feature: "Lost Baggage", yourPlan: true, competitors: 88 },
  { feature: "Travel Delay", yourPlan: true, competitors: 76 },
  { feature: "Emergency Evacuation", yourPlan: false, competitors: 72 },
  { feature: "Adventure Sports", yourPlan: false, competitors: 45 },
  { feature: "Pre-existing Conditions", yourPlan: false, competitors: 32 },
  { feature: "Rental Car Coverage", yourPlan: true, competitors: 68 },
];

// Pricing tiers comparison data
const pricingTiersData = [
  { name: "18-30", you: 25, marketAverage: 28, marketBest: 20 },
  { name: "31-40", you: 35, marketAverage: 32, marketBest: 27 },
  { name: "41-50", you: 45, marketAverage: 41, marketBest: 38 },
  { name: "51-60", you: 55, marketAverage: 58, marketBest: 52 },
  { name: "61+", you: 65, marketAverage: 78, marketBest: 65 },
];

// Trend comparison data
const trendData = [
  { month: "Jan", you: 24, marketAverage: 26 },
  { month: "Feb", you: 27, marketAverage: 27 },
  { month: "Mar", you: 30, marketAverage: 29 },
  { month: "Apr", you: 28, marketAverage: 32 },
  { month: "May", you: 32, marketAverage: 35 },
  { month: "Jun", you: 33, marketAverage: 37 },
];

// Radar chart data (Competitive positioning)
const radarData = [
  { subject: "Price", A: 85, B: 65, fullMark: 100 },
  { subject: "Coverage", A: 80, B: 75, fullMark: 100 },
  { subject: "Features", A: 65, B: 80, fullMark: 100 },
  { subject: "Claims", A: 90, B: 70, fullMark: 100 },
  { subject: "Customer Exp", A: 75, B: 65, fullMark: 100 },
];

// Customer feedback sentiment data
const sentimentData = [
  { name: "Very Positive", value: 35 },
  { name: "Positive", value: 42 },
  { name: "Neutral", value: 18 },
  { name: "Negative", value: 3 },
  { name: "Very Negative", value: 2 },
];

// SWOT analysis data
const strengthsData = [
  "Competitive pricing for younger demographics (18-40)",
  "Excellent emergency medical coverage limits",
  "Superior claims processing speed (90th percentile)",
  "Mobile app functionality rated above competitors"
];

const weaknessesData = [
  "Missing emergency evacuation coverage (found in 72% of competitor plans)",
  "Premium rate increases more sharply for 51+ age band",
  "Limited adventure sports coverage compared to market",
  "Claims form complexity rated below average"
];

const opportunitiesData = [
  "Add emergency evacuation for premium tier only",
  "Bundle with car rental insurance for increased attach rate",
  "Target digital nomads with extended stay coverage",
  "Partner with airlines for exclusive distribution channel"
];

const threatsData = [
  "New market entrant with 15% lower base premium",
  "Regulatory changes may require pre-existing condition coverage",
  "Customer price sensitivity increasing in current economic climate",
  "Rising medical costs in popular travel destinations"
];

// Color constants
const CHART_COLORS = {
  primary: "#33BFFF",
  secondary: "#0055CC",
  tertiary: "#06AED4",
  quaternary: "#1570EF",
  background: "#01101F",
  positive: "#10B981",
  negative: "#EF4444",
  neutral: "#6B7280"
};

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary, 
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  "#8B5CF6"
];

export default function CompanyAnalysisPage() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(insurancePlans[0].id);
  const [analysisType, setAnalysisType] = useState("general");
  const [viewMode, setViewMode] = useState("chart");
  
  // Get the selected plan data
  const planData = insurancePlans.find(plan => plan.id === selectedPlan) || insurancePlans[0];
  
  // Export analysis report
  const exportReport = () => {
    toast({
      title: "Export initiated",
      description: "Your analysis report is being generated and will download shortly.",
    });
    
    // Simulate a download delay
    setTimeout(() => {
      toast({
        title: "Report downloaded",
        description: "The analysis report has been downloaded to your device.",
      });
    }, 2000);
  };
  
  // Generate AI insights
  const generateInsights = () => {
    toast({
      title: "Generating insights",
      description: "Our AI is analyzing your plan data to provide strategic recommendations.",
    });
    
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "AI insights ready",
        description: "New strategic recommendations have been added to your analysis.",
      });
    }, 3000);
  };

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">Competitive Analysis</h1>
            <p className="text-gray-400">Benchmark your insurance plans against the market</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="outline" 
              className="border-[#1E3A59] text-white hover:bg-[#01101F] hover:border-[#33BFFF]"
              onClick={exportReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              className="bg-[#1570EF] hover:bg-[#0E63D6] text-white"
              onClick={generateInsights}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        </div>
        
        {/* Plan Selection & Analysis Options */}
        <Card className="bg-[#0A2540] border-[#1E3A59]">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
              <CardTitle className="text-white">Insurance Plan Analysis</CardTitle>
              
              <div className="flex flex-wrap items-center gap-3">
                <Select 
                  value={selectedPlan.toString()} 
                  onValueChange={(value) => setSelectedPlan(parseInt(value))}
                >
                  <SelectTrigger className="bg-[#01101F] border-[#1E3A59] w-[180px] text-white">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                    {insurancePlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Tabs 
                  value={viewMode} 
                  onValueChange={setViewMode}
                  className="hidden md:block"
                >
                  <TabsList className="bg-[#01101F]">
                    <TabsTrigger value="chart">
                      <BarChart4 className="h-4 w-4 mr-2" />
                      Charts
                    </TabsTrigger>
                    <TabsTrigger value="table">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Tables
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-[#01101F] rounded-md p-4 border border-[#1E3A59]">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-md bg-gradient-to-r from-[#1570EF] to-[#33BFFF]">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">{planData.name}</h3>
                  <div className="flex items-center mt-1 space-x-3">
                    <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">
                      {planData.type}
                    </Badge>
                    <span className="text-gray-400 text-sm">{planData.coverage} Coverage</span>
                    <span className="text-gray-400 text-sm">{planData.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center">
                <div className="pr-6 border-r border-[#1E3A59]">
                  <div className="text-sm text-gray-400">Competitive Score</div>
                  <div className="text-2xl font-bold text-white">{planData.competitiveScore}%</div>
                </div>
                <div className="pl-6">
                  <div className="text-sm text-gray-400">Status</div>
                  <Badge
                    className={
                      planData.status === "Active" 
                        ? "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20" 
                        : "bg-amber-600/10 text-amber-500 hover:bg-amber-600/20 border-amber-500/20"
                    }
                  >
                    {planData.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Tabs 
              defaultValue="general" 
              className="mt-6"
              onValueChange={setAnalysisType}
            >
              <TabsList className="bg-[#01101F] w-full justify-start overflow-auto">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
                <TabsTrigger value="trends">Market Trends</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Analysis Content */}
        {analysisType === "general" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Comparison Chart */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Market Comparison</CardTitle>
                  <CardDescription className="text-gray-400">
                    How your plan compares across key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={marketComparisonData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3A59" opacity={0.3} vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#556581" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#556581" 
                          domain={[0, 100]}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: "#0A2540", 
                            borderColor: "#1E3A59",
                            borderRadius: "6px",
                            color: "#fff" 
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`${value}%`, '']}
                        />
                        <Legend 
                          formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                          wrapperStyle={{ paddingTop: "15px" }}
                        />
                        <Bar 
                          dataKey="you" 
                          name="Your Plan" 
                          fill={CHART_COLORS.primary} 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="average" 
                          name="Market Average" 
                          fill={CHART_COLORS.secondary} 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="best" 
                          name="Market Best" 
                          fill={CHART_COLORS.tertiary} 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1E3A59] pt-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                    <div className="text-gray-400 text-sm">
                      Analysis based on 48 competing plans in the {planData.type.toLowerCase()} insurance category
                    </div>
                    <Button 
                      variant="link" 
                      className="text-[#33BFFF] hover:text-white p-0 h-auto text-sm"
                    >
                      <ZoomIn className="h-4 w-4 mr-2" />
                      View detailed comparison
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Radar Chart - Competitive Positioning */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Competitive Positioning</CardTitle>
                  <CardDescription className="text-gray-400">
                    Multi-dimensional analysis of key performance areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} width={500} height={350} data={radarData}>
                        <PolarGrid stroke="#1E3A59" />
                        <PolarAngleAxis dataKey="subject" stroke="#556581" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#556581" />
                        <RechartsRadar
                          name="Your Plan"
                          dataKey="A"
                          stroke={CHART_COLORS.primary}
                          fill={CHART_COLORS.primary}
                          fillOpacity={0.5}
                        />
                        <RechartsRadar
                          name="Market Average"
                          dataKey="B"
                          stroke={CHART_COLORS.secondary}
                          fill={CHART_COLORS.secondary}
                          fillOpacity={0.5}
                        />
                        <Legend 
                          formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                          wrapperStyle={{ paddingTop: "15px" }}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: "#0A2540", 
                            borderColor: "#1E3A59",
                            borderRadius: "6px",
                            color: "#fff" 
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`${value}%`, '']}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Competitive Score Card */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">Competitive Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-44 h-44 flex items-center justify-center mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="80%"
                            outerRadius="100%"
                            barSize={10}
                            data={[{ name: 'score', value: planData.competitiveScore }]}
                            startAngle={90}
                            endAngle={-270}
                          >
                            <RadialBar
                              background={{ fill: '#01101F' }}
                              dataKey="value"
                              cornerRadius={30}
                              fill={planData.chartColor}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-4xl font-bold text-white">{planData.competitiveScore}</span>
                          <span className="text-gray-400 text-sm">out of 100</span>
                        </div>
                      </div>
                      
                      <div className="text-center mt-2">
                        <p className="text-gray-300">
                          {planData.competitiveScore >= 75 ? (
                            "Excellent market position"
                          ) : planData.competitiveScore >= 60 ? (
                            "Good market position"
                          ) : planData.competitiveScore >= 40 ? (
                            "Average market position"
                          ) : (
                            "Below average market position"
                          )}
                        </p>
                        <div className="flex items-center justify-center mt-1">
                          {planData.competitiveScore > 65 ? (
                            <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              Top 25%
                            </Badge>
                          ) : planData.competitiveScore < 45 ? (
                            <Badge className="bg-red-600/10 text-red-500 border-red-500/20">
                              <ArrowDown className="h-3 w-3 mr-1" />
                              Bottom 25%
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-600/10 text-amber-500 border-amber-500/20">
                              Mid-Range
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Key Insights Card */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Key Insights</CardTitle>
                    <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">
                      AI-Powered
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    Strategic recommendations for your plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-[#01101F] rounded-lg border border-emerald-500/20">
                    <div className="flex items-start">
                      <div className="bg-emerald-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Pricing advantage for younger segments</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Your pricing for ages 18-40 is 12% more competitive than market average. Consider featuring this in marketing materials.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <div className="flex items-start">
                      <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <Shield className="h-4 w-4 text-[#33BFFF]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Strong coverage assessment</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Your basic coverage is in the top 15% of the market, but premium tiers could benefit from additional options.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-amber-500/20">
                    <div className="flex items-start">
                      <div className="bg-amber-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <Radar className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Missing emergency evacuation</p>
                        <p className="text-gray-400 text-xs mt-1">
                          72% of competitor plans include emergency evacuation coverage. Consider adding this to remain competitive.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1E3A59] pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#1E3A59] text-white hover:bg-[#01101F] hover:border-[#33BFFF]"
                    onClick={generateInsights}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate More Insights
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Customer Sentiment Card */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader className="pb-0">
                  <CardTitle className="text-white">Consumer Sentiment</CardTitle>
                  <CardDescription className="text-gray-400">
                    Analysis from 1,200+ consumer reviews
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: "#0A2540", 
                            borderColor: "#1E3A59",
                            borderRadius: "6px",
                            color: "#fff" 
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`${value}%`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#33BFFF] mr-2"></div>
                      <span className="text-gray-300 text-xs">Very Positive (35%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#0055CC] mr-2"></div>
                      <span className="text-gray-300 text-xs">Positive (42%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#06AED4] mr-2"></div>
                      <span className="text-gray-300 text-xs">Neutral (18%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#1570EF] mr-2"></div>
                      <span className="text-gray-300 text-xs">Negative (5%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* SWOT Analysis Tab */}
        {analysisType === "swot" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2">
                    <span className="text-emerald-500 font-bold">S</span>
                  </div>
                  Strengths
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Competitive advantages of your plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {strengthsData.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-emerald-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <ArrowUp className="h-3 w-3 text-emerald-500" />
                    </div>
                    <p className="text-gray-300 text-sm">{strength}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Weaknesses Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-2">
                    <span className="text-red-500 font-bold">W</span>
                  </div>
                  Weaknesses
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Areas for improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {weaknessesData.map((weakness, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-red-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    </div>
                    <p className="text-gray-300 text-sm">{weakness}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Opportunities Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#33BFFF]/20 flex items-center justify-center mr-2">
                    <span className="text-[#33BFFF] font-bold">O</span>
                  </div>
                  Opportunities
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Potential areas for growth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {opportunitiesData.map((opportunity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <Sparkles className="h-3 w-3 text-[#33BFFF]" />
                    </div>
                    <p className="text-gray-300 text-sm">{opportunity}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Threats Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center mr-2">
                    <span className="text-amber-500 font-bold">T</span>
                  </div>
                  Threats
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Market challenges to address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {threatsData.map((threat, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-amber-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                    </div>
                    <p className="text-gray-300 text-sm">{threat}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Features Tab */}
        {analysisType === "features" && (
          <Card className="bg-[#0A2540] border-[#1E3A59]">
            <CardHeader>
              <CardTitle className="text-white">Feature Comparison</CardTitle>
              <CardDescription className="text-gray-400">
                How your plan features compare to competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Features Bar Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={featureComparisonData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3A59" opacity={0.3} horizontal={false} />
                      <XAxis 
                        type="number" 
                        stroke="#556581"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis 
                        dataKey="feature" 
                        type="category" 
                        stroke="#556581"
                        width={150}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: "#0A2540", 
                          borderColor: "#1E3A59",
                          borderRadius: "6px",
                          color: "#fff" 
                        }}
                        itemStyle={{ color: "#fff" }}
                        formatter={(value) => [`${value}%`, 'Competitors']}
                      />
                      <Bar 
                        dataKey="competitors" 
                        name="% of Competitors" 
                        fill={CHART_COLORS.primary}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Features Table */}
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1E3A59]">
                          <th className="text-left p-3 text-sm font-medium text-gray-400">Feature</th>
                          <th className="text-center p-3 text-sm font-medium text-gray-400">Your Plan</th>
                          <th className="text-right p-3 text-sm font-medium text-gray-400">Competitors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {featureComparisonData.map((feature, index) => (
                          <tr 
                            key={index} 
                            className="border-b border-[#1E3A59]"
                          >
                            <td className="p-3 text-white text-sm">{feature.feature}</td>
                            <td className="p-3 text-center">
                              {feature.yourPlan ? (
                                <div className="inline-flex items-center justify-center bg-emerald-900/20 p-1 rounded-full">
                                  <Check className="h-4 w-4 text-emerald-500" />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center bg-red-900/20 p-1 rounded-full">
                                  <X className="h-4 w-4 text-red-500" />
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-white text-sm text-right">{feature.competitors}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <h4 className="text-white font-medium mb-2">Recommendation</h4>
                    <p className="text-gray-300 text-sm">
                      Consider adding Emergency Evacuation coverage to your standard plan. 
                      This feature is present in 72% of competing plans and is highly valued by consumers 
                      planning international travel.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Pricing Tab */}
        {analysisType === "pricing" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pricing Tiers Analysis */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Pricing Tiers Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    Age-based pricing comparison with the market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pricingTiersData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3A59" opacity={0.3} vertical={false} />
                        <XAxis 
                          dataKey="name" 
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
                          tickFormatter={(value) => `$${value}`}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: "#0A2540", 
                            borderColor: "#1E3A59",
                            borderRadius: "6px",
                            color: "#fff" 
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`$${value}`, '']}
                        />
                        <Legend 
                          formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                          wrapperStyle={{ paddingTop: "15px" }}
                        />
                        <Bar 
                          dataKey="you" 
                          name="Your Plan" 
                          fill={CHART_COLORS.primary} 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="marketAverage" 
                          name="Market Average" 
                          fill={CHART_COLORS.secondary} 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="marketBest" 
                          name="Market Best" 
                          fill={CHART_COLORS.tertiary} 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1E3A59] pt-4">
                  <div className="flex items-start w-full">
                    <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <Sparkles className="h-4 w-4 text-[#33BFFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Competitive Advantage</p>
                      <p className="text-gray-400 text-sm">
                        Your pricing for younger demographics (18-40) is more competitive than the market average, 
                        providing an advantage in this segment. However, your pricing for the 61+ age group could 
                        be more competitive.
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Price Trend Analysis */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Price Trend Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    How your pricing has evolved compared to the market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{
                          top: 20,
                          right: 20,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3A59" opacity={0.3} />
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
                          tickFormatter={(value) => `$${value}`}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: "#0A2540", 
                            borderColor: "#1E3A59",
                            borderRadius: "6px",
                            color: "#fff" 
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`$${value}`, '']}
                        />
                        <Legend 
                          formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                          wrapperStyle={{ paddingTop: "15px" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="you"
                          name="Your Plan"
                          stroke={CHART_COLORS.primary}
                          strokeWidth={2}
                          dot={{ r: 4, fill: CHART_COLORS.primary, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: CHART_COLORS.primary, stroke: "#fff", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="marketAverage"
                          name="Market Average"
                          stroke={CHART_COLORS.secondary}
                          strokeWidth={2}
                          dot={{ r: 4, fill: CHART_COLORS.secondary, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: CHART_COLORS.secondary, stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1E3A59] pt-4">
                  <div className="flex items-start w-full">
                    <div className="bg-amber-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Diverging Trend</p>
                      <p className="text-gray-400 text-sm">
                        Your pricing has remained more stable while the market average has been increasing. 
                        This improves your competitive position but may impact profitability if costs are rising.
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Price-Value Matrix Card */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Pricing Insights</CardTitle>
                  <CardDescription className="text-gray-400">
                    Strategic opportunities based on pricing analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <div className="flex items-start">
                      <div className="bg-emerald-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <ArrowUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Value Advantage</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Your plan offers more coverage at a lower price for ages 18-40, resulting in excellent 
                          value perception. Market this advantage to younger demographics.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <div className="flex items-start">
                      <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <Sparkles className="h-4 w-4 text-[#33BFFF]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Tiered Pricing Opportunity</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Consider adjusting your 61+ age band pricing to be more competitive. Our analysis 
                          suggests a 15% reduction would significantly increase your competitive position while 
                          maintaining profitability.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <div className="flex items-start">
                      <div className="bg-amber-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Feature-Price Position</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Your plan is missing emergency evacuation coverage which 72% of competitors offer. 
                          Adding this feature would justify a 5-8% price increase across all tiers while improving 
                          market position.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Price Impact Simulator */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Price Impact Simulator</CardTitle>
                  <CardDescription className="text-gray-400">
                    Estimate impact of price adjustments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="price-adjustment" className="text-white">Price adjustment</Label>
                      <Badge className="bg-[#01101F] text-gray-300">-15% to +15%</Badge>
                    </div>
                    <Input
                      id="price-adjustment"
                      type="number"
                      placeholder="0%"
                      className="bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age-band" className="text-white">Age band</Label>
                    <Select>
                      <SelectTrigger 
                        id="age-band"
                        className="bg-[#01101F] border-[#1E3A59] text-white focus:ring-[#33BFFF]"
                      >
                        <SelectValue placeholder="Select age band" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                        <SelectItem value="18-30">18-30</SelectItem>
                        <SelectItem value="31-40">31-40</SelectItem>
                        <SelectItem value="41-50">41-50</SelectItem>
                        <SelectItem value="51-60">51-60</SelectItem>
                        <SelectItem value="61+">61+</SelectItem>
                        <SelectItem value="all">All age bands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    className="w-full bg-[#1570EF] hover:bg-[#0E63D6] mt-2"
                  >
                    Calculate Impact
                  </Button>
                  
                  <div className="pt-3 border-t border-[#1E3A59] mt-3">
                    <p className="text-gray-400 text-xs italic">
                      Use this simulator to estimate how price adjustments would affect your market position, 
                      competitiveness, and projected revenue.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Market Trends Tab */}
        {analysisType === "trends" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Trend Graph */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Market Pricing Trends</CardTitle>
                  <CardDescription className="text-gray-400">
                    How pricing has evolved in the {planData.type.toLowerCase()} insurance category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { month: "Jan 2024", market: 100, you: 105 },
                          { month: "Feb 2024", market: 102, you: 105 },
                          { month: "Mar 2024", market: 104, you: 106 },
                          { month: "Apr 2024", market: 108, you: 106 },
                          { month: "May 2024", market: 112, you: 106 },
                          { month: "Jun 2024", market: 115, you: 107 },
                          { month: "Jul 2024", market: 118, you: 107 },
                          { month: "Aug 2024", market: 120, you: 108 },
                          { month: "Sep 2024", market: 123, you: 108 },
                          { month: "Oct 2024", market: 125, you: 109 },
                          { month: "Nov 2024", market: 127, you: 109 },
                          { month: "Dec 2024", market: 130, you: 110 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <defs>
                          <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3A59" opacity={0.3} />
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
                          domain={[90, 140]}
                          tickFormatter={(value) => `${value}`}
                          label={{ value: "Index (Jan 2024 = 100)", angle: -90, position: 'insideLeft', fill: '#556581', fontSize: 12 }}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: "#0A2540", 
                            borderColor: "#1E3A59",
                            borderRadius: "6px",
                            color: "#fff" 
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`Index: ${value}`, '']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="market" 
                          name="Market Average" 
                          stroke={CHART_COLORS.secondary} 
                          fillOpacity={1} 
                          fill="url(#colorMarket)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="you" 
                          name="Your Plan" 
                          stroke={CHART_COLORS.primary} 
                          fillOpacity={1} 
                          fill="url(#colorYou)" 
                        />
                        <Legend 
                          formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                          wrapperStyle={{ paddingTop: "15px" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1E3A59] pt-4">
                  <div className="flex items-start w-full">
                    <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <TrendingUp className="h-4 w-4 text-[#33BFFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Growing Price Advantage</p>
                      <p className="text-gray-400 text-sm">
                        Market prices have increased by 30% over the past year while your plan's price 
                        has only increased by 10%. This has improved your competitive pricing position 
                        significantly, with a projected 15-20% competitive advantage by end of year if trends continue.
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Market Feature Trends */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Feature Adoption Trends</CardTitle>
                  <CardDescription className="text-gray-400">
                    Growing popularity of features in the market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { 
                            quarter: "Q1 2023", 
                            emergency: 60, 
                            adventure: 28, 
                            preexisting: 20, 
                            telehealth: 30 
                          },
                          { 
                            quarter: "Q2 2023", 
                            emergency: 63, 
                            adventure: 32, 
                            preexisting: 23, 
                            telehealth: 38 
                          },
                          { 
                            quarter: "Q3 2023", 
                            emergency: 67, 
                            adventure: 36, 
                            preexisting: 26, 
                            telehealth: 45 
                          },
                          { 
                            quarter: "Q4 2023", 
                            emergency: 70, 
                            adventure: 40, 
                            preexisting: 28, 
                            telehealth: 50 
                          },
                          { 
                            quarter: "Q1 2024", 
                            emergency: 72, 
                            adventure: 45, 
                            preexisting: 32, 
                            telehealth: 58 
                          },
                          { 
                            quarter: "Q2 2024", 
                            emergency: 75, 
                            adventure: 48, 
                            preexisting: 35, 
                            telehealth: 65 
                          },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3A59" opacity={0.3} />
                        <XAxis 
                          dataKey="quarter" 
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
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: "#0A2540", 
                            borderColor: "#1E3A59",
                            borderRadius: "6px",
                            color: "#fff" 
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`${value}%`, '']}
                        />
                        <Legend 
                          formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                          wrapperStyle={{ paddingTop: "15px" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="emergency"
                          name="Emergency Evacuation"
                          stroke={CHART_COLORS.primary}
                          strokeWidth={2}
                          dot={{ r: 4, fill: CHART_COLORS.primary, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: CHART_COLORS.primary, stroke: "#fff", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="adventure"
                          name="Adventure Sports"
                          stroke={CHART_COLORS.secondary}
                          strokeWidth={2}
                          dot={{ r: 4, fill: CHART_COLORS.secondary, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: CHART_COLORS.secondary, stroke: "#fff", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="preexisting"
                          name="Pre-existing Conditions"
                          stroke={CHART_COLORS.tertiary}
                          strokeWidth={2}
                          dot={{ r: 4, fill: CHART_COLORS.tertiary, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: CHART_COLORS.tertiary, stroke: "#fff", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="telehealth"
                          name="Telehealth Services"
                          stroke={CHART_COLORS.quaternary}
                          strokeWidth={2}
                          dot={{ r: 4, fill: CHART_COLORS.quaternary, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: CHART_COLORS.quaternary, stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1E3A59] pt-4">
                  <div className="flex items-start w-full">
                    <div className="bg-amber-900/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Emerging Feature Gap</p>
                      <p className="text-gray-400 text-sm">
                        Telehealth services have seen the fastest adoption rate, growing from 30% to 65% 
                        of plans in the past 18 months. This feature is not currently included in your plan, 
                        creating a potential competitive disadvantage.
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Trend Insights Card */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">Trend Insights</CardTitle>
                  <CardDescription className="text-gray-400">
                    Key market movements and opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <div className="flex items-start">
                      <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-[#33BFFF]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Telehealth Integration</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Telehealth services have become the fastest-growing feature in travel insurance, 
                          with 65% of plans now including it (up from 30% in 2023). Consider adding this feature 
                          to maintain competitiveness.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <div className="flex items-start">
                      <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-[#33BFFF]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Price Inflation</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Market prices have increased 30% over the past year, significantly faster than your 
                          plan (10%). This presents an opportunity to either increase prices moderately while 
                          maintaining a competitive advantage, or maintain current pricing for a stronger 
                          value proposition.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <div className="flex items-start">
                      <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-[#33BFFF]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Consumer Demand Shift</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Market data shows growing demand for adventure sports coverage, with inclusion 
                          rates increasing from 28% to 48% of plans. This is especially prominent among 
                          the 25-40 age demographic, which aligns with your pricing advantage.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 12-Month Forecast Card */}
              <Card className="bg-[#0A2540] border-[#1E3A59]">
                <CardHeader>
                  <CardTitle className="text-white">12-Month Forecast</CardTitle>
                  <CardDescription className="text-gray-400">
                    Projected market changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <h4 className="text-white font-medium text-sm">Price Trend</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-400 text-xs">Market Avg Increase</span>
                      <Badge className="bg-amber-600/10 text-amber-500 border-amber-500/20">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        12-15%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <h4 className="text-white font-medium text-sm">Top Emerging Features</h4>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Telehealth Services</span>
                        <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          75%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Adventure Sports</span>
                        <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          55%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Pre-existing Conditions</span>
                        <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          40%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#01101F] rounded-lg border border-[#1E3A59]">
                    <h4 className="text-white font-medium text-sm">Growth Segments</h4>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Digital Nomads</span>
                        <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Fastest
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Adventure Travelers</span>
                        <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          High
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Senior Travelers</span>
                        <Badge className="bg-amber-600/10 text-amber-500 border-amber-500/20">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Moderate
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1E3A59] pt-4">
                  <Button 
                    variant="link" 
                    className="text-[#33BFFF] hover:text-white p-0 h-auto text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download full forecast report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}