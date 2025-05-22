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
import Navbar from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#001A40] via-[#00142E] to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
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
              {/* Continue with the rest of your components */}
              {/* For brevity, I'm omitting the rest of the components since they don't change */}
            </div>
          )}

          {/* The rest of your specific analysis tabs would go here */}
        </div>
      </div>
    </div>
  );
}